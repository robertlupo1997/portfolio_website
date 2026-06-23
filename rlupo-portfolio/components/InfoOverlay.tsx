import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { SKILL_GROUPS, TIMELINE, PERSONAL_INFO } from '../constants';

interface InfoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);
  const hasOpened = useRef(false);
  const [copied, setCopied] = useState(false);

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
      hasOpened.current = true;
      el.style.visibility = 'visible';
      el.style.pointerEvents = 'auto';
      gsap.fromTo(el,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration, ease: 'expo.out' }
      );
    } else {
      if (!hasOpened.current) return;
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

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  };

  return (
    <div
      ref={overlayRef}
      className="info-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="About Trey Lupo"
      style={{ visibility: 'hidden', pointerEvents: 'none' }}
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

          <div className="info-section">
            <p className="info-prompt">$ contact --reach-out</p>
            <div className="info-contact">
              <div className="info-contact-statement">Let's build something.</div>
              <button
                className="info-contact-email"
                onClick={handleEmailClick}
                type="button"
                aria-live="polite"
              >
                {copied ? 'copied!' : PERSONAL_INFO.email}
              </button>
              <div className="info-contact-links">
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={PERSONAL_INFO.huggingface} target="_blank" rel="noopener noreferrer">HuggingFace</a>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="info-resume-link">Resume</a>
              </div>
              <div className="info-contact-colophon">
                <span>Design + Development · Trey Lupo</span>
                <span>Fonts · Departure Mono · Inter</span>
                <span>&copy;2026 Tampa, FL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoOverlay;
