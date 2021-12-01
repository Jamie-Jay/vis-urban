import React from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { MapLayersReal } from './MapLayersReal'
import { getPointsFromPath, calculateBunchingPoints, getPathFromPoints } from './helper/formatData'
import { layerControl } from './helper/style';
import { MapStylePicker } from './helper/controllers';
import { PANELS_TO_SHOW } from './helper/settings'
import { Loading } from './components/Loading'
import { Aside } from './components/Aside'

const DURATION = 3 // minutes

export default class AppReal extends React.Component{

  state = {
    dataCollection: {},
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
    prevTimestamp: 0, // s
    earliestTimestamp: 0, // ms
    storedTimestamps: [], // stored time stamps from 
    panelVisibilitySettings: null
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate')
    return nextState.prevTimestamp !== this.state.prevTimestamp
          || nextState.style !== this.state.style
          || nextState.panelVisibilitySettings !== this.state.panelVisibilitySettings
  }

  componentDidMount(){
    const panelVisibilitySettings = Object.keys(PANELS_TO_SHOW).reduce(
      (accu, key) => ({
        ...accu,
        [key]: PANELS_TO_SHOW[key].value
      }),
      {}
    )
    this.setState({
      earliestTimestamp: new Date().getTime(),
      panelVisibilitySettings
    })

    this.queryData()
  }
/**
   * @Author: Lq
   * @description: 在组件销毁前撤销异步请求
   */  
 componentWillUnmount() {
  clearInterval(this.timer)
  this.setState = () => {
    return;
  }
}

  queryData() {
    const urlStr = 'https://vj9tinkr4k.execute-api.us-east-1.amazonaws.com/dev/ALL';//
    // const urlStr = 'http://localhost:4000/dev/BX4'
    // const urlStr = 'http://localhost:4000/dev/'
    // const urlStr = 'https://vj9tinkr4k.execute-api.us-east-1.amazonaws.com/dev/';//'http://localhost:5000/'
    this.timer = setInterval(() => {
      NProgress.start();
      fetch(urlStr, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
      })
    //   fetch(urlStr, {
    //     method: "POST",
    //     mode: 'cors',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json'
    //       },
    // 　　body:JSON.stringify({
    //   　　'routeId' : 'ALL' // 'ALL' to get all positions
    //   　　})
    //   })
      .then(response => response.json()) // Promise
      .then(data =>  {
        // console.log(data)
        const { dataCollection, prevTimestamp} = this.state;

        let newPoints = dataCollection.points ? dataCollection.points : []
        if (prevTimestamp < data.timestamp) { // ignore data with the same timestamp
          data.positions.map((curr) => {
              newPoints.push({
                vehicle_id: curr.vehicle.id,
                route: curr.trip.routeId,
                position: [curr.position.longitude, curr.position.latitude],
                bearing: curr.position.bearing,
                timestamp:  Number(curr.timestamp) * 1000,
                direction: curr.trip.directionId,
                speedmph: 50
              })
          })

          // delete the points that is beyond 1 min frame
          if (data.timestamp * 1000 > this.state.earliestTimestamp + DURATION * 60 * 1000) {
            // pop out the outdated data
            this.setState({
            }, () => {
            for (let i = 0; i < newPoints.length; i++) {
              if (newPoints[i].timestamp < (data.timestamp - DURATION * 60) * 1000) {
                // pop the first ele  
                newPoints.shift()
                // console.log('deleting points')
              } else {
                // the data in points are always in time order
                break
              }
            }
            })
          }

          // transfrom points to paths format
          const newPaths = getPathFromPoints(newPoints)
          newPoints = getPointsFromPath(newPaths)
          calculateBunchingPoints(newPoints, newPaths, 0.5, 120)
          this.setState({
            earliestTimestamp: newPoints[0].timestamp,
            prevTimestamp: data.timestamp,
            dataCollection: {
              points: newPoints,
              paths: newPaths
            }
          })
        }
      }    
      ) // Promise
      NProgress.done();
    }, 5000);
  }

  onStyleChange = style => {
    this.setState({ style });
  };

  setPanelVisibility = (settings) => {
    console.log(settings)
    this.setState({
      panelVisibilitySettings: settings
    })
  }

  render(){
    // console.log("this.state in render", this.state)
    // console.log("dataCollection in render", this.state.dataCollection.points)
    const isLoading = this.state.prevTimestamp * 1000 - this.state.earliestTimestamp < 60 * 1000 // show loading label when the data is less than one minute's worth

    return (
      <div>
         <MapStylePicker 
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        />
        <MapLayersReal
          data={this.state.dataCollection}
          currMinTime={this.state.earliestTimestamp}
          currMaxTime={this.state.prevTimestamp * 1000}
          mapStyle={this.state.style}
          show={!isLoading}
          panelVisibilitySettings={this.state.panelVisibilitySettings}
          // setSelectedDataSource={this.setSelectedDataSource}
        />
        { this.state.panelVisibilitySettings && this.state.panelVisibilitySettings.currentDataSourcePanel === true ?
          <span style={{...layerControl, top: '0px', right: '900px'}}>
            <b>Current Data Source:</b>
            <br/>
            {new Date().toLocaleString()}
            <br/>
            ALL NEW YORK CITY BUS ROUTES
          </span>
          : null
        }
        {isLoading ?
          <Loading flag={this.state.show}></Loading>
        : null}

        <Aside
          titleIndex={0}
          setPanelVisibility={this.setPanelVisibility}
        />
      </div>
    )
  }
}