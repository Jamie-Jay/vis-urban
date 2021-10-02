// import { ScatterplotLayer } from 'deck.gl';
import CustomScatterplotLayer from './ScatterArrowPlot';

const SCATTER_COLOR = [0, 128, 255];

export const ScatterPlots = (props) => {

  const { data, onHover, settings } = props;

  // loop through [0, 24] every 24 seconds using the computer's clock
  const timeOfDay = (Date.now() / 1000) % 3600;

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
        // getTime: d => d.timestamp,
        getTime: d => { 
          console.log(d.timestamp, timeOfDay, 1.0 - Math.abs(d.timestamp - timeOfDay) / 3600);
          return 1.0 - Math.abs(d.timestamp - timeOfDay) / 3600
        },

        // currentTime: timeOfDay,
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
