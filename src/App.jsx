/* global window */
import React from 'react';
import { MapLayers } from './MapLayers'
import { MapStylePicker } from './controls';

// console.log(new Date(2021,8,1).getTime()) // 2021-9-1: 1630468800000
const START_TIME = 1630468800000;
const BASE_URL_CAMPUS = 'http://10.92.214.223/';
const BASE_URL = 'http://api.buswatcher.org/';

function getUrl(selectedTimeStamp, busRoute) {
    // combine url
    const dt = new Date(selectedTimeStamp)
    return (
      BASE_URL + 'api/v2/nyc/'
      + dt.getFullYear() + '/'
      + ( dt.getMonth() + 1 ) + '/'
      + dt.getDate() + '/'
      + dt.getHours() + '/'
      + busRoute
      + '/buses/geojson'
    );
}

function getDataFromJson (rawData) {
  return rawData.reduce(
    (accu, curr) => {
      // add all points and timestamp of a vehicle id
      // [{"vehicle_id": , path:[[,],[],[]...], timestamps:[]},...]

      // process timestamp
      let currTimestamp = new Date(
        curr.properties.timestamp.substring(0, 19) // '2021-09-20 12:51:46-04:00'
        );
      currTimestamp = currTimestamp.getMinutes() * 60 + currTimestamp.getSeconds()

      // make up speed
      let speed = Math.random() * 10;

      const index = accu.findIndex((currentValue) => currentValue.vehicle_id === curr.properties.vehicle_id);
      if (index < 0) {
        // didn't find the vehicle, create new
        accu.push({
          vehicle_id: curr.properties.vehicle_id,
          path: [curr.geometry.coordinates],
          timestamps: [currTimestamp],
          speedmph: [speed],
          // realTimes: [curr.properties.timestamp]
        })
        
      } else {
        // add to the path and timestamps
        accu[index].path.push(curr.geometry.coordinates)
        accu[index].timestamps.push(currTimestamp)
        accu[index].speedmph.push(speed)
        // accu[index].realTimes.push(curr.properties.timestamp)
      }

      return accu;
    },
    []
  );
}

function getPointsFromJson (rawData) {
  return rawData.reduce(
    (accu, curr) => {
      // make up speed
      let speed = Math.random() * 10;

      accu.push({
        position: curr.geometry.coordinates,
        vehicle_id: curr.properties.vehicle_id,
        // time: time,
        bearing: curr.properties.bearing,
        speedmph: speed
      })
      return accu;
    },
    []
  );
}

export default class App extends React.Component{

  state = {
    data: [],
    points: [],
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
    // selectedTimeStamp: START_TIME, // one select delay -- why?
    // busRoute: 'Bx2' // one select delay -- why?
  }

  componentDidMount(){
    this.getApiData (START_TIME, 'Bx2')
  }

   getApiData = async (selectedTimeStamp, busRoute) => {
    // combine url
    // const { selectedTimeStamp, busRoute } = this.state
    const urlStr = getUrl(selectedTimeStamp, busRoute)
    console.log(urlStr)

    await fetch(urlStr, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
    })
    .then(response => response.json())//解析为Promise
    .then(data => {
      console.log('url data', data)

      this.setState({data: data['features']})  ////赋值到本地数据
      this._processData();
    }, err => {console.log(err); alert(err)})

    /** url exceptions:
     * http://api.buswatcher.org/api/v2/nyc/2021/9/15/12/Bx2/buses/geojson: Internal Server Error
     * http://api.buswatcher.org/api/v2/nyc/2021/9/27/1/Bx17/buses/geojson: { "type": "FeatureCollection", "features": [] }
     */
  }

  _processData = () => {

    const data = getDataFromJson(this.state.data)
    const points = getPointsFromJson(this.state.data)

    this.setState({data, points});
  };

  onStyleChange = style => {
    this.setState({ style });
  };

  getSelectedDataSource = (selectedTimeStamp, busRoute) => {
    // console.log(selectedTimeStamp, busRoute)
    let dataChanged = false
    if (selectedTimeStamp > START_TIME && selectedTimeStamp !== this.state.selectedTimeStamp ) {
      // console.log('time stamp changed')
      // this.setState ({ // one select delay -- why?
      //   selectedTimeStamp
      // });
      dataChanged = true;
    }

    if (busRoute !== this.state.busRoute ) {
      // console.log('bus route changed to', busRoute)
      // this.setState ({ // one select delay -- why?
      //   busRoute
      // });
      // console.log('new route', this.state.busRoute)
      dataChanged = true;         
    }

    if (dataChanged) {
      this.getApiData (selectedTimeStamp, busRoute); 
    }
  }

  render(){
    // console.log("this.state.data in render", this.state.data)
    // console.log("this.state.selectedTimeStamp in render", new Date(this.state.selectedTimeStamp))

    return (
      <div>
        <MapStylePicker
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        />
        <MapLayers 
          trips={this.state.data} 
          points={this.state.points} 
          mapStyle={this.state.style}
          getSelectedDataSource={this.getSelectedDataSource}
        />
      </div>
    )
  }
}