import React, { useState, useEffect } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { center, points, getCoord } from '@turf/turf'

import { Trips } from './layers/Trips'
// import { ScatterPlots } from './layers/ScatterPlots'
// import { Heatmaps } from './layers/Heatmaps'
import { Hexagons } from './layers/Hexagons'
import { GeoJson } from './layers/Geojson'
import { Icons } from './layers/Icons'
import { tooltipStyle, layerControl } from './helper/style'; // Mouseover interaction

import { MAPBOX_TOKEN, INITIAL_VIEW_STATE, DEFAULT_THEME } from './helper/constants'

import { WithTime } from "./helper/Timer";

import {
  // MapStylePicker,
  LayerControls, // create settings for our scatterplot layer
  LAYER_CONTROLS,
  DATA_CONTROLS,
  DataSourceControls
} from './helper/controls';

// Trips can only be called in a function, it uses hooks
export function MapLayers (props) {
  // trips={this.state.data} points={this.state.points} mapStyle={this.state.style}
  const {data, mapStyle, 
    setSelectedDataSource,
    currMinTime,
    currMaxTime,
  } = props

  // reading setting from LAYER_CONTROLS and DATA_CONTROLS
  const [settings, setSettings] = useState(
    Object.keys(LAYER_CONTROLS).reduce(
      (accu, key) => ({
        ...accu,
        [key]: LAYER_CONTROLS[key].value
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

  // hover content
  const [hover, setHover] = useState(
    {
      x: 0,
      y: 0,
      hoveredObject: null
    }
  )

  function _onHover({ x, y, object, index }) {
    const label = object ? 
    object.points ? // hexgon points format
      [`${object.points.length} points here`] :
      (
        object.properties ? 
          [
            `${object.properties.vehicle_id}`,
            `index: ${index + 1}`,
            // `agency: ${object.properties.agency}`,
            `route: ${object.properties.route}`,
            `bearing: ${object.properties.bearing.toFixed(2)}`,
            // `destination: ${object.properties.destination_name}`,
            // `direction: ${object.properties.direction}`,
            // `trip id: ${object.properties.trip_id}`,
            `speed: ${object.properties.speedmph.toFixed(2)} mph`,
            `time: ${new Date(object.properties.timestamp).toString()}`
          ] // geojson format
          : 
          object.path ? 
            [
              `${object.vehicle_id}`,
              `index: ${index + 1}`,
              `route: ${object.route}`,
              `average speed: ${object.speedmph_avg.toFixed(2)} mph`
            ] // trip layer format
            : 
            [
              `${object.vehicle_id}`,
              `index: ${index + 1}`,
              `route: ${object.route}`,
              `bearing: ${object.bearing.toFixed(2)}`,
              `speed: ${object.speedmph.toFixed(2)} mph`,
              `time: ${new Date(object.timestamp).toString()}`
            ] // scatterplot format
      )
    : null;

    setHover({ x, y, hoveredObject: object, label });
  }

  // fly to centering on the new bus routes
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  useEffect(() => {
    if (data.path && data.path.length > 0) {
      // calculate center point to transite the view
      const center_point = center(points(
        data.path.map( (p) => getCoord(p.center_point) )
      ));

      setViewState(
        {
          ...INITIAL_VIEW_STATE,
          longitude: getCoord(center_point)[0],
          latitude: getCoord(center_point)[1],
        }
      )              
    }
    return () => {
      // cleanup
    }
  }, [data.path])

  // time sync and control
  const currentTimeObj = WithTime(currMaxTime)

  // get layers
  let layers = Trips({
    data: data.path,
    currentTime: currentTimeObj.getCurrentTime(),
    settings: settings,
    onHover: hover => _onHover(hover) // 'hover' corresponds to one of the data entries that is passed in via prop.data
  }
  // ).concat(
  //   ScatterPlots({
  //     data: data.points, 
  //     currentTime: currentTimeObj.getCurrentTime(),
  //     settings: settings,
  //     onHover: hover => _onHover(hover)
  //   })
  // ).concat(
  //   Heatmaps({
  //     data: data.points, 
  //     currentTime: currentTimeObj.getCurrentTime(),
  //     settings: settings,
  //     onHover: hover => _onHover(hover)
  //   })
  ).concat(
    Hexagons({
      data: data.points,
      settings: settings,
      onHover: hover => _onHover(hover)
    })
  ).concat(
    GeoJson({
      data: data.json,
      settings: settings,
      currentTime: currentTimeObj.getCurrentTime(),
      onHover: hover => _onHover(hover),
    })
  ).concat(  
    Icons({
      data: data.points,
      settings: settings,
      onHover: hover => _onHover(hover)
    })
  );

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
      <div className="layer-controls" style ={layerControl}>
        <DataSourceControls
          settings={settings}
          propCtrls={DATA_CONTROLS}
          onChange={(newSetting) => {
            setSettings({
              ...settings,
              ...newSetting
            });
            setSelectedDataSource(newSetting)
          }}
          />
        <LayerControls
          settings={settings}
          propCtrls={LAYER_CONTROLS}
          onChange={(settingName, newValue) => {
            setSettings({
              ...settings,
              [settingName]: newValue
            });
          }}
        />
      </div>

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
          mapStyle={mapStyle} 
          mapboxApiAccessToken={MAPBOX_TOKEN}
          preventStyleDiffing={true} 
        />
      </DeckGL>
      {
        (settings.showGeoJson || settings.showTripTrace) ?
          <span style={{...layerControl, top: '0px', right: '300px'}}>
          <div style={{ width: '100%', marginTop: "1rem" }}>
            <b>Trace & Animation Controller</b>
            <input
              style={{ width: '100%' }}
              type="range"
              min={currMinTime}
              max={currMaxTime}
              step="0.1"
              value={currentTimeObj.getCurrentTime()}
              readOnly
              onChange={ e => { currentTimeObj.setCurrentTime(Number(e.target.value)); }}
            />
            {/* Time: {currentTimeObj.getCurrentTime()} */}
          </div>
        </span>
        : null
      }
    </div>
  );
}