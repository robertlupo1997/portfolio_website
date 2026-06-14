import React from 'react';
import { ALL_PROJECTS, FEATURED_PROJECTS } from '../constants';

const OFFSET = FEATURED_PROJECTS.length;

const ArchiveList: React.FC = () => {
  return (
    <section className="archive" id="archive">
      <h2 className="archive-header">ARCHIVE /2024–26</h2>

      <div className="archive-list">
        {ALL_PROJECTS.map((project, i) => {
          const url = project.githubUrl || project.liveUrl || '#';
          return (
            <a
              key={project.id}
              href={url}
              target={url !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="archive-row"
            >
              <span className="archive-index">P/{String(OFFSET + i + 1).padStart(2, '0')}</span>
              <span className="archive-title">{project.title}</span>
              <span className="archive-category">{project.category}</span>
              <span className="archive-metric">{project.metric}</span>
              <span className="archive-arrow">-&gt;</span>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default ArchiveList;
