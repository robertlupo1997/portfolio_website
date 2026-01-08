import { useEffect, useRef } from 'react';

// Lenis smooth scroll hook
// Uses the Lenis library loaded via CDN in index.html

declare global {
  interface Window {
    Lenis: any;
  }
}

export const useLenis = () => {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Wait for Lenis to be available
    const initLenis = () => {
      if (typeof window.Lenis === 'undefined') {
        // Retry after a short delay if Lenis isn't loaded yet
        setTimeout(initLenis, 100);
        return;
      }

      // Initialize Lenis with CHRLS-like settings
      lenisRef.current = new window.Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      // Animation frame loop
      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return lenisRef;
};
