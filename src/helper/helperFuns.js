import { timeFormat } from 'd3';
import { START_TIME, COLOR_PALETTE_VEC, COLOR_PALETTE_HEX } from './constants'

const BASE_URL_CAMPUS = 'http://10.92.214.223/';
const BASE_URL = 'https://api.buswatcher.org/';

export const  getUrl = (selectedTimeStamp, busRoute, dataUrl) => {
  // combine url
  const dt = new Date(selectedTimeStamp)

  return (
    (dataUrl === 2 ? BASE_URL_CAMPUS : BASE_URL) + 'api/v2/nyc/'
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

export const isZero = (decimal) => {
  return parseFloat(decimal) === parseFloat(0)
}

const getSpeed = (speedmph) => {
  return Math.min(speedmph, 50.0) // speed no faster than 50
}

const getInverseSpeed = (speedmph) => {
  return (speedmph === 0 ||100 / speedmph > 50) ? 50 : 100 / speedmph // inverse speed 0 to max and speed no faster than 50
}

export const colorZeroSpeed = (alpha = null) => { // light gray
  return alpha == null ? [211, 211, 211] : [211, 211, 211, alpha] // a is 255 if not supplied. 
}

const colorSlowSpeed = (alpha = null) => { // orange 255 165 0
  return alpha == null ? [255, 165, 0] : [255, 165, 0, alpha]
}

export const colorSchema = (vehicle_id, alpha = null) => {
  let vehicleId = parseInt(vehicle_id.split('_').slice(-1)[0])
  return alpha == null ? COLOR_PALETTE_VEC[vehicleId % COLOR_PALETTE_VEC.length]
  :[
    ...COLOR_PALETTE_VEC[vehicleId % COLOR_PALETTE_VEC.length],
    alpha
  ]
}

export const colorSchemaHex = (vehicle_id) => {
  let vehicleId = parseInt(vehicle_id.split('_').slice(-1)[0])
  return COLOR_PALETTE_HEX[vehicleId % COLOR_PALETTE_HEX.length]
}

export const colorHighlighted = (alpha = null) => { // white
  return alpha == null ? [255, 255, 255] : [255, 255, 255, alpha]
}

export const formatTimestamp = (timestamp) => {
  return timeFormat('%H:%M:%S')(new Date(timestamp))
}

export const roundSpeed = (speedmph) => {
  // round to the nearest integer
  // 0-0.1 -> 0, 0.1-1 -> 1
  speedmph = speedmph > 1 ? speedmph : (
                speedmph > 0.1 ? 1 : 0
              )

  return speedmph.toFixed(0)
}

export function getSizeBySpeed(d, IconSizeInverseSpeed) {
  return IconSizeInverseSpeed ? getInverseSpeed(d.speedmph) : getSpeed(d.speedmph)
}

function getVehicleColorBySpeed(d, IconsSpeedThreshold) {
  return d.speedmph > IconsSpeedThreshold ? colorSchema(d.vehicle_id, 200) 
            : (isZero(d.speedmph) ? colorZeroSpeed(200) : colorSlowSpeed(200)) // yellow for spd=0, red for spd<threshold
}

export function getVehicleColorByBunching(d, IconsSpeedThreshold) {
  if (d.withinThresholdVehicles.size > 1) {
    return [255, 0, 0] // red for more than one vehicles nearby
  }
  return getVehicleColorBySpeed(d, IconsSpeedThreshold)
}