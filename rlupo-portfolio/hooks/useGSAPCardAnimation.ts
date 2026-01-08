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

      // CHRLS exact values: -5em increments (80px at 16px base)
      // DOM order: ._6 (front, index 0) to ._1 (back, index 5)
      const zSpacing = 80; // 5em = 80px
      const numCards = cards.length;

      // Set initial state: cards start at Y=1600 (off-screen below)
      cards.forEach((card, index) => {
        // cards[0] = ._6 (front, z=0), cards[5] = ._1 (back, z=-400px)
        gsap.set(card, {
          y: 1600,
          x: 0,
          z: index * -zSpacing,
          transformStyle: 'preserve-3d'
        });
      });

      // Create master timeline with scroll trigger
      animationRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrubbing
          // markers: true // Uncomment for debugging
        }
      });

      const tl = animationRef.current;

      // Phase 1: All cards rise into view (0-30% of scroll)
      tl.to(cards, {
        y: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: 'power2.out'
      });

      // Phase 2: Sequential card dealing (30-100% of scroll)
      // Each card gets spotlight then exits, remaining cards push forward
      const exitDistance = window.innerWidth * -0.6; // Responsive: 60% of viewport width
      const totalDealingDuration = 0.7; // 70% of timeline for dealing
      const cardDealDuration = totalDealingDuration / (numCards - 1); // Time per card deal

      // For each card that exits (all except the last one)
      for (let i = 0; i < numCards - 1; i++) {
        const exitingCard = cards[i];

        // Current card exits left with slight rotation - NO OPACITY FADE (CHRLS style)
        tl.to(exitingCard, {
          x: exitDistance,
          rotateY: -15, // Slight rotation as card exits
          duration: cardDealDuration * 0.6, // Exit takes 60% of this card's time
          ease: 'power2.inOut'
        });

        // Simultaneously: remaining cards push forward by one Z-step
        // This happens at the same time as the exit (not after)
        const pushForwardCards = [];
        for (let j = i + 1; j < numCards; j++) {
          pushForwardCards.push(cards[j]);
        }

        if (pushForwardCards.length > 0) {
          // Calculate new Z positions - each card moves forward by one step
          tl.to(pushForwardCards, {
            z: (index: number) => {
              // The card at position j (in original array) should move to z position of j-i-1
              const originalIndex = i + 1 + index;
              const newZIndex = originalIndex - i - 1;
              return newZIndex * -zSpacing;
            },
            duration: cardDealDuration * 0.6,
            ease: 'power2.inOut'
          }, '<'); // '<' means start at same time as previous animation

          // Small pause for spotlight moment before next card exits
          tl.to({}, { duration: cardDealDuration * 0.4 });
        }
      }
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
