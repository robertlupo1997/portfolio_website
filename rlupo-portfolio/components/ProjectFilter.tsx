import React from 'react';
import { ProjectCategory } from '../types';
import { PROJECT_CATEGORIES } from '../constants';

interface ProjectFilterProps {
  activeFilter: ProjectCategory;
  onFilterChange: (category: ProjectCategory) => void;
  counts: Record<ProjectCategory, number>;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  activeFilter,
  onFilterChange,
  counts
}) => {
  return (
    <div className="project-filters" role="tablist" aria-label="Filter projects by category">
      {PROJECT_CATEGORIES.map(({ key, label }) => (
        <button
          key={key}
          className={`filter-btn ${activeFilter === key ? 'active' : ''}`}
          onClick={() => onFilterChange(key)}
          role="tab"
          aria-selected={activeFilter === key}
          aria-controls="projects-grid"
        >
          {label}
          <span className="filter-count">{counts[key]}</span>
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;
