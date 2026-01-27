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

// Unique SVG overlays for each project type
const ProjectOverlay: React.FC<{ projectId: string }> = ({ projectId }) => {
  const overlays: Record<string, React.ReactNode> = {
    // KKBOX - Churn/retention circles
    kkbox: (
      <svg viewBox="0 0 100 100" fill="none" className="project-overlay">
        <circle cx="25" cy="25" r="15" stroke="var(--accent-teal)" strokeWidth="1" opacity="0.6" />
        <circle cx="75" cy="75" r="20" stroke="var(--accent-blue)" strokeWidth="1" opacity="0.5" />
        <path d="M25 25 L75 75" stroke="var(--accent-teal)" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 2" />
        <circle cx="50" cy="50" r="8" fill="var(--accent-teal)" opacity="0.3" />
      </svg>
    ),
    // Object Detection - Bounding boxes
    'obj-detect': (
      <svg viewBox="0 0 100 100" fill="none" className="project-overlay">
        <rect x="10" y="20" width="35" height="40" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.7" />
        <rect x="55" y="35" width="30" height="50" stroke="var(--accent-teal)" strokeWidth="1.5" opacity="0.6" />
        <rect x="30" y="60" width="25" height="30" stroke="var(--accent-blue)" strokeWidth="1" opacity="0.4" />
        <circle cx="27" cy="35" r="3" fill="var(--accent-teal)" opacity="0.8" />
        <circle cx="70" cy="55" r="3" fill="var(--accent-blue)" opacity="0.8" />
      </svg>
    ),
    // Amazon - Network/graph nodes
    'amazon-rec': (
      <svg viewBox="0 0 100 100" fill="none" className="project-overlay">
        <circle cx="50" cy="30" r="6" fill="var(--accent-blue)" opacity="0.7" />
        <circle cx="25" cy="60" r="5" fill="var(--accent-teal)" opacity="0.6" />
        <circle cx="75" cy="60" r="5" fill="var(--accent-teal)" opacity="0.6" />
        <circle cx="35" cy="85" r="4" fill="var(--accent-blue)" opacity="0.5" />
        <circle cx="65" cy="85" r="4" fill="var(--accent-blue)" opacity="0.5" />
        <line x1="50" y1="30" x2="25" y2="60" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.5" />
        <line x1="50" y1="30" x2="75" y2="60" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.5" />
        <line x1="25" y1="60" x2="35" y2="85" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.4" />
        <line x1="75" y1="60" x2="65" y2="85" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.4" />
        <line x1="25" y1="60" x2="75" y2="60" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.3" />
      </svg>
    ),
    // FoodHub - Heatmap grid
    foodhub: (
      <svg viewBox="0 0 100 100" fill="none" className="project-overlay">
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={15 + col * 20}
              y={15 + row * 20}
              width="16"
              height="16"
              fill={((row + col) % 3 === 0) ? 'var(--accent-teal)' : 'var(--accent-blue)'}
              opacity={0.2 + ((row + col) % 4) * 0.15}
            />
          ))
        )}
      </svg>
    ),
    // Shinkansen - Speed lines / train path
    shinkansen: (
      <svg viewBox="0 0 100 100" fill="none" className="project-overlay">
        <path d="M10 50 Q30 30, 50 50 T90 50" stroke="var(--accent-blue)" strokeWidth="2" opacity="0.6" fill="none" />
        <path d="M10 60 Q30 40, 50 60 T90 60" stroke="var(--accent-teal)" strokeWidth="1" opacity="0.4" fill="none" />
        <circle cx="20" cy="50" r="3" fill="var(--accent-teal)" opacity="0.8" />
        <circle cx="50" cy="50" r="4" fill="var(--accent-blue)" opacity="0.9" />
        <circle cx="80" cy="50" r="3" fill="var(--accent-teal)" opacity="0.8" />
      </svg>
    ),
    // Life Expectancy - Heartbeat / pulse line
    'life-expectancy': (
      <svg viewBox="0 0 100 100" fill="none" className="project-overlay">
        <path
          d="M5 50 L20 50 L25 50 L30 30 L35 70 L40 40 L45 60 L50 50 L95 50"
          stroke="var(--accent-teal)"
          strokeWidth="2"
          opacity="0.7"
          fill="none"
        />
        <circle cx="50" cy="50" r="20" stroke="var(--accent-blue)" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="30" stroke="var(--accent-blue)" strokeWidth="0.5" opacity="0.2" />
      </svg>
    ),
  };

  return overlays[projectId] || null;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const projectNumber = String(index + 1).padStart(2, '0');

  return (
    <article className="project-card">
      <div className="project-card-image">
        {/* Background image */}
        {project.imageUrl && (
          <img src={project.imageUrl} alt={project.title} loading="lazy" />
        )}
        {/* SVG overlay */}
        <div className="project-card-overlay">
          <ProjectOverlay projectId={project.id} />
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
