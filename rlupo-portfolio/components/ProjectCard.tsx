import React, { useState } from 'react';
import { Project } from '../types';
import DemoModal from './DemoModal';

interface ProjectCardProps {
  project: Project;
  index: number;
  cardNumber?: number; // 1-6 for CSS stacking classes
}

const colorClassMap: Record<string, string> = {
  coral: 'orange',
  cyan: 'cyan',
  green: 'green',
  yellow: 'yellow',
  'light-cyan': 'blue',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, cardNumber }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const colorClass = colorClassMap[project.cardColor] || 'orange';
  const stackClass = cardNumber ? `_${cardNumber}` : '';

  return (
    <>
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`home_project-card ${stackClass}`}
        onClick={(e) => {
          if (project.liveUrl) {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
      >
        {/* Top: Image/Preview area */}
        <div className="home_project-contentholder">
          <span style={{ fontSize: '14px', opacity: 0.3, textTransform: 'uppercase' }}>
            {project.category}
          </span>
        </div>

        {/* Bottom: Ticket info with color */}
        <div className={`home_project-contentholder btm ${colorClass}`}>
          <div className="home_project-descholder">
            <h4 className="home_project-title">{project.title}</h4>
            <div className="home_project-group flex">
              <div>
                <h6>EPOCH:</h6>
                <h5>{project.epoch}</h5>
              </div>
              {project.metric && (
                <div>
                  <h6>METRIC:</h6>
                  <h5>{project.metric}</h5>
                </div>
              )}
              <img src="./assets/qr.svg" alt="" className="home_project-qr" />
            </div>
          </div>
          <div className="home_project-descholder right-wing">
            <img src="./assets/braille.svg" alt="" className="home_project-braille" />
          </div>
        </div>
      </a>

      {project.liveUrl && (
        <DemoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          url={project.liveUrl}
          title={project.title}
        />
      )}
    </>
  );
};

export default ProjectCard;
