import React, { useEffect, useRef, useState, useCallback } from 'react';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const COUNT_DURATION = 2400;
const SCRAMBLE_DURATION = 600;
const FADE_DURATION = 300;

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [counter, setCounter] = useState('0%');
  const [phase, setPhase] = useState<'counting' | 'scrambling' | 'fading' | 'done'>('counting');
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const scramble = useCallback(() => {
    setPhase('scrambling');
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / SCRAMBLE_DURATION, 1);

      if (progress < 1) {
        const len = 3 + Math.floor(Math.random() * 3);
        let chars = '';
        for (let i = 0; i < len; i++) {
          chars += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        setCounter(chars);
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCounter('');
        setPhase('fading');
        setTimeout(() => {
          document.documentElement.style.overflow = '';
          setPhase('done');
          onComplete();
        }, FADE_DURATION);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
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
      const progress = Math.min(elapsed / COUNT_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * 100);

      setCounter(`${value}%`);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        scramble();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      document.documentElement.style.overflow = '';
    };
  }, [scramble, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      ref={containerRef}
      className="preloader"
      style={{ opacity: phase === 'fading' ? 0 : 1 }}
      aria-hidden="true"
    >
      <span className="preloader-counter">{counter}</span>
    </div>
  );
};

export default Preloader;
