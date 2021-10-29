import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { mapStylePicker } from './style';
import { NYC_BUS_ROUTES_BY_COLOR } from './BusRoutes'
import { MAPBOX_DEFAULT_MAPSTYLES, COMMON_BUS_ROUTES } from './constants'

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
    dataUrl: this.props.settings.dataUrl,
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
    const { settings, propCtrls = {} } = this.props;

    return (
      <div>
        <span><b>Data Source Controller</b></span>
        <div style={{
            border: "thin solid gray",
            borderRadius: '10px',
        }}>
          {Object.keys(propCtrls).map(key => (
            <div key={key}>
              <label>{propCtrls[key].displayName}</label>
              <div style={{ display: 'inline-block', float: 'right' }}>
                {Array.isArray(settings[key]) ? settings[key].join(', ') : settings[key]}
              </div>
              <Setting
                settingName={key}
                value={this.state[key]}
                propCtrl={propCtrls[key]}
                onChange={this._onValueChange}
                />
            </div>
          ))}
          <div style={{ height: '25px', textAlign:'right'}}>
          <button style={{ display: 'block', float: 'right', borderRadius: '5px' }} 
                  onClick={this.handleClick}
                  >Data OK</button>
          </div>
        </div>
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
    const { settings, propCtrls = {} } = this.props;

    return (
      <div>
        <span><b>Map Displaying Controller</b></span>
        <div style={{
            border: "thin solid gray",
            borderRadius: '10px'
        }}>
          {Object.keys(propCtrls).map(key => {

            let show = 'block'

            if (propCtrls[key]['displayCondition']) {
              let orCond = false;
              const conditions = propCtrls[key]['displayCondition']
              for (let i = 0; i < conditions.length; i++) { // or condition
                let andCond = true
                for (let condition in conditions[i]) { // and condition
                  if (conditions[i][condition] !== settings[condition]) {
                    andCond = false
                    break
                  }
                }
                if (andCond) {
                  orCond = true
                  break
                }
              }
              show = orCond ? 'block' : 'none'
            }

            return (
              <div key={key} style={{display: show}}>
                <label>{propCtrls[key].displayName}</label>
                <div style={{ display: 'inline-block', float: 'right' }}>
                  {settings[key]}
                </div>
                <Setting
                  settingName={key}
                  value={settings[key]}
                  propCtrl={propCtrls[key]}
                  onChange={this._onValueChange}
                />
              </div>
            )}
          )}
        </div>
      </div>
    );
  }
}

const Setting = props => {
  const { propCtrl } = props;
  if (propCtrl && propCtrl.type) {
    switch (propCtrl.type) {
      case 'range':
        return <Slider {...props} />;

      case 'boolean':
        return <Checkbox {...props} />;

      case 'radio-list':
        return <RadioList {...props} />;

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
    <div className="input-group" key={settingName}>
      <input
        type="checkbox"
        id={settingName}
        checked={value}
        onChange={e => onChange(settingName, e.target.checked)}
      />
    </div>
  );
};

const RadioList = ({ settingName, value, propCtrl = {}, onChange }) => {
  return (
    <div className="input-group" key={settingName} 
          onChange={ e => onChange(settingName, Number(e.target.value)) }
          >
      {
        Object.keys(propCtrl.options).map( (option) => 
          <div key={option}>
              <input 
                type="radio" 
                value={propCtrl.options[option]} 
                name={settingName} 
                defaultChecked={propCtrl.options[option] === value}
              />
              <label>{option}</label>
          </div>
        )
      }
    </div>
  );
};

const Slider = ({ settingName, value, propCtrl, onChange }) => {
  const { step = 1, max = 100 } = propCtrl;

  return (
    <div className="input-group" key={settingName}>
        <input
          type="range"
          id={settingName}
          min={0}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(settingName, Number(e.target.value))}
        />
    </div>
  );
};

// single pick
const SingleSelector = ({ settingName, value, onChange }) => {
  return (
    <div className="input-group" key={settingName}>
      <select
        type='select-one'
        value={value}
        onChange={e => onChange(settingName, e.target.value)}
      >
        {COMMON_BUS_ROUTES.map(route => (
          <option key={route} value={route}>
            {route}
          </option>
        ))}
      </select>
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
    <div className="input-group" key={settingName}>
      <select
        type='select-multiple'
        id="multi-selector"
        multiple
        size={5}
        onChange={ changeOptions }
        >
        <optgroup key='Common' label='Common'>
          {
            COMMON_BUS_ROUTES.map(route => (
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