import React from 'react';
import { MapLayersReal } from './MapLayersReal'
// import { MapLayersRealStatic } from './MapLayersRealStatic'
import { getPathFromJson, getPointsFromPath, calculateBunchingPoints, getGeoJsonFromPoints, getPathFromPoints } from './helper/formatData'
// import { layerControl } from './helper/style';
import { MapStylePicker } from './helper/controllers';
// import { START_TIME, COMMON_BUS_ROUTES } from './helper/constants';
// import { getUrl } from './helper/helperFuns'
// // import { Aside } from './components/Aside'
// import Header from './components/Header'
// import { queryData } from './realTime/queryData'

const DURATION = 3 // minutes

export default class AppReal extends React.Component{

  state = {
    dataCollection: {},
    // dataToShow: [],
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
    // selectedTimeStamp: START_TIME,
    // busRoutes: [],
    // currMaxTime: 4000,
    // currMinTime: 0,
    prevTimestamp: 0, // s
    earliestTimestamp: 0 // ms
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate')
    return nextState.prevTimestamp !== this.state.prevTimestamp
          || nextState.style !== this.state.style
  }

  componentDidMount(){
    this.setState({
      earliestTimestamp: new Date().getTime()
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
          // console.log(data.timestamp * 1000, this.state.earliestTimestamp, data.timestamp * 1000 - this.state.earliestTimestamp)
          if (data.timestamp * 1000 > this.state.earliestTimestamp + DURATION * 60 * 1000) {
            // pop out the outdated data
            this.setState({
              earliestTimestamp: (data.timestamp - DURATION * 60) * 1000
            }, () => {
            for (let i = 0; i < newPoints.length; i++) {
              if (newPoints[i].timestamp < this.state.earliestTimestamp) {
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
          // console.log('queryData', newPoints)
          // console.log('queryData', newPaths)
          this.setState({
            prevTimestamp: data.timestamp,
            dataCollection: {
              points: newPoints,
              paths: newPaths
            }
          })
        }
      }    
      ) // Promise
    }, 5000);
  }

  onStyleChange = style => {
    this.setState({ style });
  };

  render(){
    // console.log("this.state in render", this.state)
    // console.log("dataCollection in render", this.state.dataCollection.points)

    return (
      <div>
        hello
         <MapStylePicker 
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        />
        <MapLayersReal
          data={this.state.dataCollection}
          currMinTime={this.state.earliestTimestamp}
          currMaxTime={new Date().getTime()}
          mapStyle={this.state.style}
          // setSelectedDataSource={this.setSelectedDataSource}
        />
        {/*<span style={{...layerControl, top: '0px'}}>
          <b>Current Data Source:</b>
          <br/>
          {new Date(this.state.selectedTimeStamp).toString()}
          <br/>
          {this.state.busRoutes.join(', ')}
        </span>
        <Aside
          dateTime={new Date(this.state.selectedTimeStamp).toString()}
          busRoutes={this.state.busRoutes.join(', ')}
        />
        {/* <Header 
          dateTime={new Date(this.state.selectedTimeStamp).toString()}
          busRoutes={this.state.busRoutes.join(', ')}
          /> */}
      </div>
    )
  }
}