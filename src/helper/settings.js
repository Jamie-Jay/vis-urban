import { START_TIME, COMMON_BUS_ROUTES } from './constants'

export const DATA_CONTROLS = {
  dataTime: {
    displayName: 'Date-Time',
    type: 'time-picker',
    value: START_TIME
  },
  busRoutes: {
    displayName: 'Bus Route (multiple choice + Ctrl)',
    type: 'multi-selector',
    value: [COMMON_BUS_ROUTES]
  }
};

export const LAYER_CONTROLS = {
  showTripTrace: {
    displayName: 'Show Trip Trace',
    type: 'boolean',
    value: true
  },
  TripTraceWidth: {
    displayName: 'Trip Trace Width = avarage speed * ',
    type: 'range',
    value: 10,
    min: 0,
    max: 100
  },
  // showScatterplot: {
  //   displayName: 'Show Arrow Animation',
  //   type: 'boolean',
  //   value: false
  // },
  // showHeatmap: {
  //   displayName: 'Show Heatmap',
  //   type: 'boolean',
  //   value: true
  // },
  showGeoJson: {
    displayName: 'Show Animated Bus Positions',
    type: 'boolean',
    value: true
  },
  showIcons: {
    displayName: 'Show Static Bus Positions',
    type: 'boolean',
    value: false
  },
  IconsSpeedThreshold: {
    displayName: 'Warning Icon for Speed <= mph',
    type: 'range',
    value: 2,
    min: 0,
    max: 10
  },
  IconSizeInverseSpeed: {
    // displayName: 'Icon/Arrow Size Inverse of Speed(mph)',
    displayName: 'Icon Size Inverse of Speed(mph)',
    type: 'boolean',
    value: true
  },
  IconSizeScale: {
    // displayName: 'Icon/Arrow Size Scale',
    displayName: 'Icon Size Scale',
    type: 'range',
    value: 5,
    min: 0,
    max: 20
  },
  showHexagon: {
    displayName: 'Show Hexagon',
    type: 'boolean',
    value: false
  },
  // radius: {
  //   displayName: 'Hexagon Radius',
  //   type: 'range',
  //   value: 100,
  //   step: 50,
  //   min: 50,
  //   max: 1000
  // },
  // coverage: {
  //   displayName: 'Hexagon Coverage',
  //   type: 'range',
  //   value: 0.5,
  //   step: 0.1,
  //   min: 0,
  //   max: 1
  // },
  // upperPercentile: {
  //   displayName: 'Hexagon Upper Percentile',
  //   type: 'range',
  //   value: 100,
  //   step: 0.1,
  //   min: 80,
  //   max: 100
  // }
};