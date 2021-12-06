import React from 'react';
import { MapLayersHistory } from './MapLayersHistory'
import { getPathFromJson, getPointsFromPath, calculateBunchingPoints, getGeoJsonFromPoints } from './helper/formatData'
import { layerControl } from './helper/style';
import { START_TIME, COMMON_BUS_ROUTES, INIT_MAP_STYLE } from './helper/constants';
import { PANELS_TO_SHOW } from './helper/settings'
import { getUrl } from './helper/helperFuns'
import { Aside } from './components/Aside'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default class AppHistory extends React.Component{

  state = {
    dataJsonCollection: [], // store all the raw json from api - [ bus-timestamp: {json}, bus-timestamp: {json}...]
    dataToShow: [],
    selectedTimeStamp: START_TIME,
    busRoutes: [],
    currMaxTime: 4000,
    currMinTime: 0,
    menuSettings: Object.keys(PANELS_TO_SHOW).reduce(
      (accu, key) => ({
        ...accu,
        [key]: PANELS_TO_SHOW[key].value
      }),
      {
        mapThemeStyle: INIT_MAP_STYLE
      }
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.selectedTimeStamp !== this.state.selectedTimeStamp 
          || nextState.busRoutes !== this.state.busRoutes
          || nextState.style !== this.state.style
          || nextState.menuSettings !== this.state.menuSettings
  }

  componentDidMount(){
    this.updateDataCollection(START_TIME, COMMON_BUS_ROUTES)
  }

  getApiData = async (selectedTimeStamp, busRoute, dataUrl, readLocalFile = false) => {
    // combine url
    const urlStr = readLocalFile ? './geojson.json' : getUrl(selectedTimeStamp, busRoute, dataUrl)
    // console.log(urlStr)
    NProgress.start();
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
        const {json, paths, points} = this._processData(data['features']);

        const dataKey = this.getDataKey(selectedTimeStamp, busRoute);
        this.setState((previousState) => {
          return {
            dataJsonCollection: {
              ...previousState.dataJsonCollection,
              [dataKey] : {
                show: true,             // if show on the map
                json: json,             // geojson layer format
                paths: paths,             // trip format data
                points: points          // scatterplot/hexagons/icon format data
              }
            }
          }
        },
        () => this.setDataToShow()
        );
      } else {
        alert('Data points for ' + new Date(selectedTimeStamp) + ' ' + busRoute + ' is empty. Please choose another timepoint or bus route.');
      }
      NProgress.done();
    }, err => {
      // Status Code: 500 Internal Server Error
      console.log(err); 
      alert('Data points for ' + new Date(selectedTimeStamp) + ' ' + busRoute + ' is not available.', err);
      // this.getApiData(0, 0, readLocalFile = true)
      NProgress.done();
    })

    /** url exceptions:
     * http://api.buswatcher.org/api/v2/nyc/2021/9/15/12/Bx2/buses/geojson: { "type": "Shipment", "Status": "False", "Request": { "Year": "2020", "Month": "10", "Day": "15", "Hour": "0", "Route": "M1" }}
     * http://api.buswatcher.org/api/v2/nyc/2021/9/27/1/Bx17/buses/geojson: { "type": "FeatureCollection", "features": [] }
     */
  }

  _processData = (rawData) => {

    const paths = getPathFromJson(rawData)
    const points = getPointsFromPath(paths)
    calculateBunchingPoints(points, paths, 0.5, 120)
    const json = getGeoJsonFromPoints(points)

    return { json, paths, points }
  };

  setDataToShow() {
    // recombine dataToShow
    let jsonList = []
    let pathsList = []
    let pointsList = []
    let dataShowedLabel = []
    let times = [] // to update max and min timestamps

    const { dataJsonCollection } = this.state;

    for (let key in dataJsonCollection) {
      if (dataJsonCollection[key].show === true) {

        jsonList.push(...dataJsonCollection[key].json);
        pathsList.push(...dataJsonCollection[key].paths);
        pointsList.push(...dataJsonCollection[key].points);

        // collect each path's min and max timestamps
        for (let i = 0; i < dataJsonCollection[key].paths.length; i++) {
          times.push(dataJsonCollection[key].paths[i].timestamps[0])
          times.push(dataJsonCollection[key].paths[i].timestamps.slice(-1)[0])
        }
        dataShowedLabel.push(key) 
      }
    }

    this.setState({
      // dataToShow: dataList
      dataToShow: {
        json: jsonList,
        paths: pathsList,
        points: pointsList
      },
      currMinTime: Math.min(...times),
      currMaxTime: Math.max(...times),
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

  getDataKey(timestamp, busRoute) {
    return busRoute + '-' + timestamp;
  }

  updateDataCollection(selectedTimeStamp, busRoutes, dataUrl) {
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
        this.getApiData(selectedTimeStamp, element, dataUrl);
        hasUpdate = true
      }
    }

    return hasUpdate
  }

  setSelectedDataSource = (newChoice) => {

    const {dataTime, busRoutes, dataUrl} = newChoice;

    // console.log('app', dataTime, busRoutes)
    if (this.updateDataCollection(dataTime, busRoutes, dataUrl) === false) {
      this.setDataToShow()
    }
  }

  setMeneItems = (settings) => {
    // console.log(settings)
    this.setState({
      menuSettings: settings
    })
  }

  render(){
    // console.log("this.state in render", this.state)

    return (
      <div>
        <MapLayersHistory 
          data={this.state.dataToShow}
          currMinTime={this.state.currMinTime}
          currMaxTime={this.state.currMaxTime}
          setSelectedDataSource={this.setSelectedDataSource}
          menuSettings={this.state.menuSettings}
        />
        { this.state.menuSettings && this.state.menuSettings.currentDataSourcePanel === true ?
          <span style={{...layerControl, top: '0px', right: '900px'}}>
            <b>Current Data Source:</b>
            <br/>
            {new Date(this.state.selectedTimeStamp).toLocaleString()}
            <br/>
            {this.state.busRoutes.join(', ')}
          </span>

          :null
        }
        <Aside
          titleIndex={1}
          setMeneItems={this.setMeneItems}
          penelsToShow={PANELS_TO_SHOW}
        />
      </div>
    )
  }
}