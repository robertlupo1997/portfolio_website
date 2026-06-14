import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import TerminalPanel from './TerminalPanel';

interface CarouselSlideProps {
  project: Project;
  index: number;
  isActive: boolean;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  activeIndex: number;
  totalSlides: number;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({
  project,
  index,
  isActive,
  onPrev,
  onNext,
  isFirst,
  isLast,
  activeIndex,
  totalSlides,
}) => {
  const [animating, setAnimating] = useState(false);
  const hasImage = Boolean(project.imageUrl);
  const url = project.githubUrl || project.liveUrl;

  useEffect(() => {
    if (isActive) {
      setAnimating(false);
      const frame = requestAnimationFrame(() => setAnimating(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setAnimating(false);
    }
  }, [isActive]);

  return (
    <div className={`carousel-slide ${animating ? 'carousel-slide--active' : ''} ${!hasImage ? 'carousel-slide--no-image' : ''}`}>
      <div className="carousel-slide-terminal">
        <TerminalPanel project={project} index={index} isActive={animating} />
      </div>

      {hasImage && (
        <div className="carousel-slide-image">
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
          <button className="carousel-btn" onClick={onPrev} disabled={isFirst} aria-label="Previous project">
            <span aria-hidden="true">&larr;</span> PREV
          </button>
          <span className="carousel-counter">
            {String(activeIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>
          <button className="carousel-btn" onClick={onNext} disabled={isLast} aria-label="Next project">
            NEXT <span aria-hidden="true">&rarr;</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default CarouselSlide;
