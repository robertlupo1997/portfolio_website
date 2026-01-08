import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gsap: any;
  }
}

/**
 * Mouse parallax effect using GSAP for smooth integration with ScrollTrigger.
 * Applies subtle rotation to the card container based on mouse position.
 * Matches CHRLS behavior with very subtle/minimal rotation.
 */
export const useMouseParallax = (
  containerRef: React.RefObject<HTMLElement>,
  intensity: number = 0.3 // Reduced for subtlety like CHRLS
) => {
  const isActiveRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wait for GSAP to load
    const initParallax = () => {
      if (typeof window.gsap === 'undefined') {
        setTimeout(initParallax, 100);
        return;
      }

      const gsap = window.gsap;
      const content = container.querySelector('.home_project-content') as HTMLElement;
      if (!content) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();

        // Only apply parallax when container is in view
        if (rect.top > window.innerHeight || rect.bottom < 0) {
          isActiveRef.current = false;
          return;
        }

        isActiveRef.current = true;

        // Calculate mouse position relative to container center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);

        // Calculate rotation (very subtle like CHRLS)
        const rotateY = mouseX * intensity * 5; // Max ~1.5 degrees
        const rotateX = -mouseY * intensity * 4; // Max ~1.2 degrees

        // Use GSAP for smooth animation that works with ScrollTrigger
        gsap.to(content, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      const handleMouseLeave = () => {
        if (!isActiveRef.current) return;

        // Smoothly return to center
        gsap.to(content, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    };

    const cleanup = initParallax();

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [containerRef, intensity]);
};
