import React, {useState, useEffect} from 'react';
import {TripsLayer} from '@deck.gl/geo-layers';
// import {PolygonLayer} from '@deck.gl/layers';
import { COLOR_PALETTE } from '../helper/constants'

export const Trips = ({
  tripPath,
  trailLength = 180,
  loopLength = 1800, // unit corresponds to the timestamp in source data
  animationSpeed = 1,
  settings = null,
  onHover = null
}) => {
  // The key in all of this is the currentTime variable. 
  // This variable tells DeckGL which path coordinate to render, based on the the corresponding timestamp.
  const [time, setTime] = useState(0);

  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(loopLength);
  useEffect(
    () => {
      const timestamps = tripPath.reduce(
        (ts, trip) => ts.concat(trip.timestamps),
        []
      );
    
      setMinTime(Math.min(...timestamps));
      setMaxTime(Math.max(...timestamps));
    },
    [tripPath]
  )

  /*
  // use timeinteval to implement animation
  // the animation will likely start to break down and become "choppy". 
  // This generally tends to happen if it takes longer to execute the loop than the interval (intervals will start getting backed up).
  const intervalMS = 20;
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + animationSpeed) % loopLength);
    }, intervalMS);
  
    return () => clearInterval(interval);
  }, []);
  */

  // use window.requestAnimationFrame function
  // it allows the browser to request the interval when it's ready (based on how long the previous loop took to render).
  // https://css-tricks.com/using-requestanimationframe/
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  const [animation] = useState({});

  const animate = () => {
    setTime(t => (t + animationSpeed) % maxTime);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(
    () => {
      animation.id = window.requestAnimationFrame(animate);
      return () => window.cancelAnimationFrame(animation.id);
    },
    [animation, maxTime]
  );

  const layers = [
    // This is only needed when using shadow effects
    // new PolygonLayer({
    //   id: 'ground',
    //   data: landCover,
    //   getPolygon: f => f,
    //   stroked: false,
    //   getFillColor: [0, 0, 0, 0]
    // }),
    settings.showTripTrace &&
    new TripsLayer({
      id: 'trips',
      data: tripPath,
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getColor: d => COLOR_PALETTE[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24], // (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
      opacity: 0.3,
      widthMinPixels: 2,
      widthMaxPixels: 10,
      // widthScale: d => 10,//d.speedmph,
      rounded: true,
      trailLength,
      currentTime: time,

      shadowEnabled: false,
      // onHover,
      // ...settings
    }),
    // time bar
    settings.showTripTrace &&
    tripPath.length > 0 &&
    (
      <div style={{ width: '100%', marginTop: "1.5rem" }}>
        <b>Trip Trace Controller</b>
        <input
          style={{ width: '100%' }}
          type="range"
          min={minTime}
          max={maxTime}
          step="0.1"
          value={time}
          onChange={(e) => { setTime(Number(e.target.value)); }}
        />
        Time: {time}
      </div>
    )
  ];

  return layers;
}
