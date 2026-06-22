import React, { useRef, useEffect } from 'react';
import { PowerGlitch } from 'powerglitch';
import AsciiGrid from './AsciiGrid';

interface HeroSlideProps {
  isActive: boolean;
  onPrev: () => void;
  onNext: () => void;
  activeIndex: number;
  totalSlides: number;
}

const GlitchName: React.FC = React.memo(() => {
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nameRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { stopGlitch } = PowerGlitch.glitch(nameRef.current, {
      playMode: 'always',
      createContainers: true,
      hideOverflow: false,
      timing: { duration: 5000, iterations: Infinity },
      glitchTimeSpan: { start: 0.85, end: 0.95 },
      shake: { velocity: 15, amplitudeX: 0.2, amplitudeY: 0.1 },
      slice: {
        count: 6,
        velocity: 15,
        minHeight: 0.02,
        maxHeight: 0.15,
        hueRotate: true,
        cssFilters: '',
      },
      pulse: false,
    });

    return () => stopGlitch();
  }, []);

  return (
    <div ref={nameRef} className="hero-name">
      TREY LUPO
    </div>
  );
});

GlitchName.displayName = 'GlitchName';

const HeroSlide: React.FC<HeroSlideProps> = ({
  isActive,
  onPrev,
  onNext,
  activeIndex,
  totalSlides,
}) => {
  return (
    <div className={`carousel-slide carousel-slide--hero ${isActive ? 'carousel-slide--active' : ''}`}>
      <AsciiGrid isActive={isActive} />

      <div className="hero-content">
        <GlitchName />
        <div className="hero-tagline">
          $ whoami — <span>AI/ML Systems Engineer</span>
        </div>
        <p className="hero-bio">
          Corporate FP&A Analyst at Franklin Street. I build Python SDKs that replace
          manual Oracle exports, ML frameworks in Rust, and revenue models that reconcile.
        </p>
        <div className="hero-creds">
          <span><span className="hero-label">EDU </span>B.A. Statistics · USF</span>
          <span><span className="hero-label">CERT </span>MIT Data Science</span>
          <span><span className="hero-label">LANG </span>Python / Rust / TypeScript / SQL</span>
        </div>
      </div>

      <div className="carousel-slide-footer">
        <nav className="carousel-nav" aria-label="Project navigation">
          <button className="carousel-btn" onClick={onPrev} aria-label="Previous slide">
            <span aria-hidden="true">&larr;</span> PREV
          </button>
          <span className="carousel-counter">
            {String(activeIndex).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>
          <button className="carousel-btn" onClick={onNext} aria-label="Next slide">
            NEXT <span aria-hidden="true">&rarr;</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default HeroSlide;
