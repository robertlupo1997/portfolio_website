import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimations = () => {
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // About section fade-up (using overlap class names)
    const anim1 = gsap.fromTo(
      '.about-statement-overlap',
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-overlap',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
    if (anim1.scrollTrigger) triggers.push(anim1.scrollTrigger);

    const anim2 = gsap.fromTo(
      '.about-bio-overlap',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-bio-overlap',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
    if (anim2.scrollTrigger) triggers.push(anim2.scrollTrigger);

    // Skills stagger
    const anim3 = gsap.fromTo(
      '.skill-tag-overlap',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.skills-grid-overlap',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
    if (anim3.scrollTrigger) triggers.push(anim3.scrollTrigger);

    // Cleanup — only kill triggers created in this hook
    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);
};
