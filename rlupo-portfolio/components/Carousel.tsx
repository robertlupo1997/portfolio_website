import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CAROUSEL_PROJECTS } from '../constants';
import { useCarousel } from '../hooks/useCarousel';
import CarouselSlide from './CarouselSlide';
import HeroSlide from './HeroSlide';
import ActivitySlide from './ActivitySlide';
import SlideProgress from './SlideProgress';
const VizCanvas = React.lazy(() =>
  import('./viz/VizCanvas').then((m) => ({ default: m.VizCanvas })),
);

interface CarouselProps {
  onRegisterGoTo?: (goTo: (index: number) => void) => void;
  loaded?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({ onRegisterGoTo, loaded = false }) => {
  const {
    activeIndex,
    next,
    prev,
    goTo,
    swipeHandlers,
  } = useCarousel({ totalSlides: CAROUSEL_PROJECTS.length + 2, transitionDuration: 650 });

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prevIndex = useRef(0);

  const [contextLost, setContextLost] = useState(false);
  const [transitionVelocity, setTransitionVelocity] = useState(0);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const vizProjectIndex = activeIndex - 1;
  const activeVizParams =
    vizProjectIndex >= 0 && vizProjectIndex < CAROUSEL_PROJECTS.length
      ? (CAROUSEL_PROJECTS[vizProjectIndex].vizParams ?? null)
      : null;

  useEffect(() => {
    if (onRegisterGoTo) onRegisterGoTo(goTo);
  }, [onRegisterGoTo, goTo]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delta = Math.abs(activeIndex - prevIndex.current);
    const isWrap = delta > 1;

    // delta === 0 covers initial mount: snap into place, no blur pulse on a non-move.
    if (prefersReducedMotion || isWrap || delta === 0) {
      track.style.transform = `translateX(-${activeIndex * 100}vw)`;
      track.style.filter = 'none';
      prevIndex.current = activeIndex;
      return;
    }

    const progress = { value: 0 };
    const targetX = activeIndex * 100;
    const startX = prevIndex.current * 100;

    const tween = gsap.to(progress, {
      value: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        const p = progress.value;
        const x = startX + (targetX - startX) * p;
        const blur = 4 * p * (1 - p) * 2.5;
        track.style.transform = `translateX(-${x}vw)`;
        track.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
        const vel = 4 * p * (1 - p);
        setTransitionVelocity(vel);
      },
      onComplete: () => {
        track.style.filter = 'none';
        setTransitionVelocity(0);
      },
    });

    if (prevIndex.current !== activeIndex && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    prevIndex.current = activeIndex;

    return () => { tween.kill(); };
  }, [activeIndex]);

  return (
    <section
      className="carousel"
      id="projects"
      ref={sectionRef}
      style={{ position: 'relative' }}
      {...swipeHandlers}
    >
      <div className="carousel-track" ref={trackRef}>
        <HeroSlide
          isActive={activeIndex === 0}
          revealReady={loaded}
          onPrev={prev}
          onNext={next}
          activeIndex={activeIndex}
          totalSlides={CAROUSEL_PROJECTS.length + 2}
        />
        {CAROUSEL_PROJECTS.map((project, i) => (
          <CarouselSlide
            key={project.id}
            project={project}
            index={i}
            isActive={i + 1 === activeIndex}
            onPrev={prev}
            onNext={next}
            activeIndex={activeIndex}
            totalSlides={CAROUSEL_PROJECTS.length + 2}
            useFallback={contextLost}
          />
        ))}
        <ActivitySlide
          isActive={activeIndex === CAROUSEL_PROJECTS.length + 1}
          onPrev={prev}
          onNext={next}
          activeIndex={activeIndex}
          totalSlides={CAROUSEL_PROJECTS.length + 2}
        />
      </div>
      {!prefersReducedMotion && (
        <div className="viz-canvas-region">
          <React.Suspense fallback={null}>
            <VizCanvas
              params={activeVizParams}
              loaded={loaded}
              transitionVelocity={transitionVelocity}
              onFallback={() => setContextLost(true)}
            />
          </React.Suspense>
        </div>
      )}
      <SlideProgress activeIndex={activeIndex} totalSlides={CAROUSEL_PROJECTS.length + 2} />
    </section>
  );
};

export default Carousel;
