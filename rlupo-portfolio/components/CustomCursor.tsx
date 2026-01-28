import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isOnCard, setIsOnCard] = useState(false);

  useEffect(() => {
    // Check if touch device
    if ('ontouchstart' in window) return;

    // Add body class to hide default cursor
    document.body.classList.add('custom-cursor-active');

    const cursor = cursorRef.current;
    if (!cursor) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let running = true;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      if (!running) return;

      currentX = lerp(currentX, targetX, 0.15);
      currentY = lerp(currentY, targetY, 0.15);

      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]');
      const projectCard = target.closest('.project-card-wrapper');
      setIsHovering(!!interactive);
      setIsOnCard(!!projectCard && !interactive);
    };

    requestAnimationFrame(animate);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousemove', handleElementHover, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      running = false;
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  const cursorClasses = [
    'custom-cursor',
    isHovering ? 'cursor-hover' : '',
    isPressed ? 'cursor-click' : '',
    isOnCard ? 'cursor-plus' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={cursorRef}
      className={cursorClasses}
      style={{ opacity: isVisible ? 1 : 0 }}
    />
  );
};

export default CustomCursor;
