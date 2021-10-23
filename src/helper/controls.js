import React, { Component } from 'react';
import { mapStylePicker, layerControl } from './style';
import { COLOR_PALETTE } from '../helper/constants'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { NYC_BUS_ROUTES_BY_COLOR } from './BusRoutes'

// console.log(new Date(2021,8,1).getTime()) // 2021-9-1: 1630468800000
export const START_TIME = 1630468800000;
export const BUS_ROUTES = ['M15', 'Bx4', 'Bx17', 'Bx19'];

export const convertTimeToTimer = (timestamp) => {
  return (timestamp - START_TIME) / 1000
}

export const inverseSpeed = (speedmph) => {
  return speedmph === 0 ? 0 : (100 / speedmph > 50 ? 50 : 100 / speedmph) // do not inverse when speed = 0 and speed no faster than 50
}

export const colorSchema = (vehicle_id) => {
  return COLOR_PALETTE[parseInt(vehicle_id.substr(vehicle_id.length - 4)) % COLOR_PALETTE.length]
}

export const DATA_CONTROLS = {
  dataTime: {
    displayName: 'Date-Time',
    type: 'time-picker',
    value: START_TIME
  },
  busRoutes: {
    displayName: 'Bus Route',
    type: 'multi-selector',
    value: [BUS_ROUTES[0]]
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
    value: 50,
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
  showIcons: {
    displayName: 'Show Bus Positions',
    type: 'boolean',
    value: true
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
  showGeoJson: {
    displayName: 'Show GeoJson',
    type: 'boolean',
    value: false
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

export class DataSourceControls extends Component {

  state = {
    dataTime: this.props.settings.dataTime,
    busRoutes: this.props.settings.busRoutes
  }

  _onValueChange = (settingName, newValue) => {
    const { settings } = this.props;
    if (settings[settingName] !== newValue) {
      this.setState({
        [settingName]: newValue
      })
    }
  }

  handleClick = () => {
    this.props.onChange(this.state);
  }

  render() {
    const { title, settings, propTypes = {} } = this.props;

    return (
      <div>
        {title && <h4>{title}</h4>}
        {Object.keys(propTypes).map(key => (
          <div key={key}>
            <label>{propTypes[key].displayName}</label>
            <div style={{ display: 'inline-block', float: 'right' }}>
              {settings[key]}
            </div>
            <Setting
              settingName={key}
              value={this.state[key]}
              propType={propTypes[key]}
              onChange={this._onValueChange}
            />
          </div>
        ))}
      <button style={{ display: 'inline-block', float: 'right' }} onClick={this.handleClick}>Data OK</button>
      </div>
    )
  }
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
      <div>
        {title && <h4>{title}</h4>}
        {Object.keys(propTypes).map(key => (
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

      case 'single-selector':
        return <SingleSelector {...props} />;

      case 'multi-selector':
        return <MultiSelector {...props} />;

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
const SingleSelector = ({ settingName, value, onChange }) => {
  return (
    <div key={settingName}>
      <div className="input-group">
        <select
          type='select-one'
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

// multiple pick
const MultiSelector = ({ settingName, value, onChange }) => {
	const changeOptions = () => {
    value = []
    let obj = document.getElementById("multi-selector");
		for(let i = 0; i < obj.options.length; i++){
			if(obj.options[i].selected){
			  value.push(obj.options[i].value); // collect all selected options
			}
		}

    onChange(settingName, value)
  }

  return (
    <div key={settingName}>
      <div className="input-group">
        <select
          type='select-multiple'
          id="multi-selector"
          multiple
          size={5}
          onChange={ changeOptions }
          >
          <optgroup key='Common' label='Common'>
            {
              BUS_ROUTES.map(route => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))
            }
          </optgroup>

          {
            Object.keys(NYC_BUS_ROUTES_BY_COLOR).map((key,i)=>{
              var items = NYC_BUS_ROUTES_BY_COLOR[key].map((s,index)=>{
                return (
                  <option key={index} style={{color: {key}}}>{s.route_id}</option>
                )
              })
              return(
                <optgroup key={key} label={key}>
                  {items}
                </optgroup> 
              )
            })
          }
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