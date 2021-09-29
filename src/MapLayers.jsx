/* global window */
import React, { useState } from 'react';
import {StaticMap} from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';

import { Trips } from './layers/Trips'
import { ScatterPlots } from './layers/ScatterPlots'
// import { tooltipStyle } from './style'; // Mouseover interaction

import {
  // MapStylePicker,
  LayerControls, // create settings for our scatterplot layer
  SCATTERPLOT_CONTROLS,
  DATA_CONTROLS
} from './controls';

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
  zoom: 15,
  pitch: 45,
  bearing: 0
};

// Trips can only be called in a function, it uses hooks
export function MapLayers (props) {
  // trips={this.state.data} points={this.state.points} mapStyle={this.state.style}
  const {trips, points, mapStyle, getSelectedDataSource} = props

  const settings1 = Object.keys(SCATTERPLOT_CONTROLS).reduce(
    (accu, key) => ({
      ...accu,
      [key]: SCATTERPLOT_CONTROLS[key].value
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

  let layers = Trips({
    tripPath: trips,
    settings: settings,
    // onHover: hover => this._onHover(hover)
  }).concat(
    ScatterPlots({
      data: points, 
      settings: settings,
      // onHover: hover => this._onHover(hover)
    })
  );

  // console.log(settings)

  return (
    <div>
      <LayerControls
        settings={settings}
        propTypes={{...SCATTERPLOT_CONTROLS, ...DATA_CONTROLS}}
        onChange={newSettings => {
            setSettings(newSettings);
            getSelectedDataSource(newSettings.date, newSettings.busRoute);
          }
        }
      />
      <DeckGL
        layers={layers}
        getTooltip={({object}) => object && object.vehicle_id}
        effects={DEFAULT_THEME.effects}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <StaticMap reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} />
      </DeckGL>      
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