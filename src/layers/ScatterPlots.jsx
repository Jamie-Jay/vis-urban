import { ScatterplotLayer } from 'deck.gl';

const PICKUP_COLOR = [114, 19, 108];

export const ScatterPlots = (props) => {

  const { data, onHover, settings } = props;

  return [
    settings.showScatterplot &&
    data &&
      new ScatterplotLayer({
        id: 'scatterplot',
        getPosition: d => d.position,
        getColor: d => PICKUP_COLOR,
        getRadius: d => d.speedmph,
        // radiusScale: settings.radiusScale,
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
