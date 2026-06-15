import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CAROUSEL_PROJECTS } from '../constants';
import { useCarousel } from '../hooks/useCarousel';
import CarouselSlide from './CarouselSlide';

interface CarouselProps {
  onRegisterGoTo?: (goTo: (index: number) => void) => void;
}

const Carousel: React.FC<CarouselProps> = ({ onRegisterGoTo }) => {
  const {
    activeIndex,
    isFirst,
    isLast,
    next,
    prev,
    goTo,
    swipeHandlers,
  } = useCarousel({ totalSlides: CAROUSEL_PROJECTS.length });

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prevIndex = useRef(0);

  useEffect(() => {
    if (onRegisterGoTo) onRegisterGoTo(goTo);
  }, [onRegisterGoTo, goTo]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    gsap.to(track, {
      x: `-${activeIndex * 100}vw`,
      duration: 0.35,
      ease: 'power3.out',
    });

    if (prevIndex.current !== activeIndex && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    prevIndex.current = activeIndex;
  }, [activeIndex]);

  return (
    <section className="carousel" id="projects" ref={sectionRef} {...swipeHandlers}>
      <div className="carousel-track" ref={trackRef}>
        {CAROUSEL_PROJECTS.map((project, i) => (
          <CarouselSlide
            key={project.id}
            project={project}
            index={i}
            isActive={i === activeIndex}
            onPrev={prev}
            onNext={next}
            isFirst={isFirst}
            isLast={isLast}
            activeIndex={activeIndex}
            totalSlides={CAROUSEL_PROJECTS.length}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
