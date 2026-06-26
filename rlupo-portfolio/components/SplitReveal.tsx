import React, { useRef, useLayoutEffect, useMemo, ElementType } from 'react';
import gsap from 'gsap';

interface SplitRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  trigger: boolean;
  delay?: number;
  duration?: number;
  stagger?: number;
}

const SplitReveal: React.FC<SplitRevealProps> = ({
  text,
  as: Tag = 'div',
  className = '',
  trigger,
  delay = 0,
  duration = 0.8,
  stagger = 0.08,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => text.split(' '), [text]);

  useLayoutEffect(() => {
    if (!trigger || !containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const inners = containerRef.current.querySelectorAll('.split-reveal-inner');
    const tween = gsap.fromTo(inners,
      { yPercent: 105 },
      {
        yPercent: 0,
        duration,
        ease: 'expo.out',
        stagger,
        delay,
      }
    );
    return () => { tween.kill(); };
  }, [trigger, delay, duration, stagger]);

  return (
    <Tag className={`split-reveal ${className}`} ref={containerRef as any}>
      {words.map((word, i) => (
        <span key={i} className="split-reveal-word">
          <span className="split-reveal-inner">{word}</span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
};

export default SplitReveal;
