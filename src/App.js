/* global window */
import React, {useState, useEffect} from 'react';
import Trips from './Trips'
import {getData} from './ApiData'
// import Notes from './ApiData'
import { LayerControls, MapStylePicker, HEXAGON_CONTROLS } from './controls';


export default class App extends React.Component{

  state = {
    data: null,
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'
  }

  componentDidMount(){
    fetch('./geojson.json', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
     
    })
    .then(response => response.json())//解析为Promise
    .then(data => {    
      this.setState({data: data['features']})  ////赋值到本地数据
      // console.log(data)
      this._processData();
    })

  }

  onStyleChange = style => {
    this.setState({ style });
  };

  _processData = () => {
    const data = this.state.data.reduce(
      (accu, curr) => {
        // add all points and timestamp of a vehicle id
        // [{"vehicle_id": , path:[[,],[],[]...], timestamps:[]},...]

        // process timestamp
        let currTimestamp = new Date(
          curr.properties.timestamp.substring(0, 19) // '2021-09-20 12:51:46-04:00'
          );
        currTimestamp = currTimestamp.getMinutes() * 60 + currTimestamp.getSeconds()

        const index = accu.findIndex((currentValue) => currentValue.vehicle_id === curr.properties.vehicle_id);
        if (index < 0) {
          // didn't find the vehicle, create new
          accu.push({
            vehicle_id: curr.properties.vehicle_id,
            path: [curr.geometry.coordinates],
            timestamps: [currTimestamp]
          })
          
        } else {
          // add to the path and timestamps
          accu[index].path.push(curr.geometry.coordinates)
          accu[index].timestamps.push(currTimestamp)
        }

        return accu;
      },
      []
    );

    console.log("new data", data)

    this.setState({data});
  };

  render(){
    console.log("this.state.data in render", this.state.data)

    return (
      <div>
        <MapStylePicker
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        />
        <Trips trips={this.state.data} mapStyle={this.state.style}/>

      </div>
    )
  }
}