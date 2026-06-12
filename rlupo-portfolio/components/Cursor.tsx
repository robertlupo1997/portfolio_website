import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) {
      cursor.style.display = 'none';
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power2.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power2.out' });

    let firstMove = true;
    const handleMouseMove = (e: MouseEvent) => {
      if (firstMove) {
        gsap.set(cursor, { x: e.clientX, y: e.clientY, opacity: 1 });
        firstMove = false;
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement;
      const isHoverable = !!target.closest('a, button, [data-cursor="hover"]');
      const isProject = !!target.closest('.fp-entry, .work-item');

      cursor.classList.toggle('cursor--hover', isHoverable);
      cursor.classList.toggle('cursor--project', isProject && !isHoverable);
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.1, ease: 'power2.out' });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2, ease: 'power3.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return <div ref={cursorRef} className="cursor" />;
};

export default Cursor;
