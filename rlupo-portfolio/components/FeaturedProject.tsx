import React from 'react';
import { Project } from '../types';
import { useNumberCounter } from '../hooks/useNumberCounter';

interface FeaturedProjectProps {
  project: Project;
  index: number;
}

const FeaturedProject: React.FC<FeaturedProjectProps> = ({ project, index }) => {
  const counterRef = useNumberCounter(project.metricNumeric);
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className="featured-project">
      <div className="fp-left">
        <div className="fp-number">{number}</div>
        <h2 className="fp-title">{project.title}</h2>
        {project.problem && (
          <p className="fp-problem">&ldquo;{project.problem}&rdquo;</p>
        )}
        <p className="fp-description">{project.description}</p>
        <div className="fp-stack">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className={`fp-pill ${project.primaryStack.includes(tech) ? 'amber' : ''}`}
            >
              {tech}
            </span>
          ))}
        </div>
        {project.githubUrl ? (
          <a href={project.githubUrl} className="fp-link" target="_blank" rel="noopener noreferrer">
            View on GitHub &rarr;
          </a>
        ) : (
          <span className="fp-link private">Private repo &mdash; enterprise tooling</span>
        )}
      </div>
      <div className="fp-right">
        <div className="fp-metric">
          {project.metricNumeric !== undefined ? (
            <><span ref={counterRef}>0</span>+</>
          ) : (
            project.metric
          )}
        </div>
        <div className="fp-metric-label">{project.metricLabel}</div>
      </div>
    </article>
  );
};

export default FeaturedProject;
