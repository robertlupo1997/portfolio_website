// components/viz/VizCanvas.tsx
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import {
  BoxGeometry, BufferAttribute, Color, DoubleSide, InstancedMesh, MeshStandardMaterial,
  Object3D, OctahedronGeometry, PlaneGeometry, SphereGeometry,
  Vector3 as ThreeVector3,
} from 'three';
import { VizParams } from '../../types';
import { buildSceneSpec, SceneSpec } from './scenes';
import { AsciiEffectImpl, createGlyphTexture, TERMINAL_SYMBOLS } from './AsciiEffect';

// ---------------------------------------------------------------------------
// Inner: syncs transitionVelocity ref → AsciiEffectImpl uniform each frame
// ---------------------------------------------------------------------------
function VelocityBridge({
  effectRef,
  velocityRef,
}: {
  effectRef: React.RefObject<AsciiEffectImpl | null>;
  velocityRef: React.RefObject<number>;
}) {
  useFrame(() => {
    effectRef.current?.setTransitionVelocity(velocityRef.current);
  });
  return null;
}

// ---------------------------------------------------------------------------
// Inner: renders the 3-frame deferred EffectComposer + ASCII effect
// ---------------------------------------------------------------------------
function ComposerMount({
  effectRef,
  tint,
  waveAmp,
  waveFreq,
  wavePhase,
}: {
  effectRef: React.RefObject<AsciiEffectImpl | null>;
  tint: string;
  waveAmp?: number;
  waveFreq?: number;
  wavePhase?: number;
}) {
  const { gl } = useThree();
  const [ready, setReady] = useState(false);
  const frameCount = useRef(0);

  useFrame(() => {
    if (!ready) frameCount.current++;
    if (frameCount.current >= 3 && !ready) {
      setTimeout(() => {
        try {
          const ctx = gl.getContext() as WebGLRenderingContext;
          if (!ctx.isContextLost?.()) setReady(true);
        } catch (_) {}
      }, 100);
    }
  });

  const glyphAtlas = useMemo(() => createGlyphTexture(TERMINAL_SYMBOLS), []);
  const tintVec = useMemo(() => {
    const c = new Color(tint);
    return new ThreeVector3(c.r, c.g, c.b);
  }, [tint]);

  const effect = useMemo(
    () =>
      new AsciiEffectImpl({
        cellSize: 9, invert: true, color: true,
        glyphAtlas, glyphTiles: TERMINAL_SYMBOLS.length,
        volumeShading: true,
        tintColor: tintVec,
        postfx: {
          contrastAdjust: 1.6, scanlineIntensity: 0.06, vignetteIntensity: 0.2,
          waveAmplitude: waveAmp ?? 0,
          waveFrequency: waveFreq ?? 10,
          wavePhase: wavePhase ?? 0,
        },
      }),
    [tintVec, glyphAtlas, waveAmp, waveFreq, wavePhase],
  );

  useEffect(() => {
    effectRef.current = effect;
    return () => { effectRef.current = null; };
  }, [effect, effectRef]);

  if (!ready) return null;
  return (
    <EffectComposer>
      <primitive object={effect} dispose={null} />
    </EffectComposer>
  );
}

// ---------------------------------------------------------------------------
// Inner: builds and animates the scene geometry from a SceneSpec
// ---------------------------------------------------------------------------
function VizScene({ spec }: { spec: SceneSpec }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const initialPositions = useRef<Float32Array | null>(null);

  const geometry = useMemo(() => {
    switch (spec.geometryType) {
      case 'box':         return new BoxGeometry(0.22, 0.22, 0.22); // enlarged: 0.12 was sub-cell at 9px
      case 'sphere':      return new SphereGeometry(0.06, 4, 4);
      case 'plane':       return new PlaneGeometry(8, 8, spec.planeSegments ?? 40, spec.planeSegments ?? 40);
      // detail=1 → 32 faces, recognizable octahedral form, ~4× the cell coverage of detail=0
      case 'octahedron':  return new OctahedronGeometry(1.5, 1);
    }
  }, [spec.geometryType, spec.planeSegments, spec.density]);

  const material = useMemo(() => {
    // Emissive boosts shadow-face rawLum above the 0.06 glyph floor.
    // With ambient=0.3 + dir=0.6, emissive headroom before rawLum hits 0.79:
    //   #A6A77E (L=0.636): max emissive ≈ 0.34 → use 0.1 (wireframe wants face contrast)
    //   #E85D3A (L=0.512): max emissive ≈ 0.64 → use 0.25
    //   #5A9090 (L=0.502): max emissive ≈ 0.67 → use 0.25
    const emissiveIntensity = spec.archetype === 'wireframe' ? 0.1
      : spec.archetype === 'wavefield'    ? 0.15
      : 0.25; // lattice + particleflow
    return new MeshStandardMaterial({
      color: spec.tint,
      emissive: new Color(spec.tint),
      emissiveIntensity,
      roughness: 0.85,
      metalness: 0,
      side: spec.archetype === 'wavefield' ? DoubleSide : undefined,
    });
  }, [spec.tint, spec.archetype]);

  useEffect(() => {
    return () => {
      geometry?.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Seed-deterministic initial positions
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || spec.archetype === 'wavefield') return;
    const rng = (() => {
      let s = spec.seed;
      return () => {
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })();
    const buf = new Float32Array(spec.instanceCount * 3);
    // Wireframe: 0 spread → single centered instance. Lattice: cap at 4.5 so
    // instances stay within the 7×4.66 unit viewport (density=1 gave spread=8.4 → off-screen).
    const spread = spec.archetype === 'particleflow' ? 5
      : spec.archetype === 'wireframe'    ? 0
      : Math.min(spec.spacing * (spec.gridSize ?? 4), 4.5);
    for (let i = 0; i < spec.instanceCount; i++) {
      buf[i * 3]     = (rng() - 0.5) * spread;
      buf[i * 3 + 1] = (rng() - 0.5) * spread;
      buf[i * 3 + 2] = (rng() - 0.5) * (spread * 0.5);
      dummy.position.set(buf[i * 3], buf[i * 3 + 1], buf[i * 3 + 2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    initialPositions.current = buf;
    mesh.instanceMatrix.needsUpdate = true;
  }, [spec, dummy]);

  useFrame((_, _delta) => {
    const mesh = meshRef.current;
    const t = performance.now() * 0.001 * spec.speed;

    // Wavefield: displace plane vertices in Z each frame so normals vary and
    // directional lighting creates visible wave-terrain bands.
    if (spec.archetype === 'wavefield') {
      const geo = mesh?.geometry;
      if (!geo) return;
      const pos = geo.attributes.position as BufferAttribute;
      const freq = spec.waveFreq ?? 1.0;
      const amp  = (spec.waveAmp ?? 1.2) * 0.45;
      const phase = spec.wavePhase ?? 0;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        pos.setZ(i,
          Math.sin(x * freq + t + phase) * amp +
          Math.sin(y * freq * 0.7 + t * 1.3 + phase * 0.5) * amp * 0.6,
        );
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      return;
    }

    const buf = initialPositions.current;
    if (!mesh || !buf) return;
    for (let i = 0; i < spec.instanceCount; i++) {
      dummy.position.set(buf[i * 3], buf[i * 3 + 1], buf[i * 3 + 2]);
      dummy.position.y += Math.sin(t + i * 0.31) * spec.animationAmplitude;
      if (spec.archetype === 'wireframe') dummy.rotation.y = t * 0.3 + i * 1.2;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      {/* ambient=0.3 + dir=0.6 keeps scene rawLum in [0.15,0.75] across all tints
          under invert=true (glyph zone [0.06,0.79]). Higher ambient blew out
          lit faces → bfg→0 → charValue≈0.05 → near-invisible glyphs. */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 4, 5]} intensity={0.6} />
      <directionalLight position={[-3, -1, 3]} intensity={0.15} />
      <instancedMesh ref={meshRef} args={[geometry, material, spec.instanceCount]} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Public VizCanvas — mounts outside .carousel-track, position: absolute
// ---------------------------------------------------------------------------
export interface VizCanvasProps {
  params: VizParams | null;
  loaded: boolean;
  velocityRef: React.RefObject<number>;
  onFallback: () => void;
}

export const VizCanvas: React.FC<VizCanvasProps> = ({
  params, loaded, velocityRef, onFallback,
}) => {
  const effectRef = useRef<AsciiEffectImpl | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const onContextLostRef = useRef<((e: Event) => void) | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !effectRef.current) return;
    effectRef.current.setMousePos(e.clientX - rect.left, rect.height - (e.clientY - rect.top));
  }, []);

  const handleResize = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !effectRef.current) return;
    effectRef.current.setResolution(rect.width, rect.height);
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [handleResize]);

  const spec = useMemo(() => (params ? buildSceneSpec(params) : null), [params]);

  useEffect(() => {
    return () => {
      if (canvasElRef.current && onContextLostRef.current) {
        canvasElRef.current.removeEventListener('webglcontextlost', onContextLostRef.current);
      }
    };
  }, []);

  if (!loaded || !params || !spec) return null;

  return (
    <div
      ref={containerRef}
      data-testid="viz-canvas"
      onMouseMove={handleMouseMove}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const onLost = (e: Event) => { e.preventDefault(); onFallback(); };
          canvasElRef.current = canvas;
          onContextLostRef.current = onLost;
          canvas.addEventListener('webglcontextlost', onLost);
        }}
      >
        <VizScene spec={spec} />
        <ComposerMount effectRef={effectRef} tint={params.tint}
          waveAmp={params.archetype === 'wavefield' ? 0 : spec.waveAmp}
          waveFreq={spec.waveFreq} wavePhase={spec.wavePhase} />
        <VelocityBridge effectRef={effectRef} velocityRef={velocityRef} />
      </Canvas>
    </div>
  );
};

export default VizCanvas;
