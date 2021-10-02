import React, {useState, useEffect} from 'react';
import CustomScatterplotLayer from './ScatterArrowPlot';

const SCATTER_COLOR = [0, 128, 255];

export const ScatterPlots = (props) => {

  const { data, onHover, settings } = props;

  const [time, setTime] = useState(0);

  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(1800);
  useEffect(
    () => {
      const timestamps = data.reduce(
        (ts, trip) => {
          ts.push(trip.timestamp);
          return ts; 
        },
        []
      );
    
      setMinTime(Math.min(...timestamps));
      setMaxTime(Math.max(...timestamps));
    },
    [data]
  )

  // use window.requestAnimationFrame function
  // it allows the browser to request the interval when it's ready (based on how long the previous loop took to render).
  const [animation] = useState({});

  const animate = () => {
    setTime(t => (t + 1) % maxTime);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(
    () => {
      animation.id = window.requestAnimationFrame(animate);
      return () => window.cancelAnimationFrame(animation.id);
    },
    [animation, maxTime]
  );

  return [
    settings.showScatterplot &&
    data &&
      new CustomScatterplotLayer({
        id: 'scatterplot',
        getPosition: d => d.position,
        getFillColor: d => SCATTER_COLOR,
        getLineColor: d => SCATTER_COLOR,
        getRadius: d => d.speedmph,
        // accessor for custom layer
        getAngle: d => d.bearing / 180 * Math.PI,
        getTime: d => d.timestamp,
        // getTime: d => { 1.0 - Math.abs(d.timestamp - time) / 3600 },
        currentTime: time,
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        data,
        onHover,
        // ...settings
      }),
    settings.showScatterplot &&
    (
      <div>
        <b>Scatterplot Time: </b> { time }
      </div>
    )
  ];
}
