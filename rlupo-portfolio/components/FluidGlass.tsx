import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Renderer, Program, Mesh, Geometry, Texture, RenderTarget, Flowmap } from 'ogl';
import {
  defaultVert,
  displayTextureFrag,
  initializePressureFrag,
  fluidVelocityFrag,
  velocityToPressureFrag,
  velocityCorrectionFrag,
  advectionFrag,
  reactionDiffusionFrag,
  backgroundFrag,
  glassShadingFrag,
} from '../shaders/fluidglass';

interface FluidGlassProps {
  text?: string;
  className?: string;
  glassColor?: [number, number, number];
  bgColor?: [number, number, number];
  textColor?: [number, number, number];
}

const FluidGlass: React.FC<FluidGlassProps> = ({
  text = 'TREY LUPO',
  className = '',
  glassColor = [1, 1, 1],
  bgColor = [0.039, 0.039, 0.043],  // Matches --bg-primary: #0A0A0B
  textColor = [0.08, 0.08, 0.08],   // Subtle text color
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Render text to canvas for mask texture
  const renderTextToCanvas = useCallback((width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = Math.min(width / text.length * 1.8, height * 0.7);
    ctx.font = `700 ${Math.round(fontSize)}px Inter, system-ui, sans-serif`;
    ctx.fillText(text, width / 2, height / 2);

    return canvas;
  }, [text]);

  // Initialize OGL renderer and shader pipeline
  const initRenderer = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Create renderer
    const renderer = new Renderer({
      width: rect.width,
      height: rect.height,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    // Fullscreen quad geometry
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const mesh = new Mesh(gl, { geometry });

    // Create shader programs
    const createShaderProgram = (vertex: string, fragment: string, uniforms: Record<string, { value: unknown }>) => {
      return new Program(gl, { vertex, fragment, uniforms });
    };

    // Simulation resolution
    const getSimSize = () => {
      const scale = Math.max(0.4, Math.min(0.8, (1024 / Math.min(renderer.width, renderer.height)) * window.devicePixelRatio));
      const width = Math.round((renderer.width * scale) / 4) * 4;
      const height = Math.round((renderer.height * scale) / 4) * 4;
      return [width, height];
    };

    let [simWidth, simHeight] = getSimSize();

    // Create render targets
    const createTarget = (w: number, h: number) => new RenderTarget(gl, {
      width: w,
      height: h,
      type: gl.HALF_FLOAT,
      format: gl.RGBA,
      internalFormat: gl.RGBA16F,
      depth: false,
    });

    let pressure = createTarget(simWidth, simHeight);
    let pressure_temp = createTarget(simWidth, simHeight);
    let velocity = createTarget(simWidth, simHeight);
    let velocity_temp = createTarget(simWidth, simHeight);
    let background = createTarget(simWidth, simHeight);

    // Flowmap for mouse interaction
    const flowmap = new Flowmap(gl, {
      size: 512,
      falloff: 0.12,
      alpha: 0.8,
      dissipation: 0.7,
    });

    // Text mask texture
    let maskCanvas = renderTextToCanvas(simWidth, simHeight);
    const maskTexture = new Texture(gl, { image: maskCanvas });

    // Shader programs
    const displayTextureProgram = createShaderProgram(defaultVert, displayTextureFrag, {
      textureMap: { value: null },
      showAlpha: { value: false },
    });

    const initializePressureProgram = createShaderProgram(defaultVert, initializePressureFrag, {});

    const fluidVelocityProgram = createShaderProgram(defaultVert, fluidVelocityFrag, {
      pressureMap: { value: null },
      velocityMap: { value: null },
      flowMap: { value: null },
      uSize: { value: [simWidth, simHeight] },
    });

    const velocityToPressureProgram = createShaderProgram(defaultVert, velocityToPressureFrag, {
      velocityMap: { value: null },
      uSize: { value: [simWidth, simHeight] },
    });

    const velocityCorrectionProgram = createShaderProgram(defaultVert, velocityCorrectionFrag, {
      pressureMap: { value: null },
      velocityMap: { value: null },
      uSize: { value: [simWidth, simHeight] },
    });

    const advectionProgram = createShaderProgram(defaultVert, advectionFrag, {
      inputMap: { value: null },
      velocityMap: { value: null },
      uSize: { value: [simWidth, simHeight] },
    });

    const reactionDiffusionProgram = createShaderProgram(defaultVert, reactionDiffusionFrag, {
      pressureMap: { value: null },
      maskTexture: { value: null },
      uSize: { value: [simWidth, simHeight] },
      feed0: { value: 0.048 },   // Lower = less pattern growth
      kill0: { value: 0.058 },  // Lower = patterns die faster
    });

    const backgroundProgram = createShaderProgram(defaultVert, backgroundFrag, {
      textTexture: { value: null },
      bgColor: { value: bgColor },
      textColor: { value: textColor },
    });

    const glassShadingProgram = createShaderProgram(defaultVert, glassShadingFrag, {
      pressureMap: { value: null },
      backgroundMap: { value: null },
      glassColor: { value: glassColor },
      pageBgColor: { value: bgColor },
      shadowFactor: { value: 0.03 },
      brightFactor: { value: 0.015 },  // Halved for subtler bubbles
      edgeFade: { value: 0.35 },
      uSize: { value: [simWidth, simHeight] },
    });

    // Helper to render with a program
    const renderWith = (program: Program, target: RenderTarget | null, uniforms?: Record<string, unknown>) => {
      mesh.program = program;
      if (uniforms) {
        for (const key in uniforms) {
          if (program.uniforms[key]) {
            program.uniforms[key].value = uniforms[key];
          }
        }
      }
      renderer.render({ scene: mesh, target: target ?? undefined });
    };

    // Initialize pressure to zero
    renderWith(initializePressureProgram, pressure);

    // Track if resize is needed
    let needsResize = false;

    // Animation loop
    let alive = true;
    let rafId: number;

    const update = () => {
      if (!alive) return;
      rafId = requestAnimationFrame(update);

      // Update flowmap
      flowmap.update();
      flowmap.velocity.set(0, 0);

      // Handle resize
      if (needsResize) {
        needsResize = false;

        // Save current state
        renderWith(displayTextureProgram, pressure_temp, { textureMap: pressure.texture, showAlpha: false });
        renderWith(displayTextureProgram, velocity_temp, { textureMap: velocity.texture, showAlpha: false });

        [simWidth, simHeight] = getSimSize();

        // Resize all targets
        pressure.setSize(simWidth, simHeight);
        velocity.setSize(simWidth, simHeight);
        background.setSize(simWidth, simHeight);

        // Restore state
        renderWith(displayTextureProgram, pressure, { textureMap: pressure_temp.texture, showAlpha: false });
        renderWith(displayTextureProgram, velocity, { textureMap: velocity_temp.texture, showAlpha: false });

        pressure_temp.setSize(simWidth, simHeight);
        velocity_temp.setSize(simWidth, simHeight);

        // Update mask texture
        maskCanvas = renderTextToCanvas(simWidth, simHeight);
        maskTexture.image = maskCanvas;
        maskTexture.needsUpdate = true;
      }

      const iterations = 10;
      for (let i = 0; i < iterations; i++) {
        // Fluid velocity from flowmap
        renderWith(fluidVelocityProgram, velocity_temp, {
          pressureMap: pressure.texture,
          velocityMap: velocity.texture,
          flowMap: flowmap.mask.read.texture,
          uSize: [simWidth, simHeight],
        });

        // Velocity to pressure (divergence)
        renderWith(velocityToPressureProgram, pressure_temp, {
          velocityMap: velocity_temp.texture,
          uSize: [simWidth, simHeight],
        });

        // Velocity correction
        renderWith(velocityCorrectionProgram, velocity, {
          pressureMap: pressure_temp.texture,
          velocityMap: velocity_temp.texture,
          uSize: [simWidth, simHeight],
        });

        // Advect velocity
        renderWith(advectionProgram, velocity_temp, {
          inputMap: velocity.texture,
          velocityMap: velocity.texture,
          uSize: [simWidth, simHeight],
        });

        // Advect pressure
        renderWith(advectionProgram, pressure_temp, {
          inputMap: pressure.texture,
          velocityMap: velocity.texture,
          uSize: [simWidth, simHeight],
        });

        // Reaction diffusion with text mask
        renderWith(reactionDiffusionProgram, pressure, {
          pressureMap: pressure_temp.texture,
          maskTexture: maskTexture,
          uSize: [simWidth, simHeight],
        });
      }

      // Copy velocity back
      renderWith(displayTextureProgram, velocity, { textureMap: velocity_temp.texture, showAlpha: false });

      // Render background with text
      renderWith(backgroundProgram, background, {
        textTexture: maskTexture,
      });

      // Final glass shading
      renderWith(glassShadingProgram, null, {
        pressureMap: pressure.texture,
        backgroundMap: background.texture,
        uSize: [simWidth, simHeight],
      });
    };

    // Mouse handling
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      flowmap.mouse.set(
        (e.clientX - rect.left) / rect.width,
        (rect.bottom - e.clientY) / rect.height
      );
      flowmap.velocity.set(
        (e.movementX / rect.width) * simWidth,
        (e.movementY / rect.width) * simHeight
      );
    };

    let prevTouch: { x: number; y: number } | null = null;
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      e.preventDefault();

      flowmap.mouse.set(
        (touch.clientX - rect.left) / rect.width,
        (rect.bottom - touch.clientY) / rect.height
      );

      if (!prevTouch) prevTouch = { x: touch.clientX, y: touch.clientY };
      flowmap.velocity.set(
        ((touch.clientX - prevTouch.x) / rect.width) * simWidth,
        ((touch.clientY - prevTouch.y) / rect.width) * simHeight
      );
      prevTouch.x = touch.clientX;
      prevTouch.y = touch.clientY;
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      needsResize = true;
    };

    // Add listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('resize', handleResize);

    // Start animation
    rafId = requestAnimationFrame(update);

    // Return cleanup function
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (gl.canvas.parentElement) {
        gl.canvas.parentElement.removeChild(gl.canvas);
      }
    };
  }, [text, glassColor, bgColor, textColor, renderTextToCanvas]);

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize renderer when visible
  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      setIsSupported(false);
      return;
    }

    // Check for HALF_FLOAT support
    const ext = gl.getExtension('OES_texture_half_float');
    if (!gl.getExtension('EXT_color_buffer_half_float') && !ext) {
      // Might still work with regular floats
    }

    if (isVisible && !cleanupRef.current) {
      cleanupRef.current = initRenderer() || null;
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isVisible, initRenderer]);

  if (!isSupported) {
    return (
      <div className={`fluid-glass-fallback ${className}`}>
        <span className="footer-name-text">{text}</span>
      </div>
    );
  }

  return <div ref={containerRef} className={`fluid-glass ${className}`} />;
};

export default FluidGlass;
