import React, { useRef, useLayoutEffect, useMemo } from 'react';
import gsap from 'gsap';

interface SplitRevealProps {
  text: string;
  /* HTML tags only: R3F v9 augments JSX.IntrinsicElements with Three elements,
     which collapses a bare ElementType union's children to `never`. */
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
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
    return () => { tween.kill(); gsap.set(inners, { yPercent: 0 }); };
  }, [trigger, delay, duration, stagger]);

  return (
    <Tag className={`split-reveal ${className}`} ref={containerRef as any}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="split-reveal-word">
            <span className="split-reveal-inner">{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
};

export default SplitReveal;
