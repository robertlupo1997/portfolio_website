// components/viz/VizCanvas.tsx
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import {
  BoxGeometry, Color, InstancedMesh, MeshStandardMaterial,
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
}: {
  effectRef: React.RefObject<AsciiEffectImpl | null>;
  tint: string;
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
        postfx: { contrastAdjust: 1.6, scanlineIntensity: 0.06, vignetteIntensity: 0.2 },
      }),
    [tintVec, glyphAtlas],
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
      case 'box':         return new BoxGeometry(0.12, 0.12, 0.12);
      case 'sphere':      return new SphereGeometry(0.06, 4, 4);
      case 'plane':       return new PlaneGeometry(8, 8, spec.planeSegments ?? 40, spec.planeSegments ?? 40);
      case 'octahedron':  return new OctahedronGeometry(0.5 + spec.density * 0.2);
    }
  }, [spec.geometryType, spec.planeSegments, spec.density]);

  const material = useMemo(
    () => new MeshStandardMaterial({ color: spec.tint, roughness: 0.2, metalness: 0, wireframe: spec.archetype === 'wireframe' }),
    [spec.tint, spec.archetype],
  );

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
    const spread = spec.archetype === 'particleflow' ? 5 : spec.spacing * (spec.gridSize ?? 4);
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
    const buf = initialPositions.current;
    if (!mesh || !buf || spec.archetype === 'wavefield') return;
    const t = performance.now() * 0.001 * spec.speed;
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
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 4, 5]} intensity={3} />
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
        <ComposerMount effectRef={effectRef} tint={params.tint} />
        <VelocityBridge effectRef={effectRef} velocityRef={velocityRef} />
      </Canvas>
    </div>
  );
};

export default VizCanvas;
