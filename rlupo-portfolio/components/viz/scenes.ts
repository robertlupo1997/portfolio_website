// components/viz/scenes.ts
import { VizParams } from '../../types';
import { mulberry32 } from '../../lib/viz/params';

export type GeometryType = 'box' | 'sphere' | 'plane' | 'octahedron';

export interface SceneSpec {
  archetype: VizParams['archetype'];
  seed: number;
  density: number;
  speed: number;
  tint: string;
  instanceCount: number;
  geometryType: GeometryType;
  animationAmplitude: number;
  spacing: number;
  gridSize?: number;       // lattice: dimension of n×n×n grid
  planeSegments?: number;  // wavefield: subdivision count
  waveFreq?: number;       // wavefield: seeded frequency (0.8–1.6)
  waveAmp?: number;        // wavefield: seeded amplitude (0.6–1.2)
  wavePhase?: number;      // wavefield: seeded phase offset (0–2π)
}

export function buildLatticeSpec(p: VizParams): SceneSpec {
  const dim = Math.max(2, Math.round(6 * Math.sqrt(p.density)));
  return {
    archetype: 'lattice', seed: p.seed, density: p.density, speed: p.speed, tint: p.tint,
    instanceCount: dim * dim * dim,
    geometryType: 'box',
    animationAmplitude: 0.15 * p.speed,
    spacing: 1.4 / p.density,
    gridSize: dim,
  };
}

export function buildWavefieldSpec(p: VizParams): SceneSpec {
  const rng = mulberry32(p.seed);
  const waveFreq  = 0.8 + rng() * 0.8;          // 0.8–1.6
  const waveAmp   = 1.2 + rng() * 1.0;           // 1.2–2.2 (raised for visible vertex displacement)
  const wavePhase = rng() * 2 * Math.PI;         // 0–2π
  return {
    archetype: 'wavefield', seed: p.seed, density: p.density, speed: p.speed, tint: p.tint,
    instanceCount: 1,
    geometryType: 'plane',
    animationAmplitude: 0.4 * p.speed,
    spacing: 0,
    planeSegments: Math.max(10, Math.round(40 * p.density)),
    waveFreq, waveAmp, wavePhase,
  };
}

export function buildParticleflowSpec(p: VizParams): SceneSpec {
  return {
    archetype: 'particleflow', seed: p.seed, density: p.density, speed: p.speed, tint: p.tint,
    instanceCount: Math.max(50, Math.round(800 * p.density)),
    geometryType: 'sphere',
    animationAmplitude: 0.02 * p.speed,
    spacing: 1.0,
  };
}

export function buildWireframeSpec(p: VizParams): SceneSpec {
  return {
    archetype: 'wireframe', seed: p.seed, density: p.density, speed: p.speed, tint: p.tint,
    instanceCount: 1,   // single centered octahedron; spread=0 in VizCanvas
    geometryType: 'octahedron',
    animationAmplitude: 0.5 * p.speed,
    spacing: 0,
  };
}

const BUILDERS: Record<VizParams['archetype'], (p: VizParams) => SceneSpec> = {
  lattice:      buildLatticeSpec,
  wavefield:    buildWavefieldSpec,
  particleflow: buildParticleflowSpec,
  wireframe:    buildWireframeSpec,
};

export function buildSceneSpec(params: VizParams): SceneSpec {
  return BUILDERS[params.archetype](params);
}
