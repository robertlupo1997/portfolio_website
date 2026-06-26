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
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({
  project,
  index,
  isActive,
  onPrev,
  onNext,
  activeIndex,
  totalSlides,
}) => {
  const [animating, setAnimating] = useState(false);
  const hasImage = Boolean(project.imageUrl);
  const url = project.githubUrl || project.liveUrl;
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
    if (isActive && imageRef.current) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(imageRef.current, { clipPath: 'inset(0 0 0 0)', x: 0 });
        return;
      }
      gsap.fromTo(imageRef.current,
        { clipPath: 'inset(0 100% 0 0)', x: 20 },
        {
          clipPath: 'inset(0 0% 0 0)',
          x: 0,
          duration: 0.5,
          ease: 'expo.out',
          delay: 0.1,
        }
      );
    }
  }, [isActive]);

  return (
    <div className={`carousel-slide ${animating ? 'carousel-slide--active' : ''} ${!hasImage ? 'carousel-slide--no-image' : ''}`}>
      <div className="carousel-slide-terminal" ref={terminalRef}>
        <TerminalPanel project={project} index={index} isActive={animating} />
      </div>

      {hasImage && (
        <div className="carousel-slide-image" ref={imageRef}>
          <div className="carousel-slide-image-inner scanlines">
            <img
              src={project.imageUrl}
              alt={`${project.title} project`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        </div>
      )}

      <div className="carousel-slide-footer">
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="terminal-visit">
            [ VISIT -&gt; ]
          </a>
        )}
        {isActive && <span className="cursor-blink" />}
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
      </div>
    </div>
  );
};

export default CarouselSlide;
