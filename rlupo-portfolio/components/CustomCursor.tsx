import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if touch device
    if ('ontouchstart' in window) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let running = true;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      if (!running) return;

      // Slightly faster smoothing than parallax for responsive cursor feel
      currentX = lerp(currentX, targetX, 0.15);
      currentY = lerp(currentY, targetY, 0.15);

      // Offset by half cursor size (48px)
      cursor.style.transform = `translate(${currentX - 48}px, ${currentY - 48}px)`;

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Start animation loop
    requestAnimationFrame(animate);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      running = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      <div className="cursor_pad" />
      <div
        ref={cursorRef}
        className="project_cursor"
        style={{ opacity: isVisible ? 1 : 0 }}
      />
    </>
  );
};

export default CustomCursor;
