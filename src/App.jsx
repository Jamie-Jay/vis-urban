import React from 'react';
import { MapLayers } from './MapLayers'
import { MapStylePicker, START_TIME, BUS_ROUTES } from './helper/controls';
import { getDataFromJson, getPointsFromJson } from './helper/formatData'
import { layerControl } from './helper/style';

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
    dataJsonCollection: [], // store all the raw json from api - [ bus-timestamp: {json}, bus-timestamp: {json}...]
    dataToShow: [],
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
    selectedTimeStamp: START_TIME,
    busRoutes: BUS_ROUTES
  }

  componentDidMount(){
    this.updateDataCollection(this.state.selectedTimeStamp, this.state.busRoutes)
  }

  getApiData = async (selectedTimeStamp, busRoute, readLocalFile = false) => {
    // combine url
    const urlStr = readLocalFile ? './geojson.json' : getUrl(selectedTimeStamp, busRoute)
    // console.log(urlStr)

    await fetch(urlStr, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
    })
    .then(response => response.json()) // Promise
    .then(data => {
      // console.log('url data', data)

      // not empty data points
      if (data['features'] && data['features'].length > 0) {
        const {path, points} = this._processData(data['features']);

        const dataKey = this.getDataKey(selectedTimeStamp, busRoute);
        this.setState((previousState) => {
          return {
            dataJsonCollection: {
              ...previousState.dataJsonCollection,
              [dataKey] : {
                show: true,             // if show on the map
                json: data['features'], // raw geojson
                path: path,             // trip format data
                points: points          // scatterplot/hexagons format data
              }
            }
          }
        },
        () => this.setDataToShow()
        );
      } else {
        alert('Data points for ' + new Date(selectedTimeStamp) + ' ' + busRoute + ' is empty. Please choose another timepoint or bus route.');
      }
    }, err => {
      // Status Code: 500 Internal Server Error
      console.log(err); 
      alert('Data points for ' + new Date(selectedTimeStamp) + ' ' + busRoute + ' is not available.', err);
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

  _processData = (rawData) => {

    const path = getDataFromJson(rawData)
    const points = getPointsFromJson(rawData)

    return { path, points }
  };

  setDataToShow() {
    // recombine dataToShow
    let jsonList = []
    let pathList = []
    let pointsList = []
    let dataShowedLabel = []

    const { dataJsonCollection} = this.state;

    for (let key in dataJsonCollection) {
      if (dataJsonCollection[key].show === true) {

        jsonList.push(...dataJsonCollection[key].json);
        pathList.push(...dataJsonCollection[key].path);
        pointsList.push(...dataJsonCollection[key].points);

        dataShowedLabel.push(key) 
      }
    }

    this.setState({
      // dataToShow: dataList
      dataToShow: {
        json: jsonList,
        path: pathList,
        points: pointsList
      }
    },
    () => this.updateDataLabel(dataShowedLabel)
    )
  }

  updateDataLabel(dataShowedLabel) {
    let timestamp = START_TIME;
    let buses = [];

    if (dataShowedLabel.length > 0) {
      // timestamp is always the same
      timestamp = Number(dataShowedLabel[0].split('-')[1])
      for (let index = 0; index < dataShowedLabel.length; index++) {
        buses.push(dataShowedLabel[index].split('-')[0]);
      }
    }

    this.setState({
      selectedTimeStamp: timestamp,
      busRoutes: buses
    })
  }

  onStyleChange = style => {
    this.setState({ style });
  };

  getDataKey(timestamp, busRoute) {
    return busRoute + '-' + timestamp;
  }

  updateDataCollection(selectedTimeStamp, busRoutes) {
    // get all the possible combination of timestamp and busroute
    // then compare with the keys in data collection
    const { dataJsonCollection} = this.state;
    let hasUpdate = false;

    // set all show status to false
    for (let ele in dataJsonCollection) {
      dataJsonCollection[ele].show = false;
    }

    for (let index = 0; index < busRoutes.length; index++) {
      const element = busRoutes[index];
      const currKey = this.getDataKey(selectedTimeStamp, element);

      if (dataJsonCollection[currKey]) {
        // set show to true
        dataJsonCollection[currKey].show = true;
      } else {
        // request url
        this.getApiData (selectedTimeStamp, element);
        hasUpdate = true
      }
    }

    return hasUpdate
  }

  setSelectedDataSource = (newChoice) => {

    const {dataTime, busRoutes} = newChoice;
    // console.log('app', dataTime, busRoutes)
    if (this.updateDataCollection(dataTime, busRoutes) === false) {
      this.setDataToShow()
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
          data={this.state.dataToShow}
          mapStyle={this.state.style}
          setSelectedDataSource={this.setSelectedDataSource}
        />
        <span style={{...layerControl, top: '0px'}}>
          <b>Current Data Source:</b>
          <br/>
          {new Date(this.state.selectedTimeStamp).toString()}
          <br/>
          {this.state.busRoutes.join(', ')}
        </span>
      </div>
    )
  }
}