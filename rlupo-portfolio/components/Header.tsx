import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';
import ThemeToggle from './ThemeToggle';
import MagneticButton from './MagneticButton';

const NAV_ITEMS = [
  { href: '#projects', text: 'PROJECTS' },
  { href: '#about', text: 'ABOUT' },
  { href: '#', text: 'BLOG', external: true },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el && (window as any).lenis) {
        (window as any).lenis.scrollTo(el);
      }
    }
  };

  const scrollToTop = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`nav ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="nav-left">
          {NAV_ITEMS.map(({ href, text, external }) => (
            <a
              key={text}
              href={href}
              className={`nav-link ${activeSection === href.slice(1) ? 'active' : ''}`}
              onClick={(e) => {
                if (!external) { e.preventDefault(); handleNavClick(href); }
              }}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {text}{external && <span className="external-indicator"> &#8599;</span>}
            </a>
          ))}
        </nav>

        <button className="nav-center" onClick={scrollToTop} type="button">
          TREY LUPO
        </button>

        <div className="nav-right">
          <MagneticButton
            href={`mailto:${PERSONAL_INFO.email}`}
            className="nav-cta"
          >
            GET IN TOUCH
          </MagneticButton>
          <ThemeToggle />
        </div>

        <button
          className={`hamburger-mobile ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </header>

      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {NAV_ITEMS.map(({ href, text }) => (
            <a key={text} href={href} onClick={() => handleNavClick(href)}>{text}</a>
          ))}
          <a href={`mailto:${PERSONAL_INFO.email}`} onClick={() => setIsMobileMenuOpen(false)}>CONTACT</a>
        </nav>
      </div>
    </>
  );
};

export default Header;
