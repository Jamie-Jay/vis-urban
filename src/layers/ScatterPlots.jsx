import CustomScatterplotLayer from './ScatterArrowPlotAnimate';
import { convertTimeToTimer, inverseSpeed, colorSchema } from '../helper/controls'

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
      autoHighlight: true,
      highlightColor: [255, 255, 255],
  
      getPosition: d => d.position,
      getFillColor: d => colorSchema(d.vehicle_id),
      getLineColor: d => colorSchema(d.vehicle_id),
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
