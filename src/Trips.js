/* global window */
import React, {useState, useEffect} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import {PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';

// Source data CSV
const DATA_URL = {
  BUILDINGS:
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
  TRIPS: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json' // eslint-disable-line
};

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
  pitch: 45,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

const landCover = [[[-74.0, 40.7], [-74.02, 40.7], [-74.02, 40.72], [-74.0, 40.72]]];

const colorVal = [
  [0xF4, 0xEC, 0x15],
  [0xDA, 0xF0, 0x17],
  [0xBB, 0xEC, 0x19],
  [0x9D, 0xE8, 0x1B],
  [0x80, 0xE4, 0x1D],
  [0x66, 0xE0, 0x1F],
  [0x4C, 0xDC, 0x20],
  [0x34, 0xD8, 0x22],
  [0x24, 0xD2, 0x49],
  [0x25, 0xD0, 0x42],
  [0x26, 0xCC, 0x58],
  [0x28, 0xC8, 0x6D],
  [0x29, 0xC4, 0x81],
  [0x2A, 0xC0, 0x93],
  [0x2B, 0xBC, 0xA4],
  [0x2B, 0xB5, 0xB8],
  [0x2C, 0x99, 0xB4],
  [0x2D, 0x7E, 0xB0],
  [0x2D, 0x65, 0xAC],
  [0x2E, 0x4E, 0xA4],
  [0x2E, 0x38, 0xA4],
  [0x3B, 0x2F, 0xA0],
  [0x4E, 0x2F, 0x9C],
  [0x60, 0x30, 0x99],
];

export default function Trips({
  buildings = DATA_URL.BUILDINGS,
  trips = DATA_URL.TRIPS,
  trailLength = 180,
  initialViewState = INITIAL_VIEW_STATE,
  mapStyle = MAP_STYLE,
  theme = DEFAULT_THEME,
  loopLength = 1800, // unit corresponds to the timestamp in source data
  animationSpeed = 1
}) {
  const [time, setTime] = useState(0);
  const [animation] = useState({});

  const animate = () => {
    setTime(t => (t + animationSpeed) % loopLength);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(
    () => {
      animation.id = window.requestAnimationFrame(animate);
      return () => window.cancelAnimationFrame(animation.id);
    },
    [animation]
  );

  const layers = [
    // This is only needed when using shadow effects
    // new PolygonLayer({
    //   id: 'ground',
    //   data: landCover,
    //   getPolygon: f => f,
    //   stroked: false,
    //   getFillColor: [0, 0, 0, 0]
    // }),
    new TripsLayer({
      id: 'trips',
      data: trips,
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getColor: d => colorVal[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24], // (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
      opacity: 0.3,
      widthMinPixels: 2,
      rounded: true,
      trailLength,
      currentTime: time,

      shadowEnabled: false
    }),
    // new PolygonLayer({
    //   id: 'buildings',
    //   data: buildings,
    //   extruded: true,
    //   wireframe: false,
    //   opacity: 0.5,
    //   getPolygon: f => f.polygon,
    //   getElevation: f => f.height,
    //   getFillColor: theme.buildingColor,
    //   material: theme.material
    // })
  ];

  // return {layers: layers, effects: theme.effects, initialViewState: initialViewState}
  return (
    <DeckGL
      layers={layers}
      effects={theme.effects}
      initialViewState={initialViewState}
      controller={true}
    >
      <StaticMap reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} />
    </DeckGL>
  );
}
