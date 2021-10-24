import { 
  center, 
  points, 
  length, 
  distance, 
  lineString, 
  // lineSlice, 
  // buffer, 
  // combine,
  // getGeom,
  // getCoord,
  // point
 } from '@turf/turf'
// import { BX4_BUS_ROUTE0 } from './BX4_0'

// rawData: from api json
/** turn to 
 * [
      {
        "vehicle_id": ,
        route: ,
        speedmph_avg: ,
        center_point: ,
        path:[
          [,],
          [,],
          [,],
          ...
        ], 
        timestamps:[ // a corresponding timestamp for path entry. This is how the TripsLayer knows which point to draw, based on the current time of the map.
          ,
          ,
          ,
          ...
        ],
        speedmphs:[
          ,
          ,
          ,
          ...
        ],
        bearings:[
          ,
          ,
          ,
          ...
        ]
      },
      ...
    ]

    the range of timestamp values:
      const timestamps = trips.reduce(
        (ts, trip) => ts.concat(trip.timestamps),
        []
      );

      console.log('Min:', Math.min(...timestamps));
      console.log('Max:', Math.max(...timestamps));
*/

let pathByVehicleId = {}

export function getPathFromJson (rawData) {

  pathByVehicleId = rawData.reduce(
    (accu, curr) => {

      // process timestamp
      let currTimestamp = new Date(
        curr.properties.timestamp.substring(0, 19) // '2021-09-20 12:51:46-04:00'
        );
      currTimestamp = currTimestamp.getTime() //currTimestamp.getMinutes() * 60 + currTimestamp.getSeconds()

      const index = accu.findIndex((currentValue) => currentValue.vehicle_id === curr.properties.vehicle_id);
      if (index < 0) {
        // didn't find the vehicle, create new
        accu.push({
          vehicle_id: curr.properties.vehicle_id,
          route: curr.properties.route,
          path: [curr.geometry.coordinates],
          timestamps: [currTimestamp],
          bearings: [curr.properties.bearing]
        })
        
      } else {
        // find the right index for the new point, ascending by time stamps
        // assume the order has already roughtly been ascending 
        if (currTimestamp > accu[index].timestamps.slice(-1)[0]) {
          // if larger than the last timestamp, push
          accu[index].path.push(curr.geometry.coordinates)
          accu[index].timestamps.push(currTimestamp)
          accu[index].bearings.push(curr.properties.bearing)
        } else if (currTimestamp !== accu[index].timestamps.slice(-1)[0]) {
          // if equal, deem replicate records, skip the current record
          // console.log(curr.properties.vehicle_id, currTimestamp, ' replica - deleted')
          
        } else {
          // smaller than the last record, search the right index backward
          for (let i = accu[index].length -  1; i >= 0; i++) {
            if (currTimestamp < accu[index].timestamps[i]) {
              // insert the records
              accu[index].path.splice(i, 0, curr.geometry.coordinates)
              accu[index].timestamps.splice(i, 0, currTimestamp)
              accu[index].bearings.splice(i, 0, curr.properties.bearing)
              break
            } else if (currTimestamp === accu[index].timestamps[i]) {
              // replicate record, ignore
              break
            }
          }
        }
      }

      return accu;
    },
    []
  );

  // calculate individual and average speed for each path
  // and center point
  calcSpeedAndCenter (rawData);

  return pathByVehicleId
}

function calcDistanceDirect(start, stop) {
  // let dist = length(lineString([start, stop]), {units: 'miles'}); // can be degrees, radians, miles, or kilometers
  // or
  let dist = distance(start, stop, {units: 'miles'});
  return dist
}

// TO EXPAND ON ALL THE BUS ROUTES
function calcDistanceProjectOnLine(start, stop) {
  // could have two points projecting to the same spots
  // var sliced = lineSlice(start, stop, BX4_BUS_ROUTE0.features[0]);
  // let dist = length(sliced, {units: 'miles'});
  // // console.log(sliced, dist)
  // return dist
  return 0
}

function calcSpeedAndCenter (rawData) {

  if (pathByVehicleId === {}) {
    getPathFromJson (rawData)
  }

  for (let index = 0; index < pathByVehicleId.length; index++) {
    const positions = pathByVehicleId[index].path;
    
    // calculate center point
    pathByVehicleId[index].center_point = center(points(positions));

    // calculate speeds
    pathByVehicleId[index].speedmphs = [0] // inital the speedmphs
    // only one positions
    if (positions.length < 2) {
      continue
    }

    // more than one positions
    for (let pos = 1; pos < positions.length; pos++) {
      // distance from the last point
      // direct distances:
      let distance = calcDistanceDirect(positions[pos - 1], positions[pos])
      // or
      // points project on the bus routes
      // let distance = calcDistanceProjectOnLine(positions[pos - 1], positions[pos])

      // time diff
      let timeDiff = pathByVehicleId[index].timestamps[pos] - pathByVehicleId[index].timestamps[pos - 1]
      // speed
      if (timeDiff === 0) {
        console.log(pathByVehicleId[index].vehicle_id, pathByVehicleId[index].timestamps[pos], ' replica - should have been deleted')
      }
      let speedmph = timeDiff === 0 ? 0 : distance / timeDiff * 1000 * 60 * 60
      pathByVehicleId[index].speedmphs.push(speedmph)
    }
    // assume the first position speed = the second speed
    pathByVehicleId[index].speedmphs[0] = pathByVehicleId[index].speedmphs[1]

    // calc average speed
    pathByVehicleId[index].speedmph_avg = 
      length(lineString(positions), {units: 'miles'}) / 
      (pathByVehicleId[index].timestamps.slice(-1) - pathByVehicleId[index].timestamps[0]) * 1000 * 60 * 60
  }
}

// rawData: from api json
/**
 * turn to 
 * [
 *    {
 *      position: [,], 
 *      vehicle_id: '', 
 *      route: '',
 *      timestamp: ,
 *      bearing: number, 
 *      speedmph: number
 *     }, 
 *      ...
 * ]
 */
// 
// 0:
// bearing: 57.380756
// position: (2) [-73.898728, 40.859144]
// speedmph: 5.096842057404869
// vehicle_id: "MTA NYCT_5343"
export function getPointsFromJson (rawData) {

  return rawData.reduce(
    (accu, curr) => {

      // process timestamp
      let currTimestamp = new Date(
        curr.properties.timestamp.substring(0, 19) // '2021-09-20 12:51:46-04:00'
        );
      currTimestamp = currTimestamp.getTime() //currTimestamp.getMinutes() * 60 + currTimestamp.getSeconds();

      // make up speed, passenger_count
      let speed = Math.random() * 30;

      let passenger_count = parseInt(Math.random() * 30);

      accu.push({
        position: curr.geometry.coordinates,
        vehicle_id: curr.properties.vehicle_id,
        route: curr.properties.route,
        timestamp: currTimestamp,
        bearing: curr.properties.bearing,
        speedmph: speed,
        passenger_count
      })
      return accu;
    },
    []
  );
}

export function getPointsFromPath (rawData) {

  if (pathByVehicleId === {}) {
    getPathFromJson (rawData)
  }
  // console.log(pathByVehicleId)
  return pathByVehicleId.reduce(
    (accu, curr) => {
      for (let index = 0; index < curr.path.length; index++) {
        accu.push({
          position: curr.path[index],
          vehicle_id: curr.vehicle_id,
          route: curr.route,
          timestamp: curr.timestamps[index],
          bearing: curr.bearings[index],
          speedmph: curr.speedmphs[index],
          // passenger_count
        })
      }
      return accu;
    },
    []
  );
}

/**
[
  {
    geometry: {
      type: 'Point', 
      coordinates: Array(2)
    },
    properties: {
      route: 'BX2', 
      timestamp: '2021-09-20 11:59:54-04:00', 
      route_long: 'MTA NYCT_BX2', 
      direction: '0', 
      service_date: '2021-09-20', 
      ...
    },
    type: "Feature"
  },
  ...
]
 */
export function getGeoJsonFromPath (rawData) {

  if (pathByVehicleId === {}) {
    getPathFromJson (rawData)
  }

  return pathByVehicleId.reduce(
    (accu, curr) => {
      for (let index = 0; index < curr.path.length; index++) {
        accu.push({
          geometry: {
            type: 'Point', 
            coordinates: curr.path[index]
          },
          properties: {
            vehicle_id: curr.vehicle_id,
            route: curr.route,
            timestamp: curr.timestamps[index],
            bearing: curr.bearings[index],
            speedmph: curr.speedmphs[index]
          },
          type: "Feature"
        })
      }
      return accu;
    },
    []
  );
}