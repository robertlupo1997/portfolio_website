import React, { useEffect, useState } from 'react';

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'hero', label: 'HOME' },
  { id: 'projects', label: 'WORK' },
  { id: 'about', label: 'ABOUT' },
  { id: 'contact', label: 'CONTACT' },
];

const SectionPagination: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show pagination after scrolling past hero
      setIsVisible(window.scrollY > window.innerHeight * 0.5);

      // Find which section is in view
      let foundIndex = 0;
      SECTIONS.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            foundIndex = index;
          }
        }
      });
      setCurrentIndex(foundIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      goToSection(SECTIONS[currentIndex - 1].id);
    }
  };

  const goNext = () => {
    if (currentIndex < SECTIONS.length - 1) {
      goToSection(SECTIONS[currentIndex + 1].id);
    }
  };

  return (
    <div className={`section-pagination ${isVisible ? 'visible' : ''}`}>
      <button
        className="pagination-arrow pagination-arrow-prev"
        onClick={goPrev}
        disabled={currentIndex === 0}
        aria-label="Previous section"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15L12 9L6 15" />
        </svg>
      </button>

      <div className="pagination-counter">
        <span className="pagination-current">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="pagination-divider">/</span>
        <span className="pagination-total">{String(SECTIONS.length).padStart(2, '0')}</span>
      </div>

      <button
        className="pagination-arrow pagination-arrow-next"
        onClick={goNext}
        disabled={currentIndex === SECTIONS.length - 1}
        aria-label="Next section"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9L12 15L18 9" />
        </svg>
      </button>
    </div>
  );
};

export default SectionPagination;
