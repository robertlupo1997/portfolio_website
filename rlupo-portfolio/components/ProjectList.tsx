import React, { useState, useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FEATURED_PROJECTS, ALL_PROJECTS, PROJECT_CATEGORIES } from '../constants';
import { Project, ProjectCategory } from '../types';
import LineReveal from './LineReveal';

const ALL = [...FEATURED_PROJECTS, ...ALL_PROJECTS];

const ProjectList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [preview, setPreview] = useState<Project | null>(null);

  const canPreview = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return ALL;
    return ALL.filter((p) => p.projectCategory === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || !canPreview) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });
    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [canPreview]);

  return (
    <section
      className={`folio ${isVisible ? 'folio--visible' : ''}`}
      id="projects"
      ref={sectionRef}
    >
      <div className="folio-header">
        <h2 className="section-label">Folio /2026</h2>
        <div className="folio-filters" role="group" aria-label="Filter projects">
          {PROJECT_CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              className={`folio-filter ${activeFilter === key ? 'active' : ''}`}
              onClick={() => setActiveFilter(key)}
              aria-pressed={activeFilter === key}
            >
              {label.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="folio-list" onMouseLeave={() => setPreview(null)}>
        {filtered.map((project, index) => (
          <a
            key={project.id}
            href={project.githubUrl || project.liveUrl || '#'}
            target={project.githubUrl || project.liveUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="folio-entry"
            style={{ transitionDelay: `${index * 0.04}s` } as React.CSSProperties}
            onMouseEnter={() => canPreview && setPreview(project)}
          >
            <span className="folio-index">P/{String(index + 1).padStart(2, '0')}</span>
            <span className="folio-year">{project.epoch}</span>
            <LineReveal as="span" className="folio-title">{project.title}</LineReveal>
            <span className="folio-category">{project.category}</span>
            <span className="folio-metric">{project.metric}</span>
          </a>
        ))}
      </div>

      <div
        ref={previewRef}
        className={`folio-preview ${preview ? 'folio-preview--visible' : ''}`}
        aria-hidden="true"
      >
        {preview && (preview.imageUrl ? (
          <img src={preview.imageUrl} alt="" />
        ) : (
          <div className="folio-preview-panel">
            <span className="folio-preview-metric">{preview.metric}</span>
            <span className="folio-preview-category">{preview.category}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectList;
