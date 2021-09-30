import {useState, useEffect} from 'react';
import {TripsLayer} from '@deck.gl/geo-layers';
// import {PolygonLayer} from '@deck.gl/layers';
import { COLOR_PALETTE } from '../helper/Constants'

export const Trips = ({
  tripPath,
  trailLength = 180,
  loopLength = 1800, // unit corresponds to the timestamp in source data
  animationSpeed = 1,
  settings = null,
  onHover = null
}) => {
  const [time, setTime] = useState(0);
  const [animation] = useState({});

  const animate = () => {
    setTime(t => (t + animationSpeed) % loopLength);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(
    () => {
      animation.id = window.requestAnimationFrame(animate);
      return () => window.cancelAnimationFrame(animation.id);
    },
    [animation]
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
    })
  ];

  return layers;
}
