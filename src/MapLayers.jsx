import React, { useState, useEffect } from 'react';
import {StaticMap} from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect, FlyToInterpolator} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';

import { Trips } from './layers/Trips'
import { ScatterPlots } from './layers/ScatterPlots'
import { Hexagons } from './layers/Hexagons'
import { GeoJson } from './layers/Geojson'
import { tooltipStyle, layerControl } from './helper/style'; // Mouseover interaction

import { MAPBOX_TOKEN } from './helper/constants'

import {
  // MapStylePicker,
  LayerControls, // create settings for our scatterplot layer
  HEXAGON_CONTROLS,
  DATA_CONTROLS
} from './helper/controls';

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const material = {
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70]
};

const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect]
};

const INITIAL_VIEW_STATE = {
  longitude: -73.905477,
  latitude: 40.849802,
  zoom: 13,
  // minZoom: 5,
  // maxZoom: 16,
  pitch: 0,
  bearing: 0,
  // animation to centered on the new bus route
  transitionInterpolator: new FlyToInterpolator({speed: 1.5}),
  /**
   * transitionInterpolator: FlyToInterpolator
      props: {speed: 1.5, curve: 1.414}
      _propsToCompare: (5) ['longitude', 'latitude', 'zoom', 'bearing', 'pitch']
      _propsToExtract: (7) ['width', 'height', 'longitude', 'latitude', 'zoom', 'bearing', 'pitch']
      _requiredProps: (5) ['width', 'height', 'latitude', 'longitude', 'zoom']
  */
  transitionDuration: 'auto'
};

// Trips can only be called in a function, it uses hooks
export function MapLayers (props) {
  // trips={this.state.data} points={this.state.points} mapStyle={this.state.style}
  const {trips, points, geojson, mapStyle, getSelectedTime, getSelectedRoute} = props

  // reading setting from HEXAGON_CONTROLS and DATA_CONTROLS
  const settings1 = Object.keys(HEXAGON_CONTROLS).reduce(
    (accu, key) => ({
      ...accu,
      [key]: HEXAGON_CONTROLS[key].value
    }),
    Object.keys(DATA_CONTROLS).reduce(
      (accu, key) => ({
        ...accu,
        [key]: DATA_CONTROLS[key].value
      }),
      {}
    )
  );

  const [settings, setSettings] = useState(settings1);

  const [hover, setHover] = useState(
    {
      x: 0,
      y: 0,
      hoveredObject: null
    }
  )

  function _onHover({ x, y, object }) {
    const label = object ? 
    object.points ? // hexgon points format
      `${object.points.length} points here` :
      (
        object.properties ? // geojson format
          `
          agency: ${object.properties.agency} \n\n
          bearing: ${object.properties.bearing} \n
          destination_name: ${object.properties.destination_name} \n
          direction: ${object.properties.direction} \n
          gtfs_block_id: ${object.properties.gtfs_block_id} \n
          gtfs_shape_id: ${object.properties.gtfs_shape_id} \n
          next_stop_d: ${object.properties.next_stop_d} \n
          next_stop_d_along_route: ${object.properties.next_stop_d_along_route} \n
          next_stop_eta: ${object.properties.next_stop_eta} \n
          next_stop_id: ${object.properties.next_stop_id} \n
          origin_id: ${object.properties.origin_id} \n
          route_long: ${object.properties.route_long} \n
          trip_id: ${object.properties.trip_id} \n
          vehicle_id: ${object.properties.vehicle_id} \n
          ` : object.vehicle_id // scatterplot format
      )
    : null;

    setHover({ x, y, hoveredObject: object, label });
  }

  // fly to centering on the new bus routes
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  useEffect(() => {
    if (geojson.length > 0 && geojson[0].geometry && geojson[0].geometry.coordinates) {
      console.log(geojson[0].properties.route_long)
      setViewState(
        {
          ... INITIAL_VIEW_STATE,
          longitude: geojson[0].geometry.coordinates[0], // bus trips' center geo: get the middle of max and min geo, or for simplicity, cencented on the first point
          latitude: geojson[0].geometry.coordinates[1],
        }
      )              
    }
    return () => {
      // cleanup
    }
  }, [geojson])

  let triplayers = Trips({
    tripPath: trips,
    settings: settings,
    // onHover: hover => _onHover(hover)
  });
  // console.log(triplayers)
  let layers = [triplayers[0]]
  layers = layers.concat(
    ScatterPlots({
      data: points, 
      settings: settings,
      onHover: hover => _onHover(hover)
    })
  ).concat(
    Hexagons({
      data: points,
      settings: settings,
      onHover: hover => _onHover(hover)
    })
  ).concat(  
    GeoJson({
      data: geojson,
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
          <div>{hover.label}</div>
        </div>
      )}
      <LayerControls
        settings={settings}
        propTypes={{...HEXAGON_CONTROLS, ...DATA_CONTROLS}}
        onChange={(settingName, newValue) => {
          setSettings({
            ...settings,
            [settingName]: newValue
          });
          if (settingName === 'dataTime') {
            getSelectedTime(newValue);
          } else if (settingName === 'busRoute') {
            getSelectedRoute(newValue);
          }
        }}
      />
      <DeckGL
        layers={layers}
        // getTooltip={({object}) => object && object.vehicle_id}
        effects={DEFAULT_THEME.effects}
        initialViewState={viewState}
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
      <span style={{...layerControl, top: '0px', right: '300px'}}>
        {triplayers[1]}  
      </span>
    </div>

  );
}


/*
export default class ParentLayers extends React.Component {

  state = {
    settings: Object.keys(SCATTERPLOT_CONTROLS).reduce(
      (accu, key) => ({
        ...accu,
        [key]: SCATTERPLOT_CONTROLS[key].value
      }),
      {}
    ),
    hover: {
      x: 0,
      y: 0,
      hoveredObject: null
    },
  };

  _updateLayerSettings(settings) {
    this.setState({ settings });
  }

  _onHover({ x, y, object }) {
    const label = object ? (object.vehicle_id) : null;
    this.setState({ hover: { x, y, hoveredObject: object, label } });
  }

  // let layers = Trips({tripPath: this.props.trips}).concat(ScatterPlots({data: this.props.trips}));
  // let layers = ScatterPlots({data: this.props.trips}).concat(Trips({tripPath: this.props.trips}));
  render(){
    let layers = ScatterPlots({
      data: this.props.points, 
      settings: this.state.settings,
      onHover: hover => this._onHover(hover)
    });

    const {trips, points, mapStyle, hover, settings} = this.props;

    // console.log(layers)

    return (
      <div>
         {hover.hoveredObject && (
           <div
             style={{
               ...tooltipStyle,
               transform: `translate(${hover.x}px, ${hover.y}px)`
             }}
           >
             <div>{hover.label}</div>
           </div>
         )}
        <LayerControls
          settings={this.state.settings}
          propTypes={SCATTERPLOT_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}
        />
        <DeckGL
          layers={layers}
          effects={DEFAULT_THEME.effects}
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
        >
          <StaticMap reuseMaps mapStyle={this.props.mapStyle} preventStyleDiffing={true} />
        </DeckGL>      
      </div>

    );
  }
}*/