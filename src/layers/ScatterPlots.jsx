import CustomScatterplotLayer from './ScatterArrowPlot';
import { COLOR_PALETTE } from '../helper/constants'

export const ScatterPlots = (props) => {

  const { data, onHover, settings, currentTime } = props;

  return [
    settings.showScatterplot &&
    new CustomScatterplotLayer({
      id: 'scatterplot',
      getPosition: d => d.position,
      getFillColor: d => COLOR_PALETTE[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24],
      getLineColor: d => COLOR_PALETTE[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24],
      getRadius: d => d.speedmph * 3,
      // accessor for custom layer
      getAngle: d => d.bearing / 180 * Math.PI,
      getTime: d => d.timestamp,
      // getTime: d => { 1.0 - Math.abs(d.timestamp - time) / 3600 },
      currentTime: currentTime,
      opacity: 0.5,
      pickable: true,
      radiusMinPixels: 0.25,
      radiusMaxPixels: 30,
      data,
      onHover,
      // ...settings
    })
  ];
}
