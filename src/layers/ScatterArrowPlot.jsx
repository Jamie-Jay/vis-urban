import { ScatterplotLayer } from 'deck.gl';

/*
The scatterplot layer draws a rectangle around each data point coordinate. The rectangle is sized to match user defined radius. The unitPosition is a vector that measures any pixel's relative distance to the center of the rectangle, between [-1, -1] and [1, 1].

In the fragment shader code, the main function is what controls the colors that are drawn to the screen. Note that it ends with a if switch: some fragments (think of them as pixels) are assigned a color, some are "discarded" (not drawn). The default implementation only draws a fragment if it's inside the unit circle (distance to center is less than 1.0)
*/
/*
const origFragmentShader = `\
#define SHADER_NAME scatterplot-layer-fragment-shader

precision highp float;

uniform bool filled;
uniform float stroked;
uniform bool antialiasing;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float outerRadiusPixels;

void main(void) {
  geometry.uv = unitPosition;

  float distToCenter = length(unitPosition) * outerRadiusPixels;
  float inCircle = antialiasing ? 
    smoothedge(distToCenter, outerRadiusPixels) : 
    step(distToCenter, outerRadiusPixels);

  if (inCircle == 0.0) {
    discard;
  }

  if (stroked > 0.5) {
    float isLine = antialiasing ? 
      smoothedge(innerUnitRadius * outerRadiusPixels, distToCenter) :
      step(innerUnitRadius * outerRadiusPixels, distToCenter);

    if (filled) {
      gl_FragColor = mix(vFillColor, vLineColor, isLine);
    } else {
      if (isLine == 0.0) {
        discard;
      }
      gl_FragColor = vec4(vLineColor.rgb, vLineColor.a * isLine);
    }
  } else if (filled) {
    gl_FragColor = vFillColor;
  } else {
    discard;
  }

  gl_FragColor.a *= inCircle;
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;*/

const customFragmentShader = `\
#define SHADER_NAME scatterplot-layer-fragment-shader

precision highp float;

uniform bool filled;
uniform float stroked;
uniform bool antialiasing;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float outerRadiusPixels;
varying float vAlpha; // added

void main(void) {
  geometry.uv = unitPosition;
  
  // // a cross
  // if (abs(unitPosition.x) < 0.2 || abs(unitPosition.y) < 0.2) {
  //   gl_FragColor = vec4(vFillColor.rgb, vAlpha);
  // } else {
  //   discard;
  // }
  
  // An arrow head
  if (unitPosition.x < 1.0 - abs(unitPosition.y) * 4.0) {
    gl_FragColor = vec4(vFillColor.rgb, vAlpha);
  } else {
    discard;
  }

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;
/*
const origVertexShader = `
#define SHADER_NAME scatterplot-layer-vertex-shader

attribute vec3 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceRadius;
attribute float instanceLineWidths;
attribute vec4 instanceFillColors;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform float lineWidthScale;
uniform float lineWidthMinPixels;
uniform float lineWidthMaxPixels;
uniform float stroked;
uniform bool filled;
uniform bool billboard;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float outerRadiusPixels;

void main(void) {
  geometry.worldPosition = instancePositions;
  outerRadiusPixels = clamp(
    project_size_to_pixel(radiusScale * instanceRadius),
    radiusMinPixels, radiusMaxPixels
  );
  float lineWidthPixels = clamp(
    project_size_to_pixel(lineWidthScale * instanceLineWidths),
    lineWidthMinPixels, lineWidthMaxPixels
  );
  outerRadiusPixels += stroked * lineWidthPixels / 2.0;
  unitPosition = positions.xy;
  geometry.uv = unitPosition;
  geometry.pickingColor = instancePickingColors;

  innerUnitRadius = 1.0 - stroked * lineWidthPixels / outerRadiusPixels;
  
  if (billboard) {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    vec3 offset = positions * outerRadiusPixels;
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
  } else {
    vec3 offset = positions * project_pixel_size(outerRadiusPixels);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset, geometry.position);
  }

  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);
  DECKGL_FILTER_COLOR(vFillColor, geometry);
  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);
  DECKGL_FILTER_COLOR(vLineColor, geometry);
}
`;*/

const customVertexShader = `
#define SHADER_NAME scatterplot-layer-vertex-shader

attribute vec3 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceRadius;
attribute float instanceLineWidths;
attribute vec4 instanceFillColors;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;
attribute float instanceAngles;
attribute float instanceTimes;

uniform float opacity;
uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform float lineWidthScale;
uniform float lineWidthMinPixels;
uniform float lineWidthMaxPixels;
uniform float stroked;
uniform bool filled;
uniform bool billboard;
// uniform float currentTime;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float outerRadiusPixels;
varying float vAlpha; // an opacity value, how vertex shader can send data to the fragment shader

// user specified angle
vec3 rotateZ(vec3 vector, float angle) {
  mat2 rotationMatrix = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
  return vec3(rotationMatrix * vector.xy, vector.z);
}

// calculates the position of the current vertex
// The scatterplot layer draws a rectangle at each data point. Every time the vertex shader is run, it calculates one of the corners of the rectangle. 
void main(void) {
  geometry.worldPosition = instancePositions;
  outerRadiusPixels = clamp(
    project_size_to_pixel(radiusScale * instanceRadius),
    radiusMinPixels, radiusMaxPixels
  );
  float lineWidthPixels = clamp(
    project_size_to_pixel(lineWidthScale * instanceLineWidths),
    lineWidthMinPixels, lineWidthMaxPixels
  );
  outerRadiusPixels += stroked * lineWidthPixels / 2.0;
  unitPosition = positions.xy;
  geometry.uv = unitPosition;
  geometry.pickingColor = instancePickingColors;

  innerUnitRadius = 1.0 - stroked * lineWidthPixels / outerRadiusPixels;
  
  if (billboard) {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    vec3 offset = positions * outerRadiusPixels;
    // Rotate by instanceAngles
    offset = rotateZ(offset, instanceAngles);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
  } else {
    vec3 offset = positions * project_pixel_size(outerRadiusPixels);
    // Rotate by instanceAngles
    offset = rotateZ(offset, instanceAngles);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset, geometry.position);
  }

  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);
  DECKGL_FILTER_COLOR(vFillColor, geometry);
  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);
  DECKGL_FILTER_COLOR(vLineColor, geometry);

  vAlpha = instanceTimes; //1.0 - abs(instanceTimes - currentTime) / 3600; // the opacity peaks at 1.0 (100%) when pick up time is the current time, and gradually fades out. Each instance is only visible if it was picked up within 1 hour of the current time.
}
`;

// Shaders are the programs that the GPU runs to draw each point. 
// In order to draw some new shapes, we will replace the default shader used by the ScatterplotLayer.
export default class CustomScatterplotLayer extends ScatterplotLayer {
  // http://vis.academy/#/custom-layers/3-custom-shader
  // Layer.getShaders is the API that exposes the shaders that the layer uses. 
  // We can find the default fragment shader by calling super.getShaders().fs
  getShaders() {
    // console.log(super.getShaders().fs);
    // console.log(super.getShaders().vs);
    return {
      // replace the default fragment shader
      ...super.getShaders(),
      // make each icon at pickup spot an arrow pointing to the direction that the rider is going.
      fs: customFragmentShader,
      // Attributes are accessible from the vertex shader, which is run to calculate the positions of vertices
      vs: customVertexShader
    }
  }

  // http://vis.academy/#/custom-layers/4-custom-attribute
  // an arrow pointing to the direction that the rider is going
  initializeState() {
    super.initializeState();
    
    // adds a new instanced attribute instanceAngles, that is automatically filled with the accessor Layer.prop.getAngle. The attributeManager is automatically created for every layer.
    this.state.attributeManager.addInstanced({
      instanceAngles: {size: 1, accessor: 'getAngle'},
      // http://vis.academy/#/custom-layers/5-custom-uniform
      instanceTimes: {size: 1, accessor: 'getTime'}
    });
  }

  // // override the updateState lifecycle mothod and send a new uniform currentTime to the layer's model
  // updateState({props}) {
  //   super.updateState(...arguments);

  //   this.state.model.setUniforms({
  //     currentTime: props.currentTime
  //   });
  // }
}