import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import TerminalPanel from './TerminalPanel';

interface CarouselSlideProps {
  project: Project;
  index: number;
  isActive: boolean;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({ project, index, isActive }) => {
  const [animating, setAnimating] = useState(false);

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
    <div className={`carousel-slide ${animating ? 'carousel-slide--active' : ''}`}>
      <div className="carousel-slide-terminal">
        <TerminalPanel project={project} index={index} isActive={animating} />
      </div>

      <div className="carousel-slide-image scanlines">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={`${project.title} project`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        )}
      </div>
    </div>
  );
};

export default CarouselSlide;
