import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsPastHero(window.scrollY > window.innerHeight * 0.8);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top header with logo */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <a href="#hero" className="header-logo">
          TREY.ML
        </a>

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

      {/* Left vertical navigation */}
      <nav className={`vertical-nav ${isPastHero ? 'collapsed' : ''}`}>
        <div className="vertical-nav-links">
          <a href="#projects" className="vertical-nav-link">
            <span className="vertical-nav-number">01</span>
            <span className="vertical-nav-text">PROJECTS</span>
          </a>
          <a href="#about" className="vertical-nav-link">
            <span className="vertical-nav-number">02</span>
            <span className="vertical-nav-text">ABOUT</span>
          </a>
          <a href={`mailto:${PERSONAL_INFO.email}`} className="vertical-nav-link">
            <span className="vertical-nav-number">03</span>
            <span className="vertical-nav-text">CONTACT</span>
          </a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="vertical-nav-link">
            <span className="vertical-nav-number">04</span>
            <span className="vertical-nav-text">RESUME</span>
          </a>
        </div>
      </nav>

      {/* Collapsed hamburger nav (shows after scrolling past hero) */}
      <button
        className={`collapsed-menu-btn ${isPastHero && !isMobileMenuOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <span className="collapsed-menu-line" />
        <span className="collapsed-menu-line" />
        <span className="collapsed-menu-line" />
      </button>

      {/* Scroll to top button */}
      <button
        className={`scroll-to-top ${isScrolled ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15L12 9L6 15" />
        </svg>
      </button>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#projects" onClick={handleNavClick}>
            <span className="mobile-nav-number">01</span>
            Projects
          </a>
          <a href="#about" onClick={handleNavClick}>
            <span className="mobile-nav-number">02</span>
            About
          </a>
          <a href={`mailto:${PERSONAL_INFO.email}`} onClick={handleNavClick}>
            <span className="mobile-nav-number">03</span>
            Contact
          </a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" onClick={handleNavClick}>
            <span className="mobile-nav-number">04</span>
            Resume
          </a>
        </nav>
      </div>
    </>
  );
};

export default Header;
