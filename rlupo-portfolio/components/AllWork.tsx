import React, { useState, useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ALL_PROJECTS, PROJECT_CATEGORIES } from '../constants';
import { Project, ProjectCategory } from '../types';

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);

const AllWork: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [preview, setPreview] = useState<Project | null>(null);

  const canPreview = useMemo(
    () =>
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return ALL_PROJECTS;
    return ALL_PROJECTS.filter((p) => p.projectCategory === activeFilter);
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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cursor-follow preview: asymmetric x/y lag gives the trail organic inertia
  useEffect(() => {
    const el = previewRef.current;
    if (!el || !canPreview) return;

    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [canPreview]);

  return (
    <section className={`work ${isVisible ? 'work--visible' : ''}`} ref={sectionRef}>
      <h2 className="section-label">all work</h2>

      <div className="work-filters" role="group" aria-label="Filter projects">
        {PROJECT_CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            className={`work-filter ${activeFilter === key ? 'active' : ''}`}
            onClick={() => setActiveFilter(key)}
            aria-pressed={activeFilter === key}
          >
            {label.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="work-list" onMouseLeave={() => setPreview(null)}>
        {filtered.map((project, index) => (
          <a
            key={project.id}
            href={project.githubUrl || project.liveUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="work-item"
            style={{ transitionDelay: `${index * 0.06}s` } as React.CSSProperties}
            onMouseEnter={() => canPreview && setPreview(project)}
          >
            <span className="work-item-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="work-item-title">{project.title}</span>
            <span className="work-item-category">{project.category.toLowerCase()}</span>
            <span className="work-item-metric">{project.metric}</span>
            <span className="work-item-arrow"><ArrowIcon /></span>
          </a>
        ))}
      </div>

      <div
        ref={previewRef}
        className={`work-preview ${preview ? 'work-preview--visible' : ''}`}
        aria-hidden="true"
      >
        {preview && (preview.imageUrl ? (
          <img src={preview.imageUrl} alt="" />
        ) : (
          <div className="work-preview-panel">
            <span className="work-preview-metric">{preview.metric}</span>
            <span className="work-preview-category">{preview.category.toLowerCase()}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllWork;
