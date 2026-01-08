import { useEffect, useRef } from 'react';

export const useMouseParallax = (
  containerRef: React.RefObject<HTMLElement>,
  intensity: number = 0.6
) => {
  const frameRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const content = container.querySelector('.home_project-content') as HTMLElement;
        if (!content) return;

        const rect = container.getBoundingClientRect();

        // Only apply parallax when container is in view
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        // Calculate mouse position relative to container center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);

        // Calculate rotation (reduced intensity for subtlety)
        const rotateY = mouseX * intensity * 8; // Max ~5 degrees
        const rotateX = -mouseY * intensity * 6; // Max ~4 degrees

        // Apply smooth transform
        content.style.transition = 'transform 0.1s ease-out';
        content.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    };

    const handleMouseLeave = () => {
      const content = container.querySelector('.home_project-content') as HTMLElement;
      if (content) {
        content.style.transition = 'transform 0.5s ease-out';
        content.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [containerRef, intensity]);
};
