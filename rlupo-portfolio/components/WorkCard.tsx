import React from 'react';
import { Project } from '../types';

interface WorkCardProps {
  project: Project;
}

const WorkCard: React.FC<WorkCardProps> = ({ project }) => (
  <div className="work-card">
    <div className="wc-header">
      <span className="wc-title">{project.title}</span>
      <span className="wc-metric">{project.metric}</span>
    </div>
    <p className="wc-desc">{project.description}</p>
    <div className="wc-footer">
      <div className="wc-stack">
        {project.stack.map((tech, i) => (
          <React.Fragment key={tech}>
            {i > 0 && <span className="wc-stack-sep">&middot;</span>}
            <span className="wc-stack-tag">{tech}</span>
          </React.Fragment>
        ))}
      </div>
      {project.githubUrl && (
        <a href={project.githubUrl} className="wc-link" target="_blank" rel="noopener noreferrer">
          GitHub &rarr;
        </a>
      )}
    </div>
  </div>
);

export default WorkCard;
