// components/viz/scenes.ts
import { VizParams } from '../../types';

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
  return {
    archetype: 'wavefield', seed: p.seed, density: p.density, speed: p.speed, tint: p.tint,
    instanceCount: 1,
    geometryType: 'plane',
    animationAmplitude: 0.4 * p.speed,
    spacing: 0,
    planeSegments: Math.max(10, Math.round(40 * p.density)),
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
    instanceCount: Math.max(1, Math.round(3 * p.density)),
    geometryType: 'octahedron',
    animationAmplitude: 0.5 * p.speed,
    spacing: 2.5,
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
