import { useEffect, useRef } from 'react';

interface LayerConfig {
  selector: string;
  speed: number;
  maxOffset: number;
}

/**
 * Zajno-style layered mouse parallax
 * Uses simple lerp for smooth following
 */
export const useLayeredParallax = (
  containerRef: React.RefObject<HTMLElement | null>,
  layers: LayerConfig[],
  options: { smoothing?: number; enabled?: boolean } = {}
) => {
  const { smoothing = 0.08, enabled = true } = options;
  const layersRef = useRef(layers);
  layersRef.current = layers;

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    if ('ontouchstart' in window) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    if (!container) return;

    // Local state for this effect instance
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = 0;
    let running = true;

    // Cache elements
    const elements = new Map<string, HTMLElement>();
    layersRef.current.forEach(layer => {
      const el = container.querySelector(layer.selector) as HTMLElement;
      if (el) {
        elements.set(layer.selector, el);
        el.style.willChange = 'transform';
      }
    });

    if (elements.size === 0) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

    const animate = () => {
      if (!running) return;

      currentX = lerp(currentX, targetX, smoothing);
      currentY = lerp(currentY, targetY, smoothing);

      elements.forEach((el, selector) => {
        const layer = layersRef.current.find(l => l.selector === selector);
        if (!layer) return;

        const x = clamp(currentX * layer.speed, -layer.maxOffset, layer.maxOffset);
        const y = clamp(currentY * layer.speed, -layer.maxOffset, layer.maxOffset);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      rafId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * 20;
      targetY = ((e.clientY - cy) / cy) * 15;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    // Start
    rafId = requestAnimationFrame(animate);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);

      elements.forEach(el => {
        el.style.willChange = '';
        el.style.transform = '';
      });
      elements.clear();
    };
  }, [containerRef, enabled, smoothing]);
};

export default useLayeredParallax;
