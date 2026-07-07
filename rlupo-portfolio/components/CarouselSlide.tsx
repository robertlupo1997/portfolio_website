import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Project } from '../types';
import TerminalPanel from './TerminalPanel';

interface CarouselSlideProps {
  project: Project;
  index: number;
  isActive: boolean;
  onPrev: () => void;
  onNext: () => void;
  activeIndex: number;
  totalSlides: number;
  useFallback?: boolean;
  onAskOpen?: (query: string) => void;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({
  project,
  index,
  isActive,
  onPrev,
  onNext,
  activeIndex,
  totalSlides,
  useFallback,
  onAskOpen,
}) => {
  const [animating, setAnimating] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const showFallback = (useFallback ?? false) || prefersReducedMotion || isMobile;
  const terminalRef = useRef<HTMLDivElement>(null);
  const wasActive = useRef(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wasActive.current && !isActive && terminalRef.current) {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const lines = terminalRef.current.querySelectorAll('.terminal-line');
        gsap.to(lines, {
          opacity: 0,
          y: -4,
          duration: 0.2,
          ease: 'expo.out',
          stagger: 0.03,
        });
      }
    }
    wasActive.current = isActive;
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      setAnimating(false);
      const frame = requestAnimationFrame(() => setAnimating(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setAnimating(false);
    }
  }, [isActive]);

  useEffect(() => {
    const el = imageRef.current;
    if (!el) return;
    if (isActive) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { clipPath: 'inset(0 0 0 0)', x: 0 });
        return;
      }
      gsap.fromTo(el,
        { clipPath: 'inset(0 100% 0 0)', x: 20 },
        {
          clipPath: 'inset(0 0% 0 0)',
          x: 0,
          duration: 0.5,
          ease: 'expo.out',
          delay: 0.1,
        }
      );
      if (isActive && terminalRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const lines = terminalRef.current.querySelectorAll('.terminal-line');
        gsap.fromTo(
          lines,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            duration: 0.3,
            ease: 'cubic-bezier(0, 0, 0.2, 1)',
            stagger: 0.04,
            delay: 0.12,
          },
        );
      }
    } else {
      // Cancel an in-flight reveal and reset the off-screen slide to its hidden start state.
      gsap.killTweensOf(el);
      gsap.set(el, { clipPath: 'inset(0 100% 0 0)', x: 20 });
    }
  }, [isActive]);

  return (
    <div className={`carousel-slide ${animating ? 'carousel-slide--active' : ''}`}>
      <div className="carousel-slide-terminal" ref={terminalRef}>
        <TerminalPanel project={project} index={index} isActive={animating} />
      </div>

      <div
        className={`carousel-slide-image${showFallback ? ' carousel-slide-image--fallback' : ''}`}
        ref={imageRef}
      >
        {showFallback ? (
          <img
            src={`/viz/${project.id}.png`}
            alt={`${project.title} visualization`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ) : (
          <div aria-hidden="true" style={{ width: '100%', height: '100%' }} />
        )}
      </div>

      <div className="carousel-slide-footer">
        {project.ctaAsk !== undefined ? (
          <button
            className="terminal-visit"
            onClick={() => onAskOpen?.(project.ctaAsk!)}
            aria-label="Open Ask My Work panel"
          >
            [ ASK -&gt; ]
          </button>
        ) : (
          <>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="terminal-visit">
                [ VISIT -&gt; ]
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="terminal-visit">
                {project.liveUrl.includes('pypi.org') ? '[ PYPI -> ]' : '[ LIVE -> ]'}
              </a>
            )}
          </>
        )}
        {isActive && <span className="cursor-blink" />}
        {isActive && (
          <nav className="carousel-nav" aria-label="Project navigation">
            <button className="carousel-btn" onClick={onPrev} aria-label="Previous project">
              <span aria-hidden="true">&larr;</span> PREV
            </button>
            <span className="carousel-counter">
              {String(activeIndex).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
            <button className="carousel-btn" onClick={onNext} aria-label="Next project">
              NEXT <span aria-hidden="true">&rarr;</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default CarouselSlide;
