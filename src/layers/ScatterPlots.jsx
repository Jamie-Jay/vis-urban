import CustomScatterplotLayer from './ScatterArrowPlotAnimate';
import { COLOR_PALETTE } from '../helper/constants'
import { convertTimeToTimer, inverseSpeed } from '../helper/controls'

export const ScatterPlots = (props) => {

  const { data, onHover, settings, currentTime } = props;

  return [
    new CustomScatterplotLayer({
      id: 'scatterplot',
      data,
      visible: settings.showScatterplot,
      opacity: 0.5,
      pickable: true,
      onHover,
  
      getPosition: d => d.position,
      getFillColor: d => COLOR_PALETTE[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24],
      getLineColor: d => COLOR_PALETTE[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24],
      radiusScale: settings.IconSizeScale,
      radiusMinPixels: 2,
      // radiusMaxPixels: 30,
      getRadius: d => settings.IconSizeInverseSpeed ? inverseSpeed(d.speedmph) : Math.min(d.speedmph, 50.0),
      updateTriggers: {
        getRadius: [settings.IconSizeInverseSpeed]
      },

      // accessor for custom layer
      getAngle: d => d.bearing / 180 * Math.PI,
      getTime: d => convertTimeToTimer(d.timestamp),
      currentTime: currentTime
    })
  ];
}
