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
  const [isVisible, setIsVisible] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const exitAnimationTriggered = useRef(false);

  useEffect(() => {
    // Track animation state to prevent double-trigger in StrictMode
    let animationFrameId: number;
    let timeoutId: ReturnType<typeof setTimeout>;
    let isCancelled = false;

    // Simulate loading progress with easing (faster at start, slower near end)
    let currentProgress = 0;
    const duration = 2500; // Total duration in ms
    const startTime = Date.now();

    const updateProgress = () => {
      if (isCancelled) return;

      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Easing function: starts fast, slows down at end
      const eased = 1 - Math.pow(1 - t, 3);
      currentProgress = Math.round(eased * 100);

      setProgress(currentProgress);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        // Loading complete - trigger exit animation
        timeoutId = setTimeout(triggerExitAnimation, 200);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    // Cleanup function to prevent double-animation in StrictMode
    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  const triggerExitAnimation = () => {
    // Prevent double-trigger in StrictMode
    if (exitAnimationTriggered.current) return;
    exitAnimationTriggered.current = true;

    // Try GSAP animation, fallback to CSS transition if issues
    if (window.gsap && preloaderRef.current) {
      window.gsap.to(preloaderRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          setIsVisible(false);
          onComplete?.();
        }
      });
    } else {
      // Fallback - just hide
      setIsVisible(false);
      onComplete?.();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={preloaderRef}
      className="preloader"
      style={{
        backgroundColor: 'var(--black)',
        zIndex: 9999
      }}
    >
      {/* Logo in top-left */}
      <div
        ref={logoRef}
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
        ref={counterRef}
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
