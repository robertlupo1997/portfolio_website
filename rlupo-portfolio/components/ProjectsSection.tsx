import React, { useRef } from 'react';
import ProjectCard from './ProjectCard';
import { PROJECTS } from '../constants';
import { useMouseParallax } from '../hooks/useMouseParallax';

const ProjectsSection: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Add mouse parallax effect
  useMouseParallax(wrapperRef, 0.8);

  return (
    <section className="section project">
      <div className="home_project-track" id="track">
        <div className="home_project-wrapper" ref={wrapperRef}>
          {/* Background marquee - top */}
          <div className="home_project-bg first">
            <div className="home_project-bgtxtholder outline">
              <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
              <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
              <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
              <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
            </div>
          </div>

          {/* 3D Stacked Cards - static positioning via CSS */}
          <div className="home_project-content">
            {PROJECTS.slice(0, 6).map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                cardNumber={6 - index} // _6 is front, _1 is back
              />
            ))}
          </div>

          {/* Background marquee - bottom */}
          <div className="home_project-bg last">
            <div className="home_project-bgtxtholder outline">
              <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
              <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
              <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
              <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Reminder section */}
      <div className="home_project-reminder">
        <img src="./assets/reminder.gif" alt="" className="home_project-remindericon" loading="lazy" />
        <span className="home_project-remindertext">MORE PROJECTS IN TRAINING</span>
        <img src="./assets/reminder.gif" alt="" className="home_project-remindericon" loading="lazy" />
      </div>
    </section>
  );
};

export default ProjectsSection;
