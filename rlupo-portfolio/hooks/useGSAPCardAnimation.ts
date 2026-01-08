import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

export const useGSAPCardAnimation = (
  containerRef: React.RefObject<HTMLElement>,
  cardCount: number = 6
) => {
  const animationRef = useRef<any>(null);

  useEffect(() => {
    const initGSAP = () => {
      if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
        setTimeout(initGSAP, 100);
        return;
      }

      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;

      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      if (!container) return;

      const cards = container.querySelectorAll('.home_project-card');
      const track = container.closest('.home_project-track');

      if (!track || cards.length === 0) return;

      // Set initial state: cards start at Y=1600 (off-screen below)
      cards.forEach((card, index) => {
        gsap.set(card, {
          y: 1600,
          z: index * -240, // Exact CHRLS z-spacing
          transformStyle: 'preserve-3d'
        });
      });

      // Create scroll-triggered animation
      animationRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrubbing
          // markers: true // Uncomment for debugging
        }
      });

      // Animate cards from Y=1600 to Y=0 with stagger
      animationRef.current.to(cards, {
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out'
      });
    };

    initGSAP();

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((t: any) => t.kill());
      }
    };
  }, [containerRef, cardCount]);
};
