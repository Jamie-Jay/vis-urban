import CustomScatterplotLayer from './ScatterArrowPlotAnimate';
import { COLOR_PALETTE } from '../helper/constants'
import { convertTimeToTimer, inverseSpeed } from '../helper/controls'

export const ScatterPlots = (props) => {

  const { data, onHover, settings, currentTime } = props;

  const layerProps = {
    data,
    pickable: true,
    getPosition: d => d.position,
    getFillColor: d => COLOR_PALETTE[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24],
    getLineColor: d => COLOR_PALETTE[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24],
    radiusScale: settings.IconSizeScale,
    // accessor for custom layer
    getAngle: d => d.bearing / 180 * Math.PI,
    getTime: d => convertTimeToTimer(d.timestamp),
    currentTime: currentTime,
    opacity: 0.5,
    radiusMinPixels: 2,
    // radiusMaxPixels: 30,
    onHover
  };


  return [
    settings.showScatterplot && (
      settings.IconSizeInverseSpeed ? 
      new CustomScatterplotLayer({
        id: 'scatterplot-inverse',
        ...layerProps,
        getRadius: d => inverseSpeed(d.speedmph)
      })
      :
      new CustomScatterplotLayer({
        id: 'scatterplot',
        ...layerProps,
        getRadius: d => Math.min(d.speedmph, 50.0) // speed no faster than 50
      })
    )
  ];
}
