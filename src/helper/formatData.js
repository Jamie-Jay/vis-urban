import * as turf from '@turf/turf'
// rawData: from api json
/** turn to 
 * [
      {
        "vehicle_id": , 
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
          route_long: curr.properties.route_long,
          path: [curr.geometry.coordinates],
          timestamps: [currTimestamp],
          bearings: [curr.properties.bearing]
        })
        
      } else {
        // add to the path and timestamps
        accu[index].path.push(curr.geometry.coordinates)
        accu[index].timestamps.push(currTimestamp)
        accu[index].bearings.push(curr.properties.bearing)
      }

      return accu;
    },
    []
  );

  calcSpeed (rawData);

  return pathByVehicleId
}

function calcSpeed (rawData) {

  if (pathByVehicleId === {}) {
    getPathFromJson (rawData)
  }

  // console.log(pathByVehicleId)
  let linestring = {
    'type': 'Feature',
    'geometry': {
      'type': 'LineString',
      'coordinates': [
        [0, 0],
        [0, 0]
      ]
    }
  };

  for (let index = 0; index < pathByVehicleId.length; index++) {
    const positions = pathByVehicleId[index].path;
    pathByVehicleId[index].speedmphs = [0] // inital the speedmphs

    // only one positions
    if (positions.length < 2) {
      continue
    }

    // more than one positions
    // add initial position
    linestring.geometry.coordinates[0] = positions[0]
    for (let pos = 1; pos < positions.length; pos++) {
      // replace the first or the second pos
      linestring.geometry.coordinates[pos % 2] = positions[pos];

      // distance from the last point
      let distance = turf.length(linestring, {units: 'miles'}); // can be degrees, radians, miles, or kilometers
      // time diff
      let timeDiff = pathByVehicleId[index].timestamps[pos] - pathByVehicleId[index].timestamps[pos - 1]
      // speed
      let speedmph = timeDiff === 0 ? 0 : distance / timeDiff * 1000 * 60 * 60
      pathByVehicleId[index].speedmphs.push(speedmph)
    }
    // assume the first position speed = the second speed
    pathByVehicleId[index].speedmphs[0] = pathByVehicleId[index].speedmphs[1]
  }
}

// rawData: from api json
/**
 * turn to 
 * [
 *    {
 *      position: [,], 
 *      vehicle_id: '', 
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
        route_long: curr.properties.route_long,
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
          route_long: curr.route_long,
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