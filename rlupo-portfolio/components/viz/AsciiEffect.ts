// components/viz/AsciiEffect.ts
// Ported from references/webgl-ascii-hero/components/ascii-effect.tsx
// three@0.185.1 @react-three/fiber@9.6.1 postprocessing@6.39.2
import {
  CanvasTexture, ClampToEdgeWrapping, LinearFilter,
  Uniform, Vector2, Vector3, WebGLRenderer, WebGLRenderTarget,
} from 'three';
import { Effect, BlendFunction } from 'postprocessing';

export const TERMINAL_SYMBOLS: string[] = [
  '.', ':', '-', '=', '+', '*', '#', '%', '@', '0', 'O', 'N', 'M', 'W', 'B', 'X',
];

export interface GlyphAtlasParams { width: number; height: number; count: number; }

/** Pure helper — atlas dimension math, no DOM. */
export function buildGlyphAtlasParams(chars: string[], size: number): GlyphAtlasParams {
  return { width: size * chars.length, height: size, count: chars.length };
}

/** DOM-dependent. Returns null in Node/jsdom (ctx is null). */
export function createGlyphTexture(
  characters: string[],
  size = 64,
  font = '62px monospace',
): CanvasTexture | null {
  if (characters.length === 0) return null;
  const canvas = document.createElement('canvas');
  canvas.width = size * characters.length;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < characters.length; i++) {
    ctx.fillText(characters[i], i * size + size / 2, size / 2);
  }
  const tex = new CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  tex.wrapS = ClampToEdgeWrapping;
  tex.wrapT = ClampToEdgeWrapping;
  return tex;
}

// Fragment shader identical to reference except:
//   • transitionVelocity uniform added: drives effectiveWaveAmp and effectiveGlitch
//   • asciiStyle parameter removed (standard mode only; simplifies uniform surface)
const fragmentShader = `
uniform float cellSize;
uniform bool invert;
uniform bool colorMode;
uniform float time;
uniform vec2 resolution;
uniform vec2 mousePos;
uniform float scanlineIntensity;
uniform float scanlineCount;
uniform float jitterIntensity;
uniform float jitterSpeed;
uniform bool mouseGlowEnabled;
uniform float mouseGlowRadius;
uniform float mouseGlowIntensity;
uniform float vignetteIntensity;
uniform float vignetteRadius;
uniform float curvature;
uniform float aberrationStrength;
uniform float noiseIntensity;
uniform float noiseScale;
uniform float noiseSpeed;
uniform float waveAmplitude;
uniform float waveFrequency;
uniform float waveSpeed;
uniform float glitchIntensity;
uniform float glitchFrequency;
uniform float brightnessAdjust;
uniform float contrastAdjust;
uniform sampler2D glyphAtlas;
uniform float glyphTiles;
uniform bool useGlyphAtlas;
uniform bool volumeShading;
uniform bool useTintColor;
uniform vec3 tintColor;
uniform float transitionVelocity;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
float noise(vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st);
  float a = random(i); float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float getChar(float brightness, vec2 p) {
  if (brightness < 0.01) return 0.0;
  vec2 grid = floor(p * 4.0);
  float dotP   = (grid.x == 1.0 && grid.y == 1.0) ? 1.0 : 0.0;
  float block2 = ((grid.x == 1.0 || grid.x == 2.0) && (grid.y == 1.0 || grid.y == 2.0)) ? 1.0 : 0.0;
  float barH   = (grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.0;
  float barH2  = (grid.y == 0.0 || grid.y == 3.0) ? 1.0 : (grid.y == 1.0 || grid.y == 2.0) ? 0.5 : 0.0;
  float edge   = (grid.x == 0.0 || grid.x == 2.0 || grid.y == 0.0 || grid.y == 2.0) ? 1.0 : 0.3;
  float t0 = 1.0 - smoothstep(0.0, 0.15, brightness);
  float t1 = smoothstep(0.08, 0.22, brightness) * (1.0 - smoothstep(0.22, 0.35, brightness));
  float t2 = smoothstep(0.20, 0.38, brightness) * (1.0 - smoothstep(0.38, 0.50, brightness));
  float t3 = smoothstep(0.35, 0.52, brightness) * (1.0 - smoothstep(0.52, 0.65, brightness));
  float t4 = smoothstep(0.50, 0.70, brightness) * (1.0 - smoothstep(0.70, 0.82, brightness));
  float t5 = smoothstep(0.68, 1.0, brightness);
  return clamp(dotP*t0*0.5 + block2*t1 + barH*t2 + barH2*t3 + edge*t4 + t5, 0.0, 1.0);
}
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 workUV = uv;
  float tv = transitionVelocity;
  float effectiveWaveAmp = waveAmplitude + tv * 0.008;
  float effectiveGlitch  = glitchIntensity + tv * 0.12;

  if (curvature > 0.0) {
    vec2 c2 = workUV * 2.0 - 1.0;
    c2 *= 1.0 + curvature * dot(c2, c2);
    workUV = c2 * 0.5 + 0.5;
    if (workUV.x < 0.0 || workUV.x > 1.0 || workUV.y < 0.0 || workUV.y > 1.0) {
      outputColor = vec4(0.0); return;
    }
  }
  if (effectiveWaveAmp > 0.0) {
    workUV.x += sin(workUV.y * waveFrequency + time * waveSpeed) * effectiveWaveAmp;
    workUV.y += cos(workUV.x * waveFrequency + time * waveSpeed) * effectiveWaveAmp;
  }
  vec4 sampledColor;
  if (aberrationStrength > 0.0) {
    float off = aberrationStrength;
    sampledColor = vec4(
      texture(inputBuffer, workUV + vec2(off, 0.0)).r,
      texture(inputBuffer, workUV).g,
      texture(inputBuffer, workUV - vec2(off, 0.0)).b, 1.0);
  } else {
    sampledColor = texture(inputBuffer, workUV);
  }
  sampledColor.rgb = (sampledColor.rgb - 0.5) * contrastAdjust + 0.5 + brightnessAdjust;
  if (noiseIntensity > 0.0)
    sampledColor.rgb += (noise(workUV * noiseScale + time * noiseSpeed) - 0.5) * noiseIntensity;

  vec2 cellCount = resolution / cellSize;
  vec2 cellCoord = floor(uv * cellCount);
  if (jitterIntensity > 0.0) {
    float jt = time * jitterSpeed;
    cellCoord += vec2(
      (random(vec2(cellCoord.y, floor(jt))) - 0.5) * jitterIntensity * 2.0,
      (random(vec2(cellCoord.x, floor(jt + 1000.0))) - 0.5) * jitterIntensity * 2.0
    );
  }
  if (effectiveGlitch > 0.0 && glitchFrequency > 0.0) {
    float gt = floor(time * glitchFrequency);
    if (random(vec2(gt, cellCoord.y)) < effectiveGlitch)
      cellCoord.x += (random(vec2(gt + 1.0, cellCoord.y)) - 0.5) * 20.0;
  }

  vec2 cellUV = (cellCoord + 0.5) / cellCount;
  vec4 cellColor = texture(inputBuffer, cellUV);
  float rawLum = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));
  cellColor.rgb = (cellColor.rgb - 0.5) * contrastAdjust + 0.5 + brightnessAdjust;
  float brightness = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));
  if (invert) brightness = 1.0 - brightness;
  float bfg = volumeShading ? clamp((brightness - 0.5) * 1.6 + 0.5, 0.0, 1.0) : brightness;
  float emptyT = volumeShading ? 0.04 : 0.14;
  vec2 localUV = fract(uv * cellCount);
  float charValue;
  if (rawLum < 0.06 || brightness < emptyT) {
    charValue = 0.0;
  } else if (useGlyphAtlas && glyphTiles > 0.0) {
    float tile = clamp(floor(bfg * glyphTiles), 0.0, glyphTiles - 1.0);
    float inset = 0.02;
    vec2 inner = vec2(inset + localUV.x * (1.0 - 2.0 * inset), inset + localUV.y * (1.0 - 2.0 * inset));
    charValue = texture(glyphAtlas, vec2((tile + inner.x) / glyphTiles, inner.y)).r;
  } else {
    charValue = getChar(bfg, localUV);
  }
  vec3 finalColor = colorMode
    ? (useTintColor ? tintColor * charValue : cellColor.rgb * charValue)
    : vec3(brightness * charValue);
  if (mouseGlowEnabled) {
    float dist = length(uv * resolution - mousePos);
    finalColor += exp(-dist / mouseGlowRadius) * mouseGlowIntensity;
  }
  if (scanlineIntensity > 0.0)
    finalColor *= 1.0 - (sin(uv.y * scanlineCount * 3.14159) * 0.5 + 0.5) * scanlineIntensity;
  if (vignetteIntensity > 0.0) {
    vec2 cv = uv * 2.0 - 1.0;
    finalColor *= mix(1.0, 1.0 - dot(cv, cv) / vignetteRadius, vignetteIntensity);
  }
  outputColor = vec4(finalColor, cellColor.a);
}
`;

export interface AsciiEffectOptions {
  cellSize?: number;
  invert?: boolean;
  color?: boolean;
  mousePos?: Vector2;
  resolution?: Vector2;
  postfx?: Record<string, number | boolean>;
  glyphAtlas?: CanvasTexture | null;
  glyphTiles?: number;
  volumeShading?: boolean;
  tintColor?: Vector3 | null;
}

export class AsciiEffectImpl extends Effect {
  private _time = 0;
  private _mousePos: Vector2;
  private _resolution: Vector2;

  constructor(opts: AsciiEffectOptions = {}) {
    const {
      cellSize = 9, invert = true, color = true,
      mousePos = new Vector2(0, 0),
      resolution = new Vector2(1920, 1080),
      postfx = {},
      glyphAtlas = null, glyphTiles = 0,
      volumeShading = false, tintColor = null,
    } = opts;

    super('AsciiEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform<unknown>>([
        ['cellSize',           new Uniform(cellSize)],
        ['invert',             new Uniform(invert)],
        ['colorMode',          new Uniform(color)],
        ['time',               new Uniform(0)],
        ['resolution',         new Uniform(resolution)],
        ['mousePos',           new Uniform(mousePos)],
        ['glyphAtlas',         new Uniform(glyphAtlas)],
        ['glyphTiles',         new Uniform(glyphTiles)],
        ['useGlyphAtlas',      new Uniform(!!glyphAtlas)],
        ['volumeShading',      new Uniform(volumeShading)],
        ['useTintColor',       new Uniform(!!tintColor)],
        ['tintColor',          new Uniform(tintColor ?? new Vector3(1, 1, 1))],
        ['transitionVelocity', new Uniform(0)],
        ['scanlineIntensity',  new Uniform(postfx.scanlineIntensity ?? 0.08)],
        ['scanlineCount',      new Uniform(postfx.scanlineCount ?? 200)],
        ['jitterIntensity',    new Uniform(postfx.jitterIntensity ?? 0)],
        ['jitterSpeed',        new Uniform(postfx.jitterSpeed ?? 1)],
        ['mouseGlowEnabled',   new Uniform(postfx.mouseGlowEnabled ?? true)],
        ['mouseGlowRadius',    new Uniform(postfx.mouseGlowRadius ?? 200)],
        ['mouseGlowIntensity', new Uniform(postfx.mouseGlowIntensity ?? 0.8)],
        ['vignetteIntensity',  new Uniform(postfx.vignetteIntensity ?? 0.25)],
        ['vignetteRadius',     new Uniform(postfx.vignetteRadius ?? 0.9)],
        ['curvature',          new Uniform(postfx.curvature ?? 0)],
        ['aberrationStrength', new Uniform(postfx.aberrationStrength ?? 0)],
        ['noiseIntensity',     new Uniform(postfx.noiseIntensity ?? 0)],
        ['noiseScale',         new Uniform(postfx.noiseScale ?? 1)],
        ['noiseSpeed',         new Uniform(postfx.noiseSpeed ?? 1)],
        ['waveAmplitude',      new Uniform(postfx.waveAmplitude ?? 0)],
        ['waveFrequency',      new Uniform(postfx.waveFrequency ?? 10)],
        ['waveSpeed',          new Uniform(postfx.waveSpeed ?? 1)],
        ['glitchIntensity',    new Uniform(postfx.glitchIntensity ?? 0)],
        ['glitchFrequency',    new Uniform(postfx.glitchFrequency ?? 2)],
        ['brightnessAdjust',   new Uniform(postfx.brightnessAdjust ?? 0)],
        ['contrastAdjust',     new Uniform(postfx.contrastAdjust ?? 1.6)],
      ]),
    });

    this._mousePos = mousePos;
    this._resolution = resolution;
  }

  setMousePos(x: number, y: number): void {
    this._mousePos.set(x, y);
    this.uniforms.get('mousePos')!.value = this._mousePos;
  }

  setResolution(w: number, h: number): void {
    this._resolution.set(w, h);
    this.uniforms.get('resolution')!.value = this._resolution;
  }

  setTransitionVelocity(v: number): void {
    this.uniforms.get('transitionVelocity')!.value = v;
  }

  override update(
    _renderer: WebGLRenderer,
    _inputBuffer: WebGLRenderTarget,
    deltaTime = 0,
  ): void {
    const ctx = _renderer.getContext() as WebGLRenderingContext;
    if ((ctx as WebGLRenderingContext).isContextLost?.()) return;
    this._time += deltaTime;
    this.uniforms.get('time')!.value = this._time;
  }
}
