// Initialize pressure field to zero
import { utilGlsl } from './util.glsl';

export const initializePressureFrag = `
precision highp float;

varying vec2 vUv;

${utilGlsl}

void main() {
    gl_FragColor.rgb = vec3(0.0);
    gl_FragColor.a = 0.0;
}
`;
