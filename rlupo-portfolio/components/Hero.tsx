import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import TextScramble from './TextScramble';
import { PERSONAL_INFO } from '../constants';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power2.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const factor = 1 - dist / 100;
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
    <section className="hero" id="hero">
      <div className="hero-content">
        <h1 className="hero-name">
          <TextScramble text="Trey Lupo" triggerOnView={false} triggerOnHover={true} duration={1500} delay={200} />
        </h1>
        <p className={`hero-descriptor ${isLoaded ? 'visible' : ''}`}>
          AI/ML systems engineer building precision tools<br />
          for finance, forecasting, and production ML.
        </p>
        <div className={`hero-cta-wrap ${isLoaded ? 'visible' : ''}`}>
          <a ref={ctaRef} href={`mailto:${PERSONAL_INFO.email}`} className="btn-primary">
            Get in touch
          </a>
        </div>
      </div>
      <div className="hero-folio-label" aria-hidden="true">
        <span>Folio</span>
        <span>/2026</span>
      </div>
    </section>
  );
};

export default Hero;
