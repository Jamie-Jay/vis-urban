import { useState } from 'react';
import { IconLayer } from '@deck.gl/layers';
import { easeBackInOut } from 'd3';

import { getInverseSpeed, colorSchema, getSpeed, isZero, colorZeroSpeed, colorSlowSpeed, colorHighlighted } from '../helper/helperFuns'
import { iconAtlas, iconMapping } from '../helper/constants'

export const Icons = (props) => {

  const { data, settings, onHover } = props;

  const [withinHovered, setWithinHovered] = useState([])

  return [
      new IconLayer({
        id: 'icon',
        data,
        visible: settings.showPositions === 2,
        pickable: true,
        // opacity,
        onHover: (hover) => {
          onHover(hover);
          if (hover.index !== -1) {
            setWithinHovered(hover.object.withinThreshold)
          } else {
            setWithinHovered([])
          }
        },
        autoHighlight: true,
        highlightColor: colorHighlighted(),

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
        getSize: d => settings.IconSizeInverseSpeed ? getInverseSpeed(d.speedmph) : getSpeed(d.speedmph), // do not inverse when speed = 0 // getIconSize 
        getColor: d => {
          const orignialColor = (d.speedmph <= settings.IconsSpeedThreshold) ? 
                                  (isZero(d.speedmph) ? colorZeroSpeed(200) : colorSlowSpeed()) 
                                  : colorSchema(d.vehicle_id, 200)
          // set the points within distance a different color
          if (withinHovered.length > 0) {
            if(withinHovered.indexOf(d.position) !== -1) {
              return settings.showNearByPointsOnlyWhenHovering ?
                      // true: nearby points show original color, other points disappear, 
                      orignialColor
                      // false: nearby points highlighted, other points remain
                      : isZero(d.speedmph) ? colorZeroSpeed(200) : colorHighlighted(200)
            } else {
              return settings.showNearByPointsOnlyWhenHovering ?
                      // true: nearby points show original color, other points disappear, 
                      [0, 0, 0, 0]
                      // false: nearby points highlighted, other points remain
                      : orignialColor
            }
          } else {
            return orignialColor
          }
        }, // getIconColor 
        getAngle: d => d.bearing + 90, // getIconAngle 
        // getPixelOffset  // getIconPixelOffset, Screen space offset relative to the coordinates in pixel unit.
        
        // onIconError

        updateTriggers: {
          getIcon: [settings.IconsSpeedThreshold],
          getSize: [settings.IconSizeInverseSpeed],
          getColor: [settings.IconsSpeedThreshold, withinHovered, settings.showNearByPointsOnlyWhenHovering]
        },
        transitions: {
          getSize:  {
            duration: 3000,
            easing: easeBackInOut,
          },
          // getPosition: { 
          //   duration: 1000,
          //   // enter: value => {console.log(value); return [value[0], value[1], value[2]]},
          // }
        }
      })
  ]
}
