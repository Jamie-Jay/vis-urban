// import { ScatterplotLayer } from 'deck.gl';
import CustomScatterplotLayer from './ScatterArrowPlot';

const SCATTER_COLOR = [0, 128, 255];

export const ScatterPlots = (props) => {

  const { data, onHover, settings } = props;

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
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        data,
        onHover,
        // ...settings
      }),
  ];
}
