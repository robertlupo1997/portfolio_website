import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CAROUSEL_PROJECTS } from '../constants';

const BOOT_DURATION = 1400;
const HOLD_DURATION = 350;
const FADE_DURATION = 300;

// Every line is true: 8 projects in the carousel, 4 viz archetypes
// (lattice / wavefield / particleflow / wireframe), and the Ask corpus.
const BOOT_LINES: { at: number; text: string }[] = [
  { at: 0.18, text: `projects: ${CAROUSEL_PROJECTS.length} mounted` },
  { at: 0.52, text: 'viz: 4 archetypes compiled' },
  { at: 0.82, text: 'ask: corpus indexed' },
];

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [counter, setCounter] = useState('0%');
  const [visibleLines, setVisibleLines] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const [phase, setPhase] = useState<'booting' | 'ready' | 'fading' | 'done'>('booting');
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const finishBoot = useCallback(() => {
    setShowReady(true);
    setPhase('ready');
    setTimeout(() => {
      setPhase('fading');
      setTimeout(() => {
        document.documentElement.style.overflow = '';
        setPhase('done');
        onComplete();
      }, FADE_DURATION);
    }, HOLD_DURATION);
  }, [onComplete]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      onComplete();
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    startRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / BOOT_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounter(`${Math.floor(eased * 100)}%`);
      setVisibleLines(BOOT_LINES.filter((l) => eased >= l.at).length);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        finishBoot();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      document.documentElement.style.overflow = '';
    };
  }, [finishBoot, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className="preloader"
      style={{ opacity: phase === 'fading' ? 0 : 1 }}
      aria-hidden="true"
    >
      <div className="preloader-terminal">
        <span className="preloader-line">$ boot treylupo.com</span>
        {BOOT_LINES.slice(0, visibleLines).map((line) => (
          <span key={line.text} className="preloader-line">{line.text}</span>
        ))}
        <span className="preloader-line preloader-counter">{counter}</span>
        {showReady && (
          <span className="preloader-line preloader-ready">
            READY.<span className="cursor-blink" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Preloader;
