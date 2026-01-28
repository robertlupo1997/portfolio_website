// Apply flowmap velocity to fluid simulation
import { utilGlsl } from './util.glsl';

export const fluidVelocityFrag = `
precision highp float;

varying vec2 vUv;

uniform sampler2D pressureMap;
uniform sampler2D velocityMap;
uniform sampler2D flowMap;

uniform vec2 uSize;

${utilGlsl}

void main() {
    vec2 delta = 2.0 / uSize;

    vec2 velocity = unpackField(texture2D(velocityMap, vUv));
    vec2 velocity_left = unpackField(texture2D(velocityMap, vUv + delta * vec2(-1, 0)));
    vec2 velocity_right = unpackField(texture2D(velocityMap, vUv + delta * vec2(1, 0)));
    vec2 velocity_bottom = unpackField(texture2D(velocityMap, vUv + delta * vec2(0, -1)));
    vec2 velocity_top = unpackField(texture2D(velocityMap, vUv + delta * vec2(0, 1)));

    vec2 flow = unpackField(texture2D(flowMap, vUv));

    float center = texture2D(pressureMap, vUv).a;
    float right = texture2D(pressureMap, vUv + delta * vec2(1, 0)).a;
    float left = texture2D(pressureMap, vUv + delta * vec2(-1, 0)).a;
    float top = texture2D(pressureMap, vUv + delta * vec2(0, 1)).a;
    float bottom = texture2D(pressureMap, vUv + delta * vec2(0, -1)).a;
    vec2 gradient = vec2(right - left, top - bottom);

    vec2 diffusion = (velocity_left + velocity_right + velocity_bottom + velocity_top) / 4.0 - velocity;

    vec2 acceleration = -gradient * 0.01;

    // diffusion
    velocity = velocity * 0.9995 + acceleration / (center + 0.001) + diffusion + flow * 0.1;

    // clamp velocity
    float magnitude = length(velocity);
    velocity = velocity / max(1e-5, magnitude) * min(10.0, magnitude);

    gl_FragColor = packField(velocity);
}
`;
