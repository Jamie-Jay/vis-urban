import { 
  center, 
  points, 
  length, 
  distance, 
  lineString, 
  // lineSlice
 } from '@turf/turf'
// import BX4_BUS_ROUTE0 from './data/BX4_0.json' // import json object directly from json file

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
        ],
        directions:[
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

export function getPathFromJson (rawData) {

  const pathByVehicleId = rawData.reduce(
    (accu, curr) => {

      // process timestamp
      let currTimestamp = new Date(
        curr.properties.timestamp.substring(0, 19) // '2021-09-20 12:51:46-04:00'
        );
      currTimestamp = currTimestamp.getTime() //currTimestamp.getMinutes() * 60 + currTimestamp.getSeconds()

      return addPointsToPath(accu, curr.properties, currTimestamp, curr.geometry.coordinates);
    },
    []
  );

  // calculate individual and average speed for each path
  // and center point
  calcAggregatedData (pathByVehicleId);

  return pathByVehicleId
}

function addPointsToPath(accu, curr, timestamp, position) {

  const index = accu.findIndex((currentValue) => currentValue.vehicle_id === curr.vehicle_id);
  if (index < 0) {
    // didn't find the vehicle, create new
    accu.push({
      vehicle_id: curr.vehicle_id,
      route: curr.route,
      path: [position],
      timestamps: [timestamp],
      bearings: [curr.bearing],
      directions: [Number(curr.direction)]
    })
    // console.log(curr.vehicle_id, timestamp, ' NEW - VE')
  } else {
    // find the right index for the new point, ascending by time stamps
    // assume the order has already roughtly been ascending 
    if (timestamp > accu[index].timestamps.slice(-1)[0]) {
      // if larger than the last timestamp, push
      accu[index].path.push(position)
      accu[index].timestamps.push(timestamp)
      accu[index].bearings.push(curr.bearing)
      accu[index].directions.push(Number(curr.direction))
      // console.log(curr.vehicle_id, timestamp, ' larger than the last timestamp')
    } else if (timestamp === accu[index].timestamps.slice(-1)[0]) {
      // if equal, deem replicate records, skip the current record
      // console.log(curr.vehicle_id, timestamp, ' replica - deleted')
    } else {
      // console.log(curr.vehicle_id, timestamp, ' smaller than the last record')
      // smaller than the last record, search the right index backward
      for (let i = accu[index].length - 1; i >= 0; i++) {
        if (timestamp < accu[index].timestamps[i]) {
          // insert the records
          accu[index].path.splice(i, 0, position)
          accu[index].timestamps.splice(i, 0, timestamp)
          accu[index].bearings.splice(i, 0, curr.bearing)
          accu[index].directions.splice(i, 0, Number(curr.direction))
          // console.log(curr.vehicle_id, timestamp, i, ' smaller than the last record')
          break
        } else if (timestamp === accu[index].timestamps[i]) {
          // replicate record, ignore
          // console.log(curr.vehicle_id, timestamp, ' replica2 - deleted')
          break
        }
      }
    }
  }

  return accu;
}

export function getPathFromPoints (points) {

  const pathByVehicleId = points.reduce(
    (accu, curr) => {
      return addPointsToPath(accu, curr, curr.timestamp, curr.position);
    },
    []
  );

  // calculate individual and average speed for each path
  // and center point
  calcAggregatedData (pathByVehicleId);

  return pathByVehicleId
}

function calcDistanceDirect(start, stop) {
  // let dist = length(lineString([start, stop]), {units: 'miles'}); // can be degrees, radians, miles, or kilometers
  // or
  let dist = distance(start, stop, {units: 'miles'});
  return dist
}

// TO EXPAND ON ALL THE BUS ROUTES
// function calcDistanceProjectAlongLine(start, stop) {
  // could have two points projecting to the same spots
  // var sliced = lineSlice(start, stop, BX4_BUS_ROUTE0.features[0]);
  // let dist = length(sliced, {units: 'miles'});
  // // console.log(sliced, dist)
  // return dist
// }

function calcAggregatedData (pathByVehicleId) {

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
      // let distance = calcDistanceProjectAlongLine(positions[pos - 1], positions[pos])

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
 *      direction: number, 
 *      speedmph: number,
 *      // for heatmap
        heatRadiusThreshold: ,
        heatTimeWindow: ,
        withinThreshold: [],
        withinThresholdVehicles: Set,
 *     }, 
 *      ...
 * ]
 */

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

export function getPointsFromPath (paths) {

  if (!paths || paths.length === 0) {
    return null 
  }

  return paths.reduce(
    (accu, curr) => {
      for (let index = 0; index < curr.path.length; index++) {

        // if (curr.directions[index] !== 0 && curr.directions[index] !== 1) {
        //   alert('direction not 0 or 1', curr.vehicle_id, curr.path[index], curr.timestamps[index], curr.directions[index], typeof curr.directions[index])
        // }

        accu.push({
          position: curr.path[index],
          vehicle_id: curr.vehicle_id,
          route: curr.route,
          timestamp: curr.timestamps[index],
          bearing: curr.bearings[index],
          direction: curr.directions[index],
          speedmph: curr.speedmphs[index],
          // passenger_count
        })
      }
      return accu;
    },
    []
  );
}

function calcBunchingPoints(
  positions, timestamps, directions, // positions to choose from
  center, anchorTime, direction, // center point
  threshold, timeWindow = 120) {
  // need to align the data first - heatmap animation

  // check points on any path in timeWindow
  const timeRangeLowerBound = anchorTime - timeWindow * 1000;
  const timeRangeUpperBound = anchorTime + timeWindow * 1000;
  // find position index range by time window
  let lowerIndex = timestamps.findIndex( (t) => t > timeRangeLowerBound ); // included
  let UpperIndex = timestamps.findIndex( (t) => t > timeRangeUpperBound ); // not included
  if (lowerIndex === -1) { // all timestamps are smaller than lower bound
  }
  else if (UpperIndex === -1) { // all timestamps are smaller than upper bound -> [lowerIndex, end]
    UpperIndex = timestamps.length
  }

  // check the direction, should be of the same
  const sameDirectionInd = []
  for (let i = lowerIndex; i < UpperIndex; i++) {
    if (directions[i] === direction) {
      sameDirectionInd.push(i)
    }  
  }

  const bunchingPoints = positions.filter( 
                            (curr, index) => sameDirectionInd.indexOf(index) !== -1 && distance(center, curr, {units: 'miles'}) <= threshold )

  return bunchingPoints
}

// calculate Bunching Points use direct distances - if more exact, should be the distance along the bus routes, i.e M15
export function calculateBunchingPoints(points, paths, threshold, timeWindow) {

  if (!points || !paths) {
    return
  }

  // calculate the nearest neighborhood count and mark them
  for (let index = 0; index < points.length; index++) {
    // update points
    points[index].heatRadiusThreshold = threshold;
    points[index].heatTimeWindow = timeWindow;
    points[index].withinThreshold = [];
    points[index].withinThresholdVehicles = new Set();

    // calculate nearest points indeics in certain miles for paths of the same route
    for (let i = 0; i < paths.length; i++) {
      if (points[index].route !== paths[i].route) {
        continue
      }
      const bunchingPoints = calcBunchingPoints(
                                paths[i].path, paths[i].timestamps, paths[i].directions, 
                                points[index].position, points[index].timestamp, points[index].direction, 
                                threshold, timeWindow)
      if (bunchingPoints.length === 0) {
        // console.log(paths[i].vehicle_id, 'did not passby ', points[index].vehicle_id)
      } else {
        points[index].withinThreshold = points[index].withinThreshold.concat(bunchingPoints)
        points[index].withinThresholdVehicles.add(paths[i].vehicle_id)
      }
    }
  }
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
export function getGeoJsonFromPath (paths) {

  if (!paths || paths.length === 0) {
    return null 
  }

  return paths.reduce(
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

export function getGeoJsonFromPoints (points) {

  if (!points || points.length === 0) {
   return null 
  }

  return points.reduce(
    (accu, curr) => {
        accu.push({
          geometry: {
            type: 'Point', 
            coordinates: curr.position
          },
          properties: {
            vehicle_id: curr.vehicle_id,
            route: curr.route,
            timestamp: curr.timestamp,
            bearing: curr.bearing,
            speedmph: curr.speedmph,
            direction: curr.direction,
            // for heatmap
            heatRadiusThreshold: curr.heatRadiusThreshold,
            heatTimeWindow: curr.heatTimeWindow,
            withinThreshold: curr.withinThreshold,
            withinThresholdVehicles: curr.withinThresholdVehicles,
          },
          type: "Feature"
        }
        )
      return accu;
    },
    []
  );
}