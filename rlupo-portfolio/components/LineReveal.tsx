import React, { useLayoutEffect, useRef, ElementType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface LineRevealProps {
  children: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
}

const LineReveal: React.FC<LineRevealProps> = ({
  children,
  as: Component = 'div',
  className = '',
  stagger = 0.08,
}) => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      linesClass: 'sr-line',
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: 1,
          stagger,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        }),
    });

    return () => split.revert();
  }, [children, stagger]);

  return React.createElement(Component, { ref, className }, children);
};

export default LineReveal;
