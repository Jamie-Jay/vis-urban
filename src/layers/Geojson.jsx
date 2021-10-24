import { GeoJsonLayer } from '@deck.gl/layers';
import { DataFilterExtension } from '@deck.gl/extensions';
import { convertTimeToTimer, colorSchema, inverseSpeed } from '../helper/controls'
// import { iconAtlas, iconMapping } from '../helper/constants'

export function GeoJson(props) {

  const { data, currentTime, onHover, settings } = props;

  /**
   * Data format:
   * Valid GeoJSON object
   */
  function getSizeBySpeed(d) {
    return settings.IconSizeInverseSpeed ? inverseSpeed(d.speedmph) : Math.min(d.speedmph, 50.0)
  }

  function getVehicleColorBySpeed(d) {
    return d.speedmph > settings.IconsSpeedThreshold ? colorSchema(d.vehicle_id, 200) : [255, 0, 0, 200] // a is 255 if not supplied.
  }

  const layer = 
    new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      visible: settings.showGeoJson,
      pickable: true,
      onHover,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 0.8],

      pointType: 'circle+text',// circle or icon or text or  join the names with + (e.g. 'icon+text')

      // control the solid fill of Polygon and MultiPolygon features(not extruded), and the Point and MultiPoint features if pointType is 'circle'
      filled: true,
      getFillColor: d => getVehicleColorBySpeed(d.properties),

      // control the LineString and MultiLineString features, the outline for Polygon and MultiPolygon features, and the outline for Point and MultiPoint features if pointType is 'circle'
      stroked: false, // Whether to draw an outline around polygons and points (circles)
      getLineColor: d => getVehicleColorBySpeed(d.properties),
      getLineWidth: 5,
      // lineWidthUnits, // one of 'meters', 'common', and 'pixels'
      lineWidthScale: 20, // A multiplier that is applied to all line widths.
      lineWidthMinPixels: 2, // The minimum line width in pixels. This prop can be used to prevent the line from getting too thin when zoomed out.
      // lineWidthMaxPixels,
      // lineCapRounded, // Type of line caps. If true, draw round caps. Otherwise draw square caps.
      // lineJointRounded, // Type of line joint. If true, draw round joints. Otherwise draw miter joints.
      // lineMiterLimit, // The maximum extent of a joint in ratio to the stroke width. Only works if lineJointRounded is false.

      // control the extrusion of Polygon and MultiPolygon features.
      // extruded: true, // Extrude Polygon and MultiPolygon features along the z-axis if set to true. The height of the drawn features is obtained using the getElevation accessor.
      // wireframe, // Whether to generate a line wireframe of the hexagon. The outline will have "horizontal" lines closing the top and bottom polygons and a vertical line (a "strut") for each vertex on the polygon.
      // getElevation: 30, // The elevation of a polygon feature (when extruded is true).
      // elevationScale, // Elevation multiplier
      // material, // This is an object that contains material props for lighting effect applied on extruded polygons.

      // pointType:circle Options
      // props are forwarded to a ScatterplotLayer
      getPointRadius: d => getSizeBySpeed(d.properties), // getRadius
      // pointRadiusUnits // radiusUnits
      pointRadiusScale: settings.IconSizeScale, // radiusScale
      pointRadiusMinPixels: 6, // radiusMinPixels
      // pointRadiusMaxPixels // radiusMaxPixels
      // pointAntialiasing // antialiasing

      // pointType:icon Options
      // props are forwarded to an IconLayer
      // iconAtlas, // iconAtlas
      // iconMapping, // iconMapping
      // billboard: false,
      // getIcon: 'markerSlow', //d=> (d.speedmph <= settings.IconsSpeedThreshold) ? 'markerSlow' : 'marker', // getIcon
      // getIconSize: 20, //d => settings.IconSizeInverseSpeed ? inverseSpeed(d.speedmph) : Math.min(d.speedmph, 50.0), // getSize
      // getIconColor: d => colorSchema(d.properties.vehicle_id), // getColor
      // getIconAngle:  d => d.properties.bearing + 90, // getAngle
      // getIconPixelOffset // getPixelOffset
      // iconSizeUnits: 'meters', // sizeUnits
      // iconSizeScale: settings.IconSizeScale, // sizeScale
      // iconSizeMinPixels: 6, // sizeMinPixels
      // iconSizeMaxPixels // sizeMaxPixels

      // pointType:text Options
      // props are forwarded to a TextLayer
      getText: d => '     ' + d.properties.speedmph.toFixed(2).toString() + ' mph',
      getTextColor: d => getVehicleColorBySpeed(d.properties),
      // getTextAngle
      getTextSize: d => getSizeBySpeed(d.properties),
      getTextAnchor: 'start',
      // getTextAlignmentBaseline
      // getTextPixelOffset
      // getTextBackgroundColor
      // getTextBorderColor
      // getTextBorderWidth
      textSizeUnits: 'meters', // allow size change with zooming
      textSizeScale: settings.IconSizeScale,
      // textSizeMinPixels
      // textSizeMaxPixels
      // textCharacterSet
      textFontFamily: 'system-ui',
      // textFontWeight
      // textLineHeight: 100,
      // textMaxWidth
      // textWordBreak
      // textBackground: [255,255,255],
      // textBackgroundPadding: '20px',
      // textOutlineColor: [255,255,255],
      // textOutlineWidth

      updateTriggers: {
        getFillColor: [settings.IconsSpeedThreshold],
        getTextColor: [settings.IconsSpeedThreshold],
        getPointRadius: [settings.IconSizeInverseSpeed],
        getTextSize: [settings.IconSizeInverseSpeed]
      },

      // props added by DataFilterExtension
      getFilterValue: d => convertTimeToTimer(d.properties.timestamp),
      filterRange: [currentTime - 100, currentTime + 100],
      filterSoftRange: [currentTime - 50, currentTime + 50],
      filterTransformSize: true,
      filterTransformColor: true,

      // Define extensions
      extensions: [new DataFilterExtension(/*{filterSize: 1}*/)]
    });

  return [layer];
}