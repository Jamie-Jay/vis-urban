import { GeoJsonLayer } from '@deck.gl/layers';
import { COLOR_PALETTE } from '../helper/constants'

export function GeoJson({data, onHover, settings}) {

  // const { data, onHover, settings } = props;
  /**
   * Data format:
   * Valid GeoJSON object
   */
  const layer = 
    settings.showGeoJson &&
    new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      pickable: true,
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
      getElevation: 30,
      onHover
    });

  return [layer];
}