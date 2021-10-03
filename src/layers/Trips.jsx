import {TripsLayer} from '@deck.gl/geo-layers';
// import {PolygonLayer} from '@deck.gl/layers';
import { COLOR_PALETTE } from '../helper/constants'

export const Trips = (props) => {

  const { tripPath, settings, currentTime } = props;
  const trailLength = 180;

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
      getColor: d => COLOR_PALETTE[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24],
      opacity: 0.3,
      widthMinPixels: 2,
      widthMaxPixels: 10,
      // widthScale: d => 10,//d.speedmph,
      rounded: true,
      trailLength,
      currentTime: currentTime,

      shadowEnabled: false,
      // onHover,
      // ...settings
    })
  ];

  return layers;
}
