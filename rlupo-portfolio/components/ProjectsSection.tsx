import React from 'react';
import ProjectCard from './ProjectCard';
import { PROJECTS } from '../constants';

const ProjectsSection: React.FC = () => {
  return (
    <section className="projects" id="projects">
      <div className="projects-header">
        <h2 className="projects-title">PROJECTS</h2>
      </div>

      <div className="projects-scroll">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
