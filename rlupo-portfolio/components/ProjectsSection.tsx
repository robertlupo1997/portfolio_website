import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from './ProjectCard';
import TextScramble from './TextScramble';
import { PROJECTS } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Parallax effect for cards at varying speeds
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Different parallax speeds based on position
      const speed = [0.15, 0.1, 0.2, 0.12, 0.18, 0.14][index % 6];

      gsap.to(card, {
        y: () => -window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section className="projects-scattered" id="projects" ref={sectionRef}>
      <div className="projects-header-scattered">
        <span className="projects-counter">[{String(PROJECTS.length).padStart(2, '0')}]</span>
        <TextScramble
          text="WORK"
          as="h2"
          className="projects-title-scattered"
          duration={1200}
          triggerOnView={true}
          threshold={0.5}
        />
      </div>

      <div className={`projects-grid-scattered ${hoveredIndex !== null ? 'has-hover' : ''}`}>
        {PROJECTS.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className={`project-card-wrapper project-card-wrapper-${index + 1} ${
              hoveredIndex !== null && hoveredIndex !== index ? 'dimmed' : ''
            } ${hoveredIndex === index ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <ProjectCard project={project} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
