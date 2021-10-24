import { AmbientLight, PointLight, LightingEffect, FlyToInterpolator } from '@deck.gl/core';

export const MAPBOX_TOKEN = 'pk.eyJ1IjoiamFtaWVqYXkiLCJhIjoiY2t1NXRmeWlnMW5kZjMwcWgzYWtxMDU5dCJ9.bT4fctFkg1XCdh_FeNy8PQ'
// JSON.stringify(process.env.MapboxAccessToken);

// console.log(new Date(2021,8,1).getTime()) // 2021-9-1: 1630468800000
export const START_TIME = 1630468800000;
export const COMMON_BUS_ROUTES = ['M15', 'Bx4', 'Bx17', 'Bx19'];

export const COLOR_PALETTE = [
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

export const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect]
};

export const INITIAL_VIEW_STATE = {
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

export const MAPBOX_DEFAULT_MAPSTYLES = [
  { 
    label: 'Streets V10', 
    value: 'mapbox://styles/mapbox/streets-v10' 
  },
  { 
    label: 'Outdoors V10', 
    value: 'mapbox://styles/mapbox/outdoors-v10' 
  },
  { 
    label: 'Light V9', 
    value: 'mapbox://styles/mapbox/light-v9' 
  },
  { 
    label: 'Dark V9', 
    value: 'mapbox://styles/mapbox/dark-v9' 
  },
  { 
    label: 'Satellite V9', 
    value: 'mapbox://styles/mapbox/satellite-v9' 
  },
  {
    label: 'Satellite Streets V10',
    value: 'mapbox://styles/mapbox/satellite-streets-v10'
  },
  {
    label: 'Navigation Preview Day V4',
    value: 'mapbox://styles/mapbox/navigation-preview-day-v4'
  },
  {
    label: 'Navitation Preview Night V4',
    value: 'mapbox://styles/mapbox/navigation-preview-night-v4'
  },
  {
    label: 'Navigation Guidance Day V4',
    value: 'mapbox://styles/mapbox/navigation-guidance-day-v4'
  },
  {
    label: 'Navigation Guidance Night V4',
    value: 'mapbox://styles/mapbox/navigation-guidance-night-v4'
  },
  {
    label: 'dark-matter-nolabels',
    value: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'
  },
  {
    label: 'dark-matter',
    value: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
  },
  {
    label: 'positron-nolabels',
    value: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'
  },
  {
    label: 'positron',
    value: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
  }
];

const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 128, height: 128, mask: true},
  markerSlow: {x: 128, y: 0, width: 128, height: 128, mask: false},
};

export const iconMapping = ICON_MAPPING;
export const iconAtlas = 'data/icon-atlas.png';