// Simple texture copy shader
import { utilGlsl } from './util.glsl';

export const displayTextureFrag = `
precision highp float;

uniform sampler2D textureMap;
uniform bool showAlpha;

varying vec2 vUv;

${utilGlsl}

void main() {
    gl_FragColor = texture2D(textureMap, vUv);
    if(showAlpha) {
        gl_FragColor.rgb = gl_FragColor.aaa;
    }
}
`;
