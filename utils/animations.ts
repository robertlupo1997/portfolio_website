import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Standard easing curve matching CHRLS aesthetic
export const CHRLS_EASE = 'power3.out';

// Animation presets
export const fadeInUp = {
  from: { opacity: 0, y: 60 },
  to: { opacity: 1, y: 0, duration: 0.8, ease: CHRLS_EASE },
};

export const staggerChildren = {
  stagger: 0.1,
  ease: CHRLS_EASE,
};

// Initialize GSAP defaults
export const initGSAP = () => {
  gsap.defaults({
    ease: CHRLS_EASE,
    duration: 0.8,
  });
};

export { gsap, ScrollTrigger };
