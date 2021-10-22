import {IconLayer} from '@deck.gl/layers';
import { COLOR_PALETTE } from '../helper/constants'
import { inverseSpeed } from '../helper/controls'

const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 128, height: 128, mask: true},
  markerSlow: {x: 128, y: 0, width: 128, height: 128, mask: false},
};

const iconMapping = ICON_MAPPING;
const iconAtlas = 'data/icon-atlas.png';

export const Icons = (props) => {

  const { data, settings, onHover } = props;

  const layerProps = {
    data,
    pickable: true,
    getPosition: d => d.position,
    iconAtlas,
    iconMapping,
    sizeUnits: 'meters',
    sizeScale: settings.IconSizeScale,
    sizeMinPixels: 6,
    getColor: d => COLOR_PALETTE[parseInt(d.vehicle_id.substr(d.vehicle_id.length - 4)) % 24], //[255 / d.speedmph, 140, 0],
    getAngle: d => d.bearing + 90,
    getIcon: d => {
      if (d.speedmph <= 2) {
        return 'markerSlow';
      }
    
      return 'marker';
    },
    onHover
  };

  return [
    settings.showIcons && (
      settings.IconSizeInverseSpeed ? 
        new IconLayer({
          id: 'icon-inverse',
          ...layerProps,
          getSize: d => inverseSpeed(d.speedmph) // do not inverse when speed = 0
        })
        :
        new IconLayer({
          id: 'icon',
          ...layerProps,
          getSize: d => Math.max(d.speedmph, 50.0) // speed no faster than 50
        })
    )
  ]
}
