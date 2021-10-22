import {TripsLayer} from '@deck.gl/geo-layers';
// import {PolygonLayer} from '@deck.gl/layers';
import { COLOR_PALETTE } from '../helper/constants'
import { convertTimeToTimer } from '../helper/controls'

export const Trips = (props) => {

  const { data, settings, onHover, currentTime } = props;
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
    new TripsLayer({
      id: 'trips',
      data,
      visible: settings.showTripTrace,
      pickable: true,
      onHover,

      getPath: d => d.path,
      getTimestamps: d => d.timestamps.map((timestamp) => convertTimeToTimer(timestamp)),
      getColor: d => COLOR_PALETTE[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24],
      opacity: 0.3,
      widthMinPixels: 2,
      // widthMaxPixels: 10,
      // widthScale: d => 10,//d.speedmph,
      getWidth: settings.TripTraceWidth, //d => d.speedmphs * 300,
      rounded: true,
      trailLength,
      currentTime: currentTime,
      shadowEnabled: false
    })
  ];

  return layers;
}
