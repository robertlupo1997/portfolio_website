import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from './TextScramble';

gsap.registerPlugin(ScrollTrigger);

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const showAnim = gsap.from(header, {
      yPercent: -100,
      paused: true,
      duration: 0.3,
      ease: 'power2.out',
    }).progress(1);

    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        self.direction === -1 ? showAnim.play() : showAnim.reverse();
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="header" ref={headerRef}>
        <a href="#hero" className="header-name">
          <TextScramble text="Trey Lupo" triggerOnView={false} triggerOnHover={true} duration={600} />
        </a>

        <nav className="header-nav">
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#about" className="nav-link">Info</a>
        </nav>

        <button
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </header>

      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#projects" onClick={handleNavClick}>Projects</a>
          <a href="#about" onClick={handleNavClick}>Info</a>
        </nav>
      </div>
    </>
  );
};

export default Header;
