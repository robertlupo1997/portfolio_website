import { useEffect, useRef } from 'react';

export const useMouseParallax = (
  containerRef: React.RefObject<HTMLElement>,
  intensity: number = 0.1
) => {
  const frameRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel any pending frame
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();

        // Calculate mouse position relative to container center (-0.5 to 0.5)
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);

        // Calculate rotation (inverted for natural feel)
        const rotateY = mouseX * intensity * 15; // Max ~15 degrees
        const rotateX = -mouseY * intensity * 10; // Max ~10 degrees

        // Apply transform to the content container
        const content = container.querySelector('.home_project-content') as HTMLElement;
        if (content) {
          content.style.transform = `perspective(275px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
      });
    };

    const handleMouseLeave = () => {
      // Reset to center on mouse leave
      const content = container.querySelector('.home_project-content') as HTMLElement;
      if (content) {
        content.style.transform = 'perspective(275px) rotateX(0deg) rotateY(0deg)';
        content.style.transition = 'transform 0.5s ease-out';
        setTimeout(() => {
          content.style.transition = '';
        }, 500);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [containerRef, intensity]);
};
