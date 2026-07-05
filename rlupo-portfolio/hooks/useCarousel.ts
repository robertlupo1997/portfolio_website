import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCarouselOptions {
  totalSlides: number;
  transitionDuration?: number;
}

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
  isDragging: boolean;
}

export const useCarousel = ({ totalSlides, transitionDuration = 350 }: UseCarouselOptions) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const swipeRef = useRef<SwipeState>({ startX: 0, startY: 0, startTime: 0, isDragging: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(0 as any);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    const clamped = Math.max(0, Math.min(totalSlides - 1, index));
    setIsTransitioning(true);
    setActiveIndex(clamped);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [isTransitioning, totalSlides, transitionDuration]);

  const next = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(prev => prev === totalSlides - 1 ? 0 : prev + 1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [isTransitioning, totalSlides, transitionDuration]);

  const prev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(prev => prev === 0 ? totalSlides - 1 : prev - 1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [isTransitioning, totalSlides, transitionDuration]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    swipeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      isDragging: true,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const { startX, startTime, isDragging } = swipeRef.current;
    if (!isDragging) return;
    swipeRef.current.isDragging = false;

    const deltaX = e.clientX - startX;
    const elapsed = Date.now() - startTime;
    const velocity = Math.abs(deltaX) / elapsed;
    const SWIPE_THRESHOLD = 50;
    const VELOCITY_THRESHOLD = 0.11;

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      if (deltaX < 0) next();
      else prev();
    }
  }, [next, prev]);

  const onPointerCancel = useCallback(() => {
    swipeRef.current.isDragging = false;
  }, []);

  return {
    activeIndex,
    isTransitioning,
    next,
    prev,
    goTo,
    containerRef,
    swipeHandlers: { onPointerDown, onPointerUp, onPointerCancel },
  };
};
