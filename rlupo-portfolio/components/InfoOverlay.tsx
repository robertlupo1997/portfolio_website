import React, { useEffect, useRef, useCallback } from 'react';
import { SKILL_GROUPS, TIMELINE } from '../constants';

interface InfoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="info-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="About Trey Lupo"
    >
      <button
        ref={closeRef}
        className="info-close"
        onClick={onClose}
        aria-label="Close info"
      >
        [ CLOSE ]
      </button>

      <div className="info-content">
        <div className="info-bio">
          <h2 className="info-name">TREY LUPO</h2>
          <p className="info-title">AI/ML Systems Engineer</p>

          <p className="info-text">
            Corporate FP&A Analyst at Franklin Street in Tampa. I build Python SDKs
            that replace manual Oracle exports, ML frameworks in Rust that ship with
            statistical rigor, and revenue models that actually reconcile across
            business lines.
          </p>

          <p className="info-text">
            Background: B.A. Statistics from USF, MIT Data Science certificate, and
            an AI engineering internship at Origin Construction. I write code that
            ships to production, not notebooks that sit in repos.
          </p>

          <div className="info-credentials">
            <span>B.A. Statistics · USF</span>
            <span>MIT Data Science Certificate</span>
          </div>
        </div>

        <div className="info-terminal">
          <div className="info-section">
            <p className="info-prompt">$ skills --list</p>
            {SKILL_GROUPS.map((group) => (
              <div key={group.label} className="info-skill-row">
                <span className="info-skill-label">{group.label}</span>
                <span className="info-skill-value">{group.items.join(' / ')}</span>
              </div>
            ))}
          </div>

          <div className="info-section">
            <p className="info-prompt">$ history --career</p>
            {TIMELINE.map((entry) => (
              <div key={entry.year} className="info-timeline-row">
                <span className="info-timeline-year">{entry.year}</span>
                <span className="info-timeline-title">
                  {entry.title}
                  {entry.current && <span className="info-current"> &lt;- CURRENT</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoOverlay;
