// Semi-Lagrangian advection - transport fields along velocity
import { utilGlsl } from './util.glsl';

export const advectionFrag = `
precision highp float;

varying vec2 vUv;

uniform sampler2D inputMap;
uniform sampler2D velocityMap;

uniform vec2 uSize;

${utilGlsl}

void main() {
    vec2 delta = 1.0 / uSize;

    vec2 velocity = unpackField(texture2D(velocityMap, vUv));

    vec2 displacement = -velocity;
    float factor = 0.9;
    vec4 displaced = texture2D(inputMap, vUv + displacement * delta * 0.1);
    gl_FragColor = texture2D(inputMap, vUv) * (1.0 - factor) + displaced * factor;
}
`;
