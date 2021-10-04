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
export function getDataFromJson (rawData) {

  return rawData.reduce(
    (accu, curr) => {

      // process timestamp
      let currTimestamp = new Date(
        curr.properties.timestamp.substring(0, 19) // '2021-09-20 12:51:46-04:00'
        );
      currTimestamp = currTimestamp.getMinutes() * 60 + currTimestamp.getSeconds()

      // make up speed
      let speed = Math.random() * 10;

      const index = accu.findIndex((currentValue) => currentValue.vehicle_id === curr.properties.vehicle_id);
      if (index < 0) {
        // didn't find the vehicle, create new
        accu.push({
          vehicle_id: curr.properties.vehicle_id,
          route_long: curr.properties.route_long,
          path: [curr.geometry.coordinates],
          timestamps: [currTimestamp],
          speedmph: [speed],
          // realTimes: [curr.properties.timestamp]
        })
        
      } else {
        // add to the path and timestamps
        accu[index].path.push(curr.geometry.coordinates)
        accu[index].timestamps.push(currTimestamp)
        accu[index].speedmph.push(speed)
        // accu[index].realTimes.push(curr.properties.timestamp)
      }

      return accu;
    },
    []
  );
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
      currTimestamp = currTimestamp.getMinutes() * 60 + currTimestamp.getSeconds();

      // make up speed
      let speed = Math.random() * 30;

      accu.push({
        position: curr.geometry.coordinates,
        vehicle_id: curr.properties.vehicle_id,
        route_long: curr.properties.route_long,
        timestamp: currTimestamp,
        bearing: curr.properties.bearing,
        speedmph: speed
      })
      return accu;
    },
    []
  );
}