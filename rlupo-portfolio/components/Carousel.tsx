import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CAROUSEL_PROJECTS } from '../constants';
import { useCarousel } from '../hooks/useCarousel';
import CarouselSlide from './CarouselSlide';
import HeroSlide from './HeroSlide';

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
  } = useCarousel({ totalSlides: CAROUSEL_PROJECTS.length + 1 });

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prevIndex = useRef(0);

  useEffect(() => {
    if (onRegisterGoTo) onRegisterGoTo(goTo);
  }, [onRegisterGoTo, goTo]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const delta = Math.abs(activeIndex - prevIndex.current);
    const isWrap = delta > 1;

    gsap.to(track, {
      x: `-${activeIndex * 100}vw`,
      duration: isWrap ? 0 : 0.35,
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
        <HeroSlide
          isActive={activeIndex === 0}
          onPrev={prev}
          onNext={next}
          activeIndex={activeIndex}
          totalSlides={CAROUSEL_PROJECTS.length + 1}
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
            totalSlides={CAROUSEL_PROJECTS.length + 1}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
