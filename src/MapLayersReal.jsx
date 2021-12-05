import React, { useState, useEffect } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { WebMercatorViewport } from '@deck.gl/core';
import { center, points, getCoord, lineString, bbox } from '@turf/turf'

import { Trips } from './layers/Trips'
// import { Path } from './layers/Path'

// import { ScatterPlots } from './layers/ScatterPlots'
// import { Heatmaps } from './layers/Heatmaps'
// import { Hexagons } from './layers/Hexagons'
// import { GeoJson } from './layers/Geojson'
import { Icons } from './layers/Icons'
import { TimerComp } from './components/TimerComp'

import { WithTime } from "./helper/Timer";
import { tooltipStyle, layerControl } from './helper/style'; // Mouseover interaction
import { MAPBOX_TOKEN, INITIAL_VIEW_STATE, DEFAULT_THEME } from './helper/constants'
import {
  LayerControls, // create settings for our scatterplot layer
} from './helper/controllers';
import { LAYER_CONTROLS_REAL, DATA_CONTROLS } from './helper/settings'
import { convertTimeToTimer, setTimerStart } from './helper/helperFuns';
import { calculateBunchingPoints } from './helper/formatData'

// Trips can only be called in a function, it uses hooks
export function MapLayersReal (props) {

  const { data, show, menuSettings } = props

  // time sync and control
  setTimerStart(props.currMinTime) // adjust the start time for timer to 0, in case of negative/huge timer
  const currMinTime = convertTimeToTimer(props.currMinTime);
  const currMaxTime = convertTimeToTimer(props.currMaxTime);
  const currentTimeObj = WithTime(currMaxTime, 10)
  const [timerRun, setTimerRun] = useState(true)
  
  // reading setting from LAYER_CONTROLS and DATA_CONTROLS
  const [settings, setSettings] = useState(
    Object.keys(LAYER_CONTROLS_REAL).reduce(
      (accu, key) => ({
        ...accu,
        [key]: LAYER_CONTROLS_REAL[key].value
      }),
      Object.keys(DATA_CONTROLS).reduce(
        (accu, key) => ({
          ...accu,
          [key]: DATA_CONTROLS[key].value
        }),
        {}
      )
    )
  );

  useEffect(() => {
    // update the nearest points on the same bus route
    calculateBunchingPoints(data.points, data.paths, settings.HightlightRedius, settings.HightlightTimeWindow)
    // if (data.points && data.points.length > 0) {
    //   data.json = getGeoJsonFromPoints(data.points)
    // }

    return () => {
      // cleanup
    }
  }, [settings.HightlightRedius, settings.HightlightTimeWindow])

  useEffect(() => {
    // when no animation layer is active, stop the timer
    if (settings.showPositions !== 1 && settings.showPositions !== 3 && settings.showTripTrace === false) {
      currentTimeObj.stopTimer(); 
      setTimerRun(false)
    } else {
      currentTimeObj.continueTimer(); 
      setTimerRun(true)
    }
    
    return () => {
      // cleanup
    }
  }, [settings.showPositions, settings.showTripTrace])

  // hover content
  const [hover, setHover] = useState(
    {
      x: 0,
      y: 0,
      hoveredObject: null
    }
  )

  function _onHover({ x, y, object, index }) {

    let withinThresholdVehicles = ''
    if (object && !object.path && ( object.vehicle_id || (object.properties && object.properties.vehicle_id) )) {
      object.vehicle_id &&
      object.withinThresholdVehicles.forEach(
        (curr) => withinThresholdVehicles += curr + ', '
      );
      object.properties && object.properties.vehicle_id &&
      object.properties.withinThresholdVehicles.forEach(
        (curr) => withinThresholdVehicles += curr + ', '
      );
    }

    const label = object ? 
    object.points ? 
      [`${object.points.length} points here`] : // hexgon points format
      (
        object.properties ? 
          [
            `${object.properties.vehicle_id}`,
            // `index: ${index + 1}`,
            // `agency: ${object.properties.agency}`,
            `route: ${object.properties.route}`,
            `bearing: ${object.properties.bearing.toFixed(2)}`,
            // `destination: ${object.properties.destination_name}`,
            `direction: ${object.properties.direction}`,
            // `trip id: ${object.properties.trip_id}`,
            `speed: ${object.properties.speedmph.toFixed(2)} mph`,
            `time: ${new Date(object.properties.timestamp).toString()}`,
            // `nearby: ${object.properties.withinThresholdVehicles.size} vehicles (${withinThresholdVehicles}) passing by 
            //         (${object.properties.withinThreshold.length} nearby bus positions with the same direction on the same route recorded) 
            //         in ${object.properties.heatRadiusThreshold} miles within ${object.properties.heatTimeWindow} seconds`
          ] // geojson format (data.json)
          : 
          object.path ? 
            [
              `${object.vehicle_id}`,
              // `index: ${index + 1}`,
              `route: ${object.route}`,
              `average speed: ${object.speedmph_avg.toFixed(2)} mph`
            ] // trip layer format (data.path)
            : 
            [
              `${object.vehicle_id}`,
              // `index: ${index + 1}`,
              `route: ${object.route}`,
              `direction: ${object.direction}`,
              `bearing: ${object.bearing.toFixed(2)}`,
              `speed: ${object.speedmph.toFixed(2)} mph`,
              `time: ${new Date(object.timestamp).toString()}`,
              `nearby: ${object.withinThresholdVehicles.size} vehicles (${withinThresholdVehicles}) passing by 
                          (${object.withinThreshold.length} nearby bus positions with the same direction on the same route recorded) 
                          in ${object.heatRadiusThreshold} miles within ${object.heatTimeWindow} seconds`
            ] // scatterplot format (data.points)
      )
    : null;

    setHover({ x, y, hoveredObject: object, label });
  }

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  useEffect(() => {
    if (data.paths && data.paths.length > 0) {

      // transit the view so that all points fit into the screen 
      if (settings.viewMapTransition === 1) {

        // use @turf/bbox to get the bounding box of your data (data need to be in geojson format)
        let bounds = []
        for (let i = 0; i < data.paths.length; i++) {
          if (data.paths[i].path.length > 1) {
            let box = bbox(lineString(data.paths[i].path)); // return [minX, minY, maxX, maxY]; i.e.[-73.916609, 40.814481, -73.843186, 40.841145]
            bounds.push([box[0], box[1]])
            bounds.push([box[2], box[3]])
          } else { // only one position in the path
            bounds.push(data.paths[i].path[0])
          }
        }
        bounds = bbox(lineString(bounds));
    
        // get new zoom to fit the screen
        const { longitude, latitude, zoom } = new WebMercatorViewport(viewState)
        .fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]],  // [[longitude, latitude], [longitude, latitude]]
          {
            padding: {top:20, bottom: 20, left: 20, right: 20},
            // offset: [number,number],
            // minExtent: number,
            // maxZoom: number // 24
          });
    
        setViewState(
          {
            ...INITIAL_VIEW_STATE,
            longitude,
            latitude,
            zoom
          }
        )       
      }
      // calculate center point to transite the view
      else if (settings.viewMapTransition === 2) {

        // transit the view so that the map centers on the center point of all data
        const center_point = center(points(
          data.paths.map( (p) => getCoord(p.center_point) )
        ));
  
        setViewState(
          {
            ...INITIAL_VIEW_STATE,
            longitude: getCoord(center_point)[0],
            latitude: getCoord(center_point)[1],
          }
        )
      }
      // TODO: focus on a certain bus route
    }

    return () => {
      // cleanup
    }
  }, [data.paths, settings.viewMapTransition])

  // get layers
  const layers = 
  Icons({
        data: data.points,
        settings: settings,
        unifySymbols: true,
        onHover: hover => _onHover(hover)
      })
      .concat(  
      Trips({
          data: data.paths,
          currentTime: currentTimeObj.getCurrentTime(),
          settings: settings,
          unifySymbols: true,
          onHover: hover => _onHover(hover) // 'hover' corresponds to one of the data entries that is passed in via prop.data
        }
      )
      )

  return (
    <div>
      {hover.hoveredObject && (
        <div
          style={{
            ...tooltipStyle,
            transform: `translate(${hover.x}px, ${hover.y}px)`
          }}
        >
        {hover.label.map(content => (<div key={content}>{content}</div>))}
        </div>
      )}
      { menuSettings && menuSettings.mapDisplayController === true ?
        <div className="layer-controls" style ={{...layerControl, overflow: 'auto'}}>
          <LayerControls
            title='Map Displaying Controller'
            settings={settings}
            propCtrls={LAYER_CONTROLS_REAL}
            onChange={(settingName, newValue) => {
              setSettings({
                ...settings,
                [settingName]: newValue
              });
            }}
          />
        </div>
        : null
      }

      <DeckGL
        layers={layers}
        // getTooltip={({object}) => object && object.vehicle_id} // Deck automatically renders a tooltip if the getTooltip callback is supplied
        effects={DEFAULT_THEME.effects}
        initialViewState={viewState}
        // onViewStateChange={(currView) => setViewState(currView.viewState) }
        controller={true} // for a map to be interactive, using the default MapController https://deck.gl/#/documentation/deckgl-api-reference/controllers/controller?section=event-handling
      >
        {/* By using react-map-gl as a child component to the DeckGL class, 
        DeckGL will keep the underlying map view in-sync with the data visualization layers. 
        This is sort of the Super Power of using DeckGL for visualizations, 
        in that you can de-couple your visualization logic from your map, and DeckGL will keep everything in sync. */}
        <StaticMap 
          reuseMaps 
          mapStyle={menuSettings.mapThemeStyle} 
          mapboxApiAccessToken={MAPBOX_TOKEN}
          preventStyleDiffing={true} 
        />
      </DeckGL>
      {
        (show && menuSettings && menuSettings.timerBar === true &&
          data && data.length !== 0) && 
          (settings.showPositions === 1 || settings.showTripTrace === true) ?
          <TimerComp
            currentTimeObj={currentTimeObj}
            timerRun={timerRun}
            setTimerRun={setTimerRun}
            currMinTime={currMinTime}
            currMaxTime={currMaxTime}
            OtherItems={() => <div>
              {/* Time: {currentTimeObj.getCurrentTime()} 
              <br></br>
              Seconds: {currMinTime} - {currMaxTime}
              <br></br> */}
              Bus Positions: {data.points ? data.points.length : 0}
              <br></br>
              Bus Trips: {data.paths ? data.paths.length : 0}
              <br></br>
              Begin: {new Date(props.currMinTime).toLocaleString()}
              <br></br>
              End: {new Date(props.currMaxTime).toLocaleString()}
            </div>}
          ></TimerComp>
        : null
      }
    </div>
  );
}