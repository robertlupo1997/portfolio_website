import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CAROUSEL_PROJECTS } from '../constants';
import { useCarousel } from '../hooks/useCarousel';
import CarouselSlide from './CarouselSlide';
import HeroSlide from './HeroSlide';
import ActivitySlide from './ActivitySlide';
import SlideProgress from './SlideProgress';

interface CarouselProps {
  onRegisterGoTo?: (goTo: (index: number) => void) => void;
}

const Carousel: React.FC<CarouselProps> = ({ onRegisterGoTo }) => {
  const {
    activeIndex,
    next,
    prev,
    goTo,
    swipeHandlers,
  } = useCarousel({ totalSlides: CAROUSEL_PROJECTS.length + 2 });

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prevIndex = useRef(0);

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
      gsap.set(track, { x: `-${activeIndex * 100}vw`, filter: 'blur(0px)' });
      prevIndex.current = activeIndex;
      return;
    }

    const progress = { value: 0 };
    const targetX = activeIndex * 100;
    const startX = prevIndex.current * 100;

    gsap.to(progress, {
      value: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        const p = progress.value;
        const x = startX + (targetX - startX) * p;
        const blur = 4 * p * (1 - p) * 2.5;
        track.style.transform = `translateX(-${x}vw)`;
        track.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
      },
      onComplete: () => {
        track.style.filter = 'none';
      },
    });

    if (prevIndex.current !== activeIndex && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    prevIndex.current = activeIndex;
  }, [activeIndex]);

  return (
    <section className="carousel" id="projects" ref={sectionRef} {...swipeHandlers}>
      <div className="carousel-track" ref={trackRef}>
        <HeroSlide
          isActive={activeIndex === 0}
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
      <SlideProgress activeIndex={activeIndex} totalSlides={CAROUSEL_PROJECTS.length + 2} />
    </section>
  );
};

export default Carousel;
