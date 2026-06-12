import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from './TextScramble';
import { PERSONAL_INFO } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Divider scroll reveal
  useEffect(() => {
    const divider = dividerRef.current;
    if (!divider) return;

    gsap.fromTo(
      divider,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: divider,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === divider) t.kill();
      });
    };
  }, []);

  // Magnetic CTA
  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power2.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 100;

      if (dist < radius) {
        const factor = 1 - dist / radius;
        xTo(dx * factor * 0.4);
        yTo(dy * factor * 0.4);
      }
    };

    const handleMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'expo.out' });
    };

    btn.parentElement?.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.parentElement?.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <section className="hero" id="hero">
        <div className="hero-content">
          <h1 className="hero-name">
            <TextScramble
              text="Trey Lupo"
              triggerOnView={false}
              triggerOnHover={true}
              duration={1500}
              delay={200}
            />
          </h1>

          <p className={`hero-hook ${isLoaded ? 'visible' : ''}`}>
            I build production tools that make financial data useful.
          </p>

          <p className={`hero-status ${isLoaded ? 'visible' : ''}`}>
            fp&a analyst · ai/ml engineer · tampa, fl
          </p>

          <div className={`hero-ctas ${isLoaded ? 'visible' : ''}`}>
            <a href="#projects" className="hero-cta-outline">View work</a>
            <a ref={ctaRef} href={`mailto:${PERSONAL_INFO.email}`} className="hero-cta-primary hero-cta-magnetic">Get in touch</a>
          </div>
        </div>
      </section>

      <div className="hero-divider" ref={dividerRef} />
    </>
  );
};

export default Hero;
