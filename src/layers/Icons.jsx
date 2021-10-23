import {IconLayer} from '@deck.gl/layers';
import { easeBackInOut } from 'd3';

import { inverseSpeed, colorSchema } from '../helper/controls'

const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 128, height: 128, mask: true},
  markerSlow: {x: 128, y: 0, width: 128, height: 128, mask: false},
};

const iconMapping = ICON_MAPPING;
const iconAtlas = 'data/icon-atlas.png';

export const Icons = (props) => {

  const { data, settings, onHover } = props;

  return [
      new IconLayer({
        id: 'icon',
        data,
        visible: settings.showIcons,
        pickable: true,
        // opacity,
        onHover,
        autoHighlight: true,
        highlightColor: [255, 255, 255],

        iconAtlas,  // iconAtlas 
        iconMapping,  // iconMapping 
        sizeScale: settings.IconSizeScale, // iconSizeScale 
        sizeUnits: 'meters', // iconSizeUnits, one of 'meters', 'common', and 'pixels' 
        sizeMinPixels: 6, // iconSizeMinPixels 
        // sizeMaxPixels  // iconSizeMaxPixels 
        billboard: false,
        // alphaCutoff, // Discard pixels whose opacity is below this threshold.
                      // setting alphaCutoff: 0, autoHighlight will highlight an object whenever the cursor moves into its bounding box, instead of over the visible pixels.
        // loadOptions
        // textureParameters
        
        getIcon: d => (d.speedmph <= settings.IconsSpeedThreshold) ? 'markerSlow' : 'marker', // getIcon 
        getPosition: d => d.position,
        getSize: d => settings.IconSizeInverseSpeed ? inverseSpeed(d.speedmph) : Math.min(d.speedmph, 50.0), // do not inverse when speed = 0 // getIconSize 
        getColor: d => colorSchema(d.vehicle_id), //[255 / d.speedmph, 140, 0], // getIconColor 
        getAngle: d => d.bearing + 90, // getIconAngle 
        // getPixelOffset  // getIconPixelOffset, Screen space offset relative to the coordinates in pixel unit.
        
        // onIconError

        updateTriggers: {
          getIcon: [settings.IconsSpeedThreshold],
          getSize: [settings.IconSizeInverseSpeed]
        },
        transitions: {
          getSize:  {
            duration: 3000,
            easing: easeBackInOut,
          }
        }
      })
  ]
}
