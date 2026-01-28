// Simple background shader - just displays the text texture
export const backgroundFrag = `
precision highp float;

varying vec2 vUv;

uniform sampler2D textTexture;
uniform vec3 bgColor;
uniform vec3 textColor;

void main() {
    float text = texture2D(textTexture, vUv).r;
    vec3 color = mix(bgColor, textColor, text);
    gl_FragColor = vec4(color, 1.0);
}
`;
