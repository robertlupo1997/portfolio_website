import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useNumberCounter = (
  targetValue: number | undefined,
  duration: number = 2
) => {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || targetValue === undefined || hasAnimated.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.textContent = String(targetValue);
      return;
    }

    const obj = { value: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        hasAnimated.current = true;
        gsap.to(obj, {
          value: targetValue,
          duration,
          ease: 'power1.out',
          onUpdate: () => {
            el.textContent = String(Math.round(obj.value));
          },
        });
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.trigger === el)
        .forEach(t => t.kill());
    };
  }, [targetValue, duration]);

  return ref;
};
