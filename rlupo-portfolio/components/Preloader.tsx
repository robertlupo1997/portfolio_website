import React, { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    gsap: any;
  }
}

interface PreloaderProps {
  onComplete?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const duration = 2500;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const currentProgress = Math.round(eased * 100);

      setProgress(currentProgress);

      if (t < 1) {
        requestAnimationFrame(updateProgress);
      } else if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        // Trigger exit via state change
        setTimeout(() => setIsExiting(true), 200);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  // Handle exit animation completion
  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 800); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isExiting, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={preloaderRef}
      className="preloader"
      style={{
        backgroundColor: 'var(--black)',
        zIndex: 9999,
        transform: isExiting ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)'
      }}
    >
      {/* Logo in top-left */}
      <div
        className="preloader_logo"
        style={{
          position: 'absolute',
          top: '2.25rem',
          left: '3.125rem'
        }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 0L31.7 8.3L41.5 8.5L33.2 15.2L35.4 25L25 18.3L14.6 25L16.8 15.2L8.5 8.5L18.3 8.3L25 0Z" fill="var(--white-smoke)"/>
          <path d="M25 50L18.3 41.7L8.5 41.5L16.8 34.8L14.6 25L25 31.7L35.4 25L33.2 34.8L41.5 41.5L31.7 41.7L25 50Z" fill="var(--white-smoke)"/>
          <circle cx="25" cy="25" r="6" fill="var(--coral)"/>
        </svg>
      </div>

      {/* Counter in bottom-right */}
      <div
        className="preloader_num"
        style={{
          color: 'var(--white-smoke)',
          position: 'absolute',
          bottom: '2rem',
          right: '3.125rem',
          fontFamily: "'Space Mono', monospace",
          fontSize: '32px',
          fontWeight: 700
        }}
      >
        <span className="preloader_span">{progress}</span>
      </div>

      {/* Subtle progress indicator line at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${progress}%`,
          height: '2px',
          backgroundColor: 'var(--coral)',
          transition: 'width 0.1s ease-out'
        }}
      />
    </div>
  );
};

export default Preloader;
