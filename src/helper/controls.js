import React, { Component } from 'react';
import { mapStylePicker, layerControl } from './style';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// console.log(new Date(2021,8,1).getTime()) // 2021-9-1: 1630468800000
export const START_TIME = 1630468800000;
export const BUS_ROUTES = ['M15', 'Bx2', 'Bx4', 'Bx17', 'Bx19'];

export const DATA_CONTROLS = {
  dataTime: {
    displayName: 'Date-Time',
    type: 'time-picker',
    value: START_TIME
  },
  busRoute: {
    displayName: 'Bus Route',
    type: 'selector',
    value: BUS_ROUTES[0]
  }
};

export const HEXAGON_CONTROLS = {
  showHexagon: {
    displayName: 'Show Hexagon',
    type: 'boolean',
    value: false
  },
  radius: {
    displayName: 'Hexagon Radius',
    type: 'range',
    value: 100,
    step: 50,
    min: 50,
    max: 1000
  },
  coverage: {
    displayName: 'Hexagon Coverage',
    type: 'range',
    value: 0.5,
    step: 0.1,
    min: 0,
    max: 1
  },
  upperPercentile: {
    displayName: 'Hexagon Upper Percentile',
    type: 'range',
    value: 100,
    step: 0.1,
    min: 80,
    max: 100
  },
  showScatterplot: {
    displayName: 'Show Scatterplot',
    type: 'boolean',
    value: false
  },
  // radiusAmplifier: {
  //   displayName: 'Scatterplot Radius Amplifier',
  //   type: 'range',
  //   value: 5,
  //   step: 5,
  //   min: 1,
  //   max: 20
  // },
  showGeoJson: {
    displayName: 'Show GeoJson',
    type: 'boolean',
    value: true
  },
  showTripTrace: {
    displayName: 'Show Trip Trace',
    type: 'boolean',
    value: true
  },
};

export const SCATTERPLOT_CONTROLS = {
  showScatterplot: {
    displayName: 'Show Scatterplot',
    type: 'boolean',
    value: true
  },
  // radiusScale: {
  //   displayName: 'Scatterplot Radius',
  //   type: 'range',
  //   // value: 30,
  //   // step: 10,
  //   min: 10,
  //   max: 200
  // }
};

const MAPBOX_DEFAULT_MAPSTYLES = [
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

export function MapStylePicker({ currentStyle, onStyleChange }) {
  return (
    <select
      className="map-style-picker"
      style={mapStylePicker}
      value={currentStyle}
      onChange={e => onStyleChange(e.target.value)}
    >
      {MAPBOX_DEFAULT_MAPSTYLES.map(style => (
        <option key={style.value} value={style.value}>
          {style.label}
        </option>
      ))}
    </select>
  );
}

export class LayerControls extends Component {
  _onValueChange = (settingName, newValue) => {
    const { settings } = this.props;
    // Only update if we have a confirmed change
    if (settings[settingName] !== newValue) {
      // shallow-equal detects a change
      this.props.onChange(settingName, newValue);
    }
  }

  render() {
    const { title, settings, propTypes = {} } = this.props;

    return (
      <div className="layer-controls" style ={layerControl}>
        {title && <h4>{title}</h4>}
        {Object.keys(settings).map(key => (
          <div key={key}>
            <label>{propTypes[key].displayName}</label>
            <div style={{ display: 'inline-block', float: 'right' }}>
              {settings[key]}
            </div>
            <Setting
              settingName={key}
              value={settings[key]}
              propType={propTypes[key]}
              onChange={this._onValueChange}
            />
          </div>
        ))}
      </div>
    );
  }
}

const Setting = props => {
  const { propType } = props;
  if (propType && propType.type) {
    switch (propType.type) {
      case 'range':
        return <Slider {...props} />;

      case 'boolean':
        return <Checkbox {...props} />;

      case 'selector':
        return <Selector {...props} />;

      case 'time-picker':
        return <TimePicker {...props} />;

      default:
        return <input {...props} />;
    }
  }
};

const Checkbox = ({ settingName, value, onChange }) => {
  return (
    <div key={settingName}>
      <div className="input-group">
        <input
          type="checkbox"
          id={settingName}
          checked={value}
          onChange={e => onChange(settingName, e.target.checked)}
        />
      </div>
    </div>
  );
};

const Slider = ({ settingName, value, propType, onChange }) => {
  const { max = 100 } = propType;

  return (
    <div key={settingName}>
      <div className="input-group">
        <div>
          <input
            type="range"
            id={settingName}
            min={0}
            max={max}
            step={max / 100}
            value={value}
            onChange={e => onChange(settingName, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

// single pick
const Selector = ({ settingName, value, onChange }) => {
  return (
    <div key={settingName}>
      <div className="input-group">
        <select
          type='selector'
          value={value}
          onChange={e => onChange(settingName, e.target.value)}
        >
          {BUS_ROUTES.map(route => (
            <option key={route} value={route}>
              {route}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

const TimePicker = ({ settingName, value, onChange }) => {

  const filterFutureTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() > selectedDate.getTime();
  };

  return (
    <DatePicker
      selected={value}
      onChange={(date) => {
          onChange(settingName, date.getTime());
        }
      }
      showTimeSelect
      timeIntervals={60}
      filterTime={filterFutureTime}
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  );
};