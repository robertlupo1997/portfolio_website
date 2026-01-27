import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12L12 4M12 4H6M12 4V10" />
  </svg>
);

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const projectNumber = String(index + 1).padStart(2, '0');

  return (
    <article className="project-card">
      {/* Abstract visual placeholder */}
      <div className="project-card-image">
        <div className="project-card-visual">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <circle cx="70" cy="70" r="25" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <line x1="30" y1="30" x2="70" y2="70" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
          </svg>
        </div>
      </div>

      <div className="project-card-content">
        <span className="project-card-number">{projectNumber}</span>

        <h3 className="project-card-title">{project.title}</h3>

        {project.metric && (
          <span className="project-card-meta">{project.metric}</span>
        )}

        <div className="project-card-links">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card-link"
          >
            GitHub
            <ArrowIcon />
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card-link"
            >
              Live Demo
              <ArrowIcon />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
