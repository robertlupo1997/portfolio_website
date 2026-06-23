import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { CAROUSEL_PROJECTS } from '../constants';

interface ProjectsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSlide: (index: number) => void;
}

const ProjectsOverlay: React.FC<ProjectsOverlayProps> = ({ isOpen, onClose, onGoToSlide }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();

    if (e.key === 'Tab' && overlayRef.current) {
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      returnRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      returnRef.current?.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 0 : 0.3;

    if (isOpen) {
      el.style.visibility = 'visible';
      el.style.pointerEvents = 'auto';
      gsap.fromTo(el,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration, ease: 'expo.out' }
      );
    } else {
      gsap.to(el, {
        opacity: 0,
        y: 8,
        duration: prefersReducedMotion ? 0 : 0.25,
        ease: 'expo.out',
        onComplete: () => {
          el.style.visibility = 'hidden';
          el.style.pointerEvents = 'none';
        },
      });
    }
  }, [isOpen]);

  const handleRowClick = (index: number) => {
    onGoToSlide(index + 1);
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="projects-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="All projects"
      aria-hidden={!isOpen}
      style={{ visibility: 'hidden', pointerEvents: 'none' }}
    >
      <button
        ref={closeRef}
        className="projects-close"
        onClick={onClose}
        aria-label="Close projects"
      >
        [ CLOSE ]
      </button>

      <div className="projects-content">
        <h2 className="projects-header">PROJECTS /2024–26</h2>

        <div className="projects-list">
          {CAROUSEL_PROJECTS.map((project, i) => {
            const url = project.githubUrl || project.liveUrl;
            return (
              <div
                key={project.id}
                className="projects-row"
                role="button"
                tabIndex={0}
                onClick={() => handleRowClick(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick(i); } }}
              >
                <span className="projects-index">P/{String(i + 1).padStart(2, '0')}</span>
                <span className="projects-title">{project.title}</span>
                <span className="projects-category">{project.category}</span>
                <span className="projects-metric">{project.metric}</span>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="projects-arrow"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Open ${project.title} in new tab`}
                  >
                    -&gt;
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsOverlay;
