import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ACTIVITY_LOG, ACTIVITY_SUMMARY } from '../constants';

interface ActivitySlideProps {
  isActive: boolean;
  onPrev: () => void;
  onNext: () => void;
  activeIndex: number;
  totalSlides: number;
}

const ActivitySlide: React.FC<ActivitySlideProps> = ({
  isActive,
  onPrev,
  onNext,
  activeIndex,
  totalSlides,
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !bodyRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lines = bodyRef.current.querySelectorAll('.terminal-line');
    gsap.fromTo(lines,
      { y: 6, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out', stagger: 0.06, delay: 0.1 }
    );
  }, [isActive]);

  return (
    <div className={`carousel-slide carousel-slide--no-image ${isActive ? 'carousel-slide--active' : ''}`}>
      <div className="carousel-slide-terminal">
        <div className="terminal-panel">
          <div className="terminal-header">
            <span className="terminal-index">LOG</span>
            <span className="terminal-epoch">'24–'26</span>
          </div>

          <div className={`terminal-body ${isActive ? 'terminal-body--active' : ''}`} ref={bodyRef}>
            <div className="terminal-line terminal-prompt">
              $ log --recent
            </div>

            {ACTIVITY_LOG.map((entry, i) => (
              <div key={i} className="terminal-line activity-row">
                <span className="activity-date">{entry.date}</span>
                <span className="activity-project">{entry.project}</span>
                <span className="activity-label">{entry.label}</span>
                <span className="activity-note">{entry.note}</span>
              </div>
            ))}

            <div className="terminal-line terminal-prompt" style={{ marginTop: 'var(--space-lg)' }}>
              $ uptime
            </div>
            <div className="terminal-line">
              <span className="terminal-caret">&gt; </span>
              {ACTIVITY_SUMMARY.duration} · {ACTIVITY_SUMMARY.projects} · {ACTIVITY_SUMMARY.languages}
            </div>
          </div>
        </div>
      </div>

      <div className="carousel-slide-footer">
        <nav className="carousel-nav" aria-label="Project navigation">
          <button className="carousel-btn" onClick={onPrev} aria-label="Previous slide">
            <span aria-hidden="true">&larr;</span> PREV
          </button>
          <span className="carousel-counter">
            {String(activeIndex).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>
          <button className="carousel-btn" onClick={onNext} aria-label="Next slide">
            NEXT <span aria-hidden="true">&rarr;</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ActivitySlide;
