/* global window */
import {useState, useEffect} from 'react';
import {TripsLayer} from '@deck.gl/geo-layers';
// import {PolygonLayer} from '@deck.gl/layers';

const colorVal = [
  [0xF4, 0xEC, 0x15],
  [0xDA, 0xF0, 0x17],
  [0xBB, 0xEC, 0x19],
  [0x9D, 0xE8, 0x1B],
  [0x80, 0xE4, 0x1D],
  [0x66, 0xE0, 0x1F],
  [0x4C, 0xDC, 0x20],
  [0x34, 0xD8, 0x22],
  [0x24, 0xD2, 0x49],
  [0x25, 0xD0, 0x42],
  [0x26, 0xCC, 0x58],
  [0x28, 0xC8, 0x6D],
  [0x29, 0xC4, 0x81],
  [0x2A, 0xC0, 0x93],
  [0x2B, 0xBC, 0xA4],
  [0x2B, 0xB5, 0xB8],
  [0x2C, 0x99, 0xB4],
  [0x2D, 0x7E, 0xB0],
  [0x2D, 0x65, 0xAC],
  [0x2E, 0x4E, 0xA4],
  [0x2E, 0x38, 0xA4],
  [0x3B, 0x2F, 0xA0],
  [0x4E, 0x2F, 0x9C],
  [0x60, 0x30, 0x99],
];

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
    new TripsLayer({
      id: 'trips',
      data: tripPath,
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getColor: d => colorVal[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24], // (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
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
