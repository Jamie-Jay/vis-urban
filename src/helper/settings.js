import { START_TIME, COMMON_BUS_ROUTES } from './constants'

export const PANELS_TO_SHOW_REAL = {
  currentDataSourcePanel: {
    displayName: 'Currnet Data Source Panel',
    type: 'boolean',
    value: true
  },
  timerBar: {
    displayName: 'Timer Bar',
    type: 'boolean',
    value: true
  },
  mapDisplayController: {
    displayName: 'Map Display Controller',
    type: 'boolean',
    value: false
  }
};

export const PANELS_TO_SHOW = {
  currentDataSourcePanel: {
    displayName: 'Currnet Data Source Panel',
    type: 'boolean',
    value: true
  },
  timerBar: {
    displayName: 'Timer Bar',
    type: 'boolean',
    value: true
  },
  dataSourceController: {
    displayName: 'Data Source Controller',
    type: 'boolean',
    value: false
  },
  mapDisplayController: {
    displayName: 'Map Display Controller',
    type: 'boolean',
    value: false
  }
};

export const DATA_CONTROLS = {
  // dataUrl: {
  //   displayName: 'Data Url Host (to be tested)',
  //   type: 'radio-list',
  //   options: {
  //     'Non-campus Network': 1,
  //     'Campus Network': 2
  //   },
  //   value: 1
  // },
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


const LAYER_CONTROLS_ANIMATION_STATIC = {
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
}

const LAYER_CONTROLS_STATIC = {
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
}

export const LAYER_CONTROLS_HEXAGON = {
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
}

const LAYER_CONTROLS_TRIP = {
  showTripTrace: {
    displayName: 'Show Trip Trace',
    type: 'boolean',
    value: true
  },
  TripTraceWidth: {
    displayName: 'Trip Trace Width = avg speed * ',
    type: 'range',
    value: 10,
    min: 0,
    max: 100
  }
}

const LAYER_CONTROLS_VIEW = {
  viewMapTransition: {
    displayName: 'Adjust Map View',
    type: 'radio-list',
    options: {
      'Fit in the screen': 1,
      'Focus on the position center': 2
    },
    value: 1
  }
}

export const LAYER_CONTROLS = {
  ...LAYER_CONTROLS_TRIP,
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
  ...LAYER_CONTROLS_ANIMATION_STATIC,
  ...LAYER_CONTROLS_STATIC,
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
  // showHexagon: {
  //   displayName: 'Show Hexagon',
  //   type: 'boolean',
  //   value: false
  // },
  // ...LAYER_CONTROLS_HEXAGON,
  ...LAYER_CONTROLS_VIEW
}

export const LAYER_CONTROLS_REAL = {
  ...LAYER_CONTROLS_TRIP,
  showPositions: {
    displayName: 'How to Show Bus Positions',
    type: 'radio-list',
    options: {
      'None': 0,
      // 'Animation': 1,
      'Static': 2,
      // 'Trace': 3,
      // 'Hexagon': 4, // disable for now
    },
    value: 0
  },
  ...LAYER_CONTROLS_ANIMATION_STATIC,
  ...LAYER_CONTROLS_STATIC,

  ...LAYER_CONTROLS_VIEW
}