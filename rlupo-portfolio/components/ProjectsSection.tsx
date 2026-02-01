import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';
import TextScramble from './TextScramble';
import { PROJECTS } from '../constants';
import { ProjectCategory } from '../types';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const magnetStrength = 0.08; // Subtle magnetism strength

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return PROJECTS;
    return PROJECTS.filter(p => p.projectCategory === activeFilter);
  }, [activeFilter]);

  // Calculate counts for each category
  const counts = useMemo(() => ({
    all: PROJECTS.length,
    ml: PROJECTS.filter(p => p.projectCategory === 'ml').length,
    analytics: PROJECTS.filter(p => p.projectCategory === 'analytics').length,
    fpna: PROJECTS.filter(p => p.projectCategory === 'fpna').length,
  }), []);

  // Magnetism effect handler
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magnetStrength;
    const deltaY = (e.clientY - centerY) * magnetStrength;

    gsap.to(card, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const handleCardMouseLeave = useCallback((index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
    setHoveredIndex(null);
  }, []);

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
        <span className="projects-counter">[{String(filteredProjects.length).padStart(2, '0')}]</span>
        <TextScramble
          text="WORK"
          as="h2"
          className="projects-title-scattered"
          duration={1200}
          triggerOnView={true}
          threshold={0.5}
        />
      </div>

      <ProjectFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      <div id="projects-grid" className={`projects-grid-scattered ${hoveredIndex !== null ? 'has-hover' : ''}`} role="tabpanel">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className={`project-card-wrapper project-card-wrapper-${index + 1} ${
              hoveredIndex !== null && hoveredIndex !== index ? 'dimmed' : ''
            } ${hoveredIndex === index ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseMove={(e) => handleCardMouseMove(e, index)}
            onMouseLeave={() => handleCardMouseLeave(index)}
          >
            <ProjectCard project={project} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
