import { HexagonLayer } from 'deck.gl';

// in RGB

const HEATMAP_COLORS = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [44, 127, 184],
  [37, 52, 148]
];

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const elevationRange = [0, 1000];

export const Hexagons = (props) => {
  const { data, onHover, settings } = props;

  return [
    new HexagonLayer({
      id: 'heatmap',
      data,
      visible: settings.showHexagon,
      opacity: 0.8,
      pickable: true,
      onHover,

      colorRange: HEATMAP_COLORS,
      elevationRange,
      elevationScale: 5,
      extruded: true, // Whether to enable hexagon elevation
      getPosition: d => d.position, // Function that gets called on each data point, should return an array of [longitude, latitude].
      lightSettings: LIGHT_SETTINGS,

      // fix settings
      radius: 100, // radius {Number}, Hexagon layer cell radius in meters
      coverage: 0.5,
      upperPercentile: 100 // upperPercentile {Number} (Default: 100), Hexagon cells with value larger than upperPercentile will be hidden
    })
  ];
}
