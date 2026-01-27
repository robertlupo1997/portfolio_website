import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <a href="#hero" className="header-logo">
          TREY.ML
        </a>

        {/* Desktop nav */}
        <nav className="header-nav header-nav-desktop">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href={`mailto:${PERSONAL_INFO.email}`}>Contact</a>
          <a href="#" className="header-nav-resume">Resume</a>
        </nav>

        {/* Mobile hamburger button */}
        <button
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </header>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#projects" onClick={handleNavClick}>Projects</a>
          <a href="#about" onClick={handleNavClick}>About</a>
          <a href={`mailto:${PERSONAL_INFO.email}`} onClick={handleNavClick}>Contact</a>
          <a href="#" onClick={handleNavClick}>Resume</a>
        </nav>
      </div>
    </>
  );
};

export default Header;
