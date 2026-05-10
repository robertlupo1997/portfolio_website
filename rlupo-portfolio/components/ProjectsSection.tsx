import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FeaturedProject from './FeaturedProject';
import WorkCard from './WorkCard';
import ProjectFilter from './ProjectFilter';
import TextScramble from './TextScramble';
import { FEATURED_PROJECTS, ALL_PROJECTS } from '../constants';
import { ProjectCategory } from '../types';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection: React.FC = () => {
  const allWorkRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return ALL_PROJECTS;
    return ALL_PROJECTS.filter(p => p.projectCategory === activeFilter);
  }, [activeFilter]);

  const counts = useMemo(() => ({
    all: ALL_PROJECTS.length,
    ml: ALL_PROJECTS.filter(p => p.projectCategory === 'ml').length,
    engineering: ALL_PROJECTS.filter(p => p.projectCategory === 'engineering').length,
    fpna: ALL_PROJECTS.filter(p => p.projectCategory === 'fpna').length,
  }), []);

  useEffect(() => {
    const el = allWorkRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = el.querySelectorAll('.work-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      }
    );

    return () => {
      ScrollTrigger.getAll().filter(t => t.trigger === el).forEach(t => t.kill());
    };
  }, [activeFilter]);

  return (
    <>
      <section className="section" id="projects">
        <div className="section-label">
          <TextScramble text="FEATURED WORK" triggerOnView={true} triggerOnHover={true} duration={1000} />
        </div>
        {FEATURED_PROJECTS.map((project, index) => (
          <FeaturedProject key={project.id} project={project} index={index} />
        ))}
      </section>

      <section className="section">
        <div className="section-label">
          <TextScramble text="ALL WORK" triggerOnView={true} triggerOnHover={true} duration={1000} />
        </div>
        <ProjectFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />
        <div className="work-grid" ref={allWorkRef} id="projects-grid" role="tabpanel">
          {filteredProjects.length === 0 ? (
            <p className="projects-empty-state">No projects in this category yet.</p>
          ) : (
            filteredProjects.map((project) => (
              <WorkCard key={project.id} project={project} />
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectsSection;
