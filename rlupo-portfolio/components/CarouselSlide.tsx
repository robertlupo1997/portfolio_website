import React from 'react';
import { Project } from '../types';
import TerminalPanel from './TerminalPanel';

interface CarouselSlideProps {
  project: Project;
  index: number;
  isActive: boolean;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({ project, index, isActive }) => {
  return (
    <div className={`carousel-slide ${isActive ? 'carousel-slide--active' : ''}`}>
      <div className="carousel-slide-terminal">
        <TerminalPanel project={project} index={index} isActive={isActive} />
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
