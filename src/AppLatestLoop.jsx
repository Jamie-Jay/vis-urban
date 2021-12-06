import React from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { MapLayersLatestLoop } from './MapLayersLatestLoop'
import { getPointsFromPath, calculateBunchingPoints, getPathFromPoints } from './helper/formatData'
import { layerControl } from './helper/style';
import { PANELS_TO_SHOW_REAL } from './helper/settings'
import { INIT_MAP_STYLE } from './helper/constants'
import { Loading } from './components/Loading'
import { Aside } from './components/Aside'

const PLAYBACK_DURATION = 5 // minutes
const LOADING_DURATION = 30 // seconds

export default class AppLatestLoop extends React.Component{

  state = {
    dataCollection: {},
    prevTimestamp: 0, // s
    earliestTimestamp: new Date().getTime(), // ms
    storedTimestamps: [], // stored time stamps from 
    menuSettings: Object.keys(PANELS_TO_SHOW_REAL).reduce(
      (accu, key) => ({
        ...accu,
        [key]: PANELS_TO_SHOW_REAL[key].value
      }),
      {
        mapThemeStyle: INIT_MAP_STYLE
      }
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponentUpdate')
    return nextState.prevTimestamp !== this.state.prevTimestamp
          || nextState.style !== this.state.style
          || nextState.menuSettings !== this.state.menuSettings
  }

  componentDidMount(){
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

              return newPoints
          })

          // delete the points that is beyond 1 min frame
          if (data.timestamp * 1000 > this.state.earliestTimestamp + PLAYBACK_DURATION * 60 * 1000) {
            // pop out the outdated data
            this.setState({
            }, () => {
            for (let i = 0; i < newPoints.length; i++) {
              if (newPoints[i].timestamp < (data.timestamp - PLAYBACK_DURATION * 60) * 1000) {
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

  setMeneItems = (settings) => {
    // console.log(settings)
    this.setState({
      menuSettings: settings
    })
  }

  render(){
    // console.log("this.state in render", this.state)
    // console.log("dataCollection in render", this.state.dataCollection.points)
    const isLoading = this.state.prevTimestamp * 1000 - this.state.earliestTimestamp < LOADING_DURATION * 1000 // show loading label when the data is less than one minute's worth

    return (
      <div>
        <MapLayersLatestLoop
          data={this.state.dataCollection}
          currMinTime={this.state.earliestTimestamp}
          currMaxTime={this.state.prevTimestamp * 1000}
          show={!isLoading}
          menuSettings={this.state.menuSettings}
        />
        { this.state.menuSettings && this.state.menuSettings.currentDataSourcePanel === true ?
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
          setMeneItems={this.setMeneItems}
          penelsToShow={PANELS_TO_SHOW_REAL}
        />
      </div>
    )
  }
}