import React, { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { FEATURED_PROJECTS, ALL_PROJECTS } from '../constants';
import { Project } from '../types';

const ALL = [...FEATURED_PROJECTS, ...ALL_PROJECTS];

const ProjectList: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = React.useState<Project | null>(null);

  const canPreview = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

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
    <section className="folio" id="projects">
      <div className="folio-header">
        <h2 className="section-label">Folio /2026</h2>
      </div>

      <div className="folio-list" onMouseLeave={() => setPreview(null)}>
        {ALL.map((project, index) => (
          <a
            key={project.id}
            href={project.githubUrl || project.liveUrl || '#'}
            target={project.githubUrl || project.liveUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="folio-entry"
            onMouseEnter={() => canPreview && setPreview(project)}
          >
            <div className="folio-entry-left">
              <span className="folio-index">P/{String(index + 1).padStart(2, '0')}</span>
              <span className="folio-year">{project.epoch}</span>
            </div>

            <div className="folio-entry-main">
              <span className="folio-title">{project.title}</span>
              {project.imageUrl && (
                <div className="folio-thumb">
                  <img src={project.imageUrl} alt="" loading="lazy" />
                </div>
              )}
            </div>

            <div className="folio-entry-right">
              <span className="folio-category">{project.category}</span>
              <span className="folio-metric">{project.metric}</span>
            </div>
          </a>
        ))}
      </div>

      <div
        ref={previewRef}
        className={`folio-preview ${preview && !preview.imageUrl ? 'folio-preview--visible' : ''}`}
        aria-hidden="true"
      >
        {preview && !preview.imageUrl && (
          <div className="folio-preview-panel">
            <span className="folio-preview-metric">{preview.metric}</span>
            <span className="folio-preview-category">{preview.category}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectList;
