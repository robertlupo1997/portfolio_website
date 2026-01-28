// Utility functions for packing/unpacking values in textures
export const utilGlsl = `
#define PI 3.14159265358979

vec2 packFloat(float v) {
    return vec2(v);
}

float unpackFloat(vec2 v) {
    return v.x;
}

vec4 packField(vec2 v) {
    return v.rgrg;
}

vec2 unpackField(vec4 v) {
    return v.rg;
}
`;
