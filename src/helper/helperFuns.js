import { START_TIME, COLOR_PALETTE } from './constants'

const BASE_URL_CAMPUS = 'http://10.92.214.223/';
const BASE_URL = 'https://api.buswatcher.org/';

export const  getUrl = (selectedTimeStamp, busRoute) => {
  // combine url
  const dt = new Date(selectedTimeStamp)
  return (
    BASE_URL + 'api/v2/nyc/'
    + dt.getFullYear() + '/'
    + ( dt.getMonth() + 1 ) + '/'
    + dt.getDate() + '/'
    + dt.getHours() + '/'
    + busRoute
    + '/buses/geojson'
  );
}

let TimerStart = START_TIME;

export const setTimerStart = (start) => {
  TimerStart = start
}

export const convertTimeToTimer = (timestamp) => {
  return (timestamp - TimerStart) / 1000
}

export const inverseSpeed = (speedmph) => {
  return speedmph === 0 ? 0 : (100 / speedmph > 50 ? 50 : 100 / speedmph) // do not inverse when speed = 0 and speed no faster than 50
}

export const colorSchema = (vehicle_id, alpha = null) => {
  let vehicleId = parseInt(vehicle_id.split('_').slice(-1)[0])
  return alpha == null ? COLOR_PALETTE[vehicleId % COLOR_PALETTE.length]
  :[
    ...COLOR_PALETTE[vehicleId % COLOR_PALETTE.length],
    alpha
  ]
}