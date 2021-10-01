import React from 'react';
import { MapLayers } from './MapLayers'
import { MapStylePicker } from './helper/controls';
import { getDataFromJson, getPointsFromJson } from './helper/formatData'
import { layerControl } from './helper/style';

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

export default class App extends React.Component{

  state = {
    dataJson: [],
    data: [],
    points: [],
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
    selectedTimeStamp: START_TIME,
    busRoute: 'Bx2' 
    // TODO: multiple select - singapore bus example
  }

  componentDidMount(){
    this.getApiData (START_TIME, 'Bx2')
  }

   getApiData = async (selectedTimeStamp, busRoute, readLocalFile = false) => {
    // combine url
    // const { selectedTimeStamp, busRoute } = this.state
    const urlStr = readLocalFile ? './geojson.json' : getUrl(selectedTimeStamp, busRoute)
    // console.log(urlStr)

    await fetch(urlStr, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
    })
    .then(response => response.json())// Promise
    .then(data => {
      // console.log('url data', data)

      // empty data points
      if (data['features'] && data['features'].length > 0) {
        this.setState({dataJson: data['features']})
        this._processData();

        this.setState({
          selectedTimeStamp, busRoute
        })
      } else {
        alert('data points for ' + new Date(selectedTimeStamp) + ' ' + busRoute + ' is empty. Please choose another timepoint or bus route.');
      }
    }, err => {
      // Status Code: 500 Internal Server Error
      console.log(err); 
      alert(err);
      // this.getApiData(0, 0, readLocalFile = true)
    })

    /** url exceptions:
     * http://api.buswatcher.org/api/v2/nyc/2021/9/15/12/Bx2/buses/geojson: Internal Server Error
     * {
          "type": "Shipment",
          "Status": "False",
          "Request": {
              "Year": "2020",
              "Month": "10",
              "Day": "15",
              "Hour": "0",
              "Route": "M1"
          }
      }
     * http://api.buswatcher.org/api/v2/nyc/2021/9/27/1/Bx17/buses/geojson: { "type": "FeatureCollection", "features": [] }
     */
  }

  _processData = () => {

    const data = getDataFromJson(this.state.dataJson)
    const points = getPointsFromJson(this.state.dataJson)

    this.setState({ data, points })
  };

  onStyleChange = style => {
    this.setState({ style });
  };

  getSelectedTime = (selectedTimeStamp) => {
    if (selectedTimeStamp > START_TIME 
      && selectedTimeStamp !== this.state.selectedTimeStamp) {
      this.getApiData (selectedTimeStamp, this.state.busRoute)
    }
  }

  getSelectedRoute = (busRoute) => {
    if (busRoute !== this.state.busRoute) {
      this.getApiData (this.state.selectedTimeStamp, busRoute)
    }
  }

  render(){
    // console.log("this.state in render", this.state)

    return (
      <div>
        <MapStylePicker
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        />
        <MapLayers 
          trips={this.state.data}
          points={this.state.points} 
          geojson={this.state.dataJson} 
          mapStyle={this.state.style}
          getSelectedTime={this.getSelectedTime}
          getSelectedRoute={this.getSelectedRoute}
        />
        <span style={{...layerControl, top: '0px'}}>
          <b>Current Data Source:</b>
          <br/>
          {new Date(this.state.selectedTimeStamp).toString()}
          <br/>
          {this.state.busRoute}
        </span>
      </div>
    )
  }
}