import { TripsLayer } from '@deck.gl/geo-layers';
// import {PolygonLayer} from '@deck.gl/layers';
import { convertTimeToTimer, colorSchema, colorHighlighted } from '../helper/helperFuns'

export const Trips = (props) => {

  const { data, settings, onHover, currentTime, unifySymbols = false } = props;
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
      visible: settings.showPositions === 3 || settings.showTripTrace === true,
      opacity: 0.3,
      pickable: true,
      onHover,
      autoHighlight: true,
      highlightColor: colorHighlighted(),

      getPath: d => d.path,
      getTimestamps: d => d.timestamps.map((timestamp) => convertTimeToTimer(timestamp)),

      getColor: unifySymbols ? [0, 255, 255] : d => colorSchema(d.vehicle_id),
      // widthUnits, // one of 'meters', 'common', and 'pixels'
      widthScale: settings.TripTraceWidth,
      widthMinPixels: 2,
      // widthMaxPixels: 10,
      getWidth: unifySymbols ? 10 : d => d.speedmph_avg,
      // rounded: true,
      jointRounded: false,
      capRounded: false,
      billboard: false,
      // miterLimit,
      // _pathType, // One of null, 'loop' or 'open'

      currentTime: currentTime,
      fadeTrail: true,
      trailLength, //: settings.TripTraceWidth,
      // shadowEnabled: true
    })
  ];

  return layers;
}
