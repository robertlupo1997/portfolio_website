import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import AsciiGrid from './AsciiGrid';
import SplitReveal from './SplitReveal';

interface HeroSlideProps {
  isActive: boolean;
  revealReady: boolean;
  onPrev: () => void;
  onNext: () => void;
  activeIndex: number;
  totalSlides: number;
}

const HeroSlide: React.FC<HeroSlideProps> = ({
  isActive,
  revealReady,
  onPrev,
  onNext,
  activeIndex,
  totalSlides,
}) => {
  const hasAnimated = useRef(false);
  const taglineRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const credsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isActive || !revealReady || hasAnimated.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hasAnimated.current = true;
      return;
    }
    hasAnimated.current = true;

    const elements = [taglineRef.current, bioRef.current, credsRef.current].filter(Boolean);
    gsap.fromTo(elements,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.15, delay: 0.4 }
    );
  }, [isActive, revealReady]);

  return (
    <div className={`carousel-slide carousel-slide--hero ${isActive ? 'carousel-slide--active' : ''}`}>
      <AsciiGrid isActive={isActive} />

      <div className="hero-content">
        <SplitReveal
          text="TREY LUPO"
          as="div"
          className="hero-name"
          trigger={isActive && revealReady && !hasAnimated.current}
          delay={0.1}
          duration={0.8}
          stagger={0.12}
        />
        <div className="hero-tagline" ref={taglineRef}>
          $ whoami — <span>AI/ML Systems Engineer</span>
        </div>
        <p className="hero-bio" ref={bioRef}>
          Corporate FP&A Analyst at Franklin Street. I build Python SDKs that replace
          manual Oracle exports, ML frameworks in Rust, and revenue models that reconcile.
        </p>
        <div className="hero-creds" ref={credsRef}>
          <span><span className="hero-label">EDU </span>B.A. Statistics · USF</span>
          <span><span className="hero-label">CERT </span>MIT Data Science</span>
          <span><span className="hero-label">LANG </span>Python / Rust / TypeScript / SQL</span>
        </div>
      </div>

      <button className="hero-projects-btn" onClick={onNext} aria-label="View projects">
        [ PROJECTS &rarr; ]
      </button>

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
