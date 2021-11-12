import { START_TIME, COMMON_BUS_ROUTES } from './constants'

export const DATA_CONTROLS = {
  dataUrl: {
    displayName: 'Data Url Host (to be tested)',
    type: 'radio-list',
    options: {
      'Non-campus Network': 1,
      'Campus Network': 2
    },
    value: 1
  },
  dataTime: {
    displayName: 'Date-Time',
    type: 'time-picker',
    value: START_TIME
  },
  busRoutes: {
    displayName: 'Bus Route (multiple choice + Ctrl)',
    type: 'multi-selector',
    value: COMMON_BUS_ROUTES
  }
};

export const LAYER_CONTROLS = {
  showTripTrace: {
    displayName: 'Show Trip Trace',
    type: 'boolean',
    value: true
  },
  showPositions: {
    displayName: 'How to Show Bus Positions',
    type: 'radio-list',
    options: {
      'Animation': 1,
      'Static': 2,
      // 'Trace': 3,
      // 'Hexagon': 4, // disable for now
      'None': 0
    },
    value: 1
  },
  TripTraceWidth: {
    displayName: 'Trip Trace Width = avg speed * ',
    displayCondition: [
      { showPositions: 3 }
    ],
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
  IconsSpeedThreshold: {
    displayName: 'Orange Icon for Speed <= mph',
    displayCondition: [
      { showPositions: 1 }, 
      { showPositions: 2 }
    ],
    type: 'range',
    value: 2,
    step: 0.1,
    min: 0,
    max: 20
  },
  IconSizeInverseSpeed: {
    // displayName: 'Icon/Arrow Size Inverse of Speed(mph)',
    displayName: 'Icon Size Inverse of Speed(mph)',
    displayCondition: [ // element in [] is or condition, {} is and condition
      { showPositions: 1 }, 
      { showPositions: 2 }
  ],
    type: 'boolean',
    value: false
  },
  IconSizeScale: {
    // displayName: 'Icon/Arrow Size Scale',
    displayName: 'Icon Size Scale',
    displayCondition: [
      { showPositions: 1 }, 
      { showPositions: 2 }
    ],
    type: 'range',
    value: 5,
    step: 0.1,
    min: 0,
    max: 20
  },
  showNearByPointsOnlyWhenHovering: {
    displayName: 'Show Nearby Points ONLY when Hovering',
    displayCondition: [
      { showPositions: 2 }
    ],
    type: 'boolean',
    value: true // true: nearby points show original color, other points disappear, false: nearby points highlighted, other points remain
  },
  HightlightRedius: {
    displayName: 'Radius(miles) for Highlighting Positions when Hovering',
    displayCondition: [
      { showPositions: 2 }
    ],
    type: 'range',
    value: 0.5,
    step: 0.1,
    min: 0,
    max: 2
  },
  HightlightTimeWindow: {
    displayName: 'Time Window(seconds) for Highlighting Positions when Hovering',
    displayCondition: [
      { showPositions: 2 }
    ],
    type: 'range',
    value: 120,
    step: 10,
    min: 0,
    max: 1200
  },
  // showHexagon: {
  //   displayName: 'Show Hexagon',
  //   type: 'boolean',
  //   value: false
  // },
  radius: {
    displayName: 'Hexagon Radius',
    displayCondition: [
      { showPositions: 4 }
    ],
    type: 'range',
    value: 100,
    step: 50,
    min: 50,
    max: 1000
  },
  coverage: {
    displayName: 'Hexagon Coverage',
    displayCondition: [
      { showPositions: 4 }
    ],
    type: 'range',
    value: 0.5,
    step: 0.1,
    min: 0,
    max: 1
  },
  upperPercentile: {
    displayName: 'Hexagon Upper Percentile',
    displayCondition: [
      { showPositions: 4 }
    ],
    type: 'range',
    value: 100,
    step: 0.1,
    min: 80,
    max: 100
  },
  viewMapTransition: {
    displayName: 'Adjust Map View',
    type: 'radio-list',
    options: {
      'Fit in the screen': 1,
      'Focus on the position center': 2
    },
    value: 1
  }
};