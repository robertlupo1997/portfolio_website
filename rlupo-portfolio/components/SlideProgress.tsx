import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SlideProgressProps {
  activeIndex: number;
  totalSlides: number;
}

const SlideProgress: React.FC<SlideProgressProps> = ({ activeIndex, totalSlides }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = totalSlides > 1 ? activeIndex / (totalSlides - 1) : 0;

  useEffect(() => {
    if (!barRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(barRef.current, {
      scaleX: progress,
      duration: prefersReducedMotion ? 0 : 0.5,
      ease: 'expo.out',
    });
  }, [progress]);

  return (
    <div className="slide-progress" aria-hidden="true">
      <div className="slide-progress-track">
        <div className="slide-progress-bar" ref={barRef} />
      </div>
    </div>
  );
};

export default SlideProgress;
