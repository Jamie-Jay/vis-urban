import { START_TIME, COLOR_PALETTE } from './constants'

export const convertTimeToTimer = (timestamp) => {
  return (timestamp - START_TIME) / 1000
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