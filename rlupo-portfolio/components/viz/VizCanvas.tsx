// components/viz/VizCanvas.tsx
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import {
  BoxGeometry, BufferAttribute, Color, InstancedMesh, MeshBasicMaterial, MeshStandardMaterial,
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
          contrastAdjust: 1.6, brightnessAdjust: -0.15,
          scanlineIntensity: 0.06, vignetteIntensity: 0.2,
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
  const { camera } = useThree();
  const tintColor = useMemo(() => new Color(spec.tint), [spec.tint]);

  // Per-archetype camera: wavefield needs oblique view to show wave relief as terrain.
  useEffect(() => {
    if (spec.archetype === 'wavefield') {
      camera.position.set(0, -2.2, 5.5);
      camera.lookAt(0, 0.4, 0);
    } else {
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
    }
  }, [spec.archetype, camera]);

  const geometry = useMemo(() => {
    switch (spec.geometryType) {
      case 'box':         return new BoxGeometry(0.22, 0.22, 0.22);
      case 'sphere':      return new SphereGeometry(0.18, 5, 5); // 0.06→0.18: enough cell coverage for mean≥12
      case 'plane': {
        const g = new PlaneGeometry(8, 8, spec.planeSegments ?? 40, spec.planeSegments ?? 40);
        // Pre-allocate color attribute so wavefield vertexColors can write each frame.
        const colorBuf = new Float32Array(g.attributes.position.count * 3);
        g.setAttribute('color', new BufferAttribute(colorBuf, 3));
        return g;
      }
      // detail=1 → 32 faces, recognizable octahedral form, ~4× the cell coverage of detail=0
      case 'octahedron':  return new OctahedronGeometry(1.5, 1);
    }
  }, [spec.geometryType, spec.planeSegments, spec.density]);

  const material = useMemo(() => {
    // Wavefield uses vertexColors to encode wave height directly into luminance,
    // bypassing normal/light (which only work reliably for face-on camera + non-raking lights).
    if (spec.archetype === 'wavefield') {
      return new MeshBasicMaterial({ vertexColors: true });
    }
    // bfg = 1.78 − 2.56·rawLum (invert=true). Good glyph range: rawLum ∈ [0.10, 0.65].
    // Lower emissive → lower rawLum → heavier glyphs (bfg closer to 1). Wireframe uses ambient
    // contrast for face shading; lattice/particleflow need emissive to lift dark tints (orange
    // luma=0.30) above the 0.06 rawLum gate.
    // wireframe=0.35: ambient+emissive baseline keeps dark faces above glyph floor while
    // side light creates face contrast. particleflow=0.55: large sphere coverage needs
    // high emissive so dark-hemisphere cells reach heavy-glyph rawLum with brightnessAdjust=-0.15.
    const emissiveIntensity = spec.archetype === 'wireframe' ? 0.35
      : spec.archetype === 'lattice'      ? 0.35
      : 0.55; // particleflow
    return new MeshStandardMaterial({
      color: spec.tint,
      emissive: new Color(spec.tint),
      emissiveIntensity,
      roughness: 0.85,
      metalness: 0,
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

    // Wavefield: displace plane vertices in Z AND encode height into vertex color.
    // MeshBasicMaterial reads vertexColors directly — no normal/light dependency.
    // With brightnessAdjust=-0.15: empty threshold rawLum=0.789. Height range [0.12, 1.50]
    // gives: troughs→rawLum≈luma*0.12 ('X', heavy) and crests→rawLum≈luma*1.50 (sparse or empty).
    if (spec.archetype === 'wavefield') {
      const geo = mesh?.geometry;
      if (!geo) return;
      const pos   = geo.attributes.position as BufferAttribute;
      const color = geo.attributes.color    as BufferAttribute | undefined;
      const freq  = spec.waveFreq ?? 1.0;
      const amp   = (spec.waveAmp ?? 1.2) * 0.55; // ×0.55 → max ~1.2u displacement
      const phase = spec.wavePhase ?? 0;
      const maxZ  = amp * 1.6; // approximate peak amplitude of combined waves
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = Math.sin(x * freq + t + phase) * amp
                + Math.sin(y * freq * 0.7 + t * 1.3 + phase * 0.5) * amp * 0.6;
        pos.setZ(i, z);
        if (color) {
          // heightFactor 0=trough→heavy glyph, 1=crest→sparse/empty. Normalized to theoretical max.
          const hf = Math.min(1, Math.max(0, (z + maxZ) / (2 * maxZ)));
          const lum = 0.12 + 1.38 * hf; // [0.12, 1.50]
          color.setXYZ(i, tintColor.r * lum, tintColor.g * lum, tintColor.b * lum);
        }
      }
      pos.needsUpdate = true;
      if (color) color.needsUpdate = true;
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
      {/* Wireframe: horizontal side light creates face contrast without over-lighting
          olive (luma=0.636), which would push lit faces above rawLum=0.789 → empty cells.
          Others: oblique key [4,2,1] avoids full camera-alignment, creating face shading.
          With brightnessAdjust=-0.15: effective empty threshold rawLum=0.789 (was 0.695). */}
      {spec.archetype === 'wireframe' ? (
        <>
          <ambientLight intensity={0.30} />
          <directionalLight position={[5, 1, 0]} intensity={0.30} />
        </>
      ) : (
        <>
          <ambientLight intensity={0.28} />
          <directionalLight position={[4, 2, 1]} intensity={0.85} />
          <directionalLight position={[-3, -1, 3]} intensity={0.12} />
        </>
      )}
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
