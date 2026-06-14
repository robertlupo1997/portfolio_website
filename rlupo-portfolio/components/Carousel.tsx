import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FEATURED_PROJECTS } from '../constants';
import { useCarousel } from '../hooks/useCarousel';
import CarouselSlide from './CarouselSlide';

const Carousel: React.FC = () => {
  const {
    activeIndex,
    isFirst,
    isLast,
    next,
    prev,
    goTo,
    swipeHandlers,
  } = useCarousel({ totalSlides: FEATURED_PROJECTS.length });

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prevIndex = useRef(0);

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
        {FEATURED_PROJECTS.map((project, i) => (
          <CarouselSlide
            key={project.id}
            project={project}
            index={i}
            isActive={i === activeIndex}
          />
        ))}
      </div>

      <nav className="carousel-nav" aria-label="Project navigation">
        <button
          className="carousel-btn"
          onClick={prev}
          disabled={isFirst}
          aria-label="Previous project"
        >
          PREV
        </button>

        <div className="carousel-dots">
          {FEATURED_PROJECTS.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === activeIndex ? 'carousel-dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>

        <button
          className="carousel-btn"
          onClick={next}
          disabled={isLast}
          aria-label="Next project"
        >
          NEXT
        </button>
      </nav>
    </section>
  );
};

export default Carousel;
