import { GeoJsonLayer } from '@deck.gl/layers';
import { COLOR_PALETTE } from '../helper/constants'

export function GeoJson(props) {

  const { data, onHover, settings } = props;
  /**
   * Data format:
   * Valid GeoJSON object
   */
  const layer = 
    new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      visible: settings.showGeoJson,
      pickable: true,
      onHover,

      stroked: false,
      filled: true,
      extruded: true,
      pointType: 'circle',
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: d => COLOR_PALETTE[parseInt(d.properties.vehicle_id.substr(d.properties.vehicle_id.length - 4)) % 24], // (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
      getLineColor: d => COLOR_PALETTE[parseInt(d.properties.vehicle_id.substr(d.properties.vehicle_id.length - 4)) % 24],
      getPointRadius: 10,
      getLineWidth: 5,
      getElevation: 30      
    });

  return [layer];
}