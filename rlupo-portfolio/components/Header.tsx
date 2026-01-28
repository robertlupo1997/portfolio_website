import React, { useEffect, useState, useRef } from 'react';
import { PERSONAL_INFO } from '../constants';

// Text scramble effect for nav items
const useNavScramble = (text: string, isActive: boolean) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const frameRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    const duration = 600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * text.length);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < revealedCount) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplayText(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isActive, text]);

  // Hover scramble
  const triggerHoverScramble = () => {
    const duration = 400;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * text.length);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < revealedCount) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplayText(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  };

  return { displayText, triggerHoverScramble };
};

const NavItem: React.FC<{ href: string; text: string; isExpanded: boolean; onClick?: () => void }> = ({
  href, text, isExpanded, onClick
}) => {
  const { displayText, triggerHoverScramble } = useNavScramble(text, isExpanded);

  return (
    <a
      href={href}
      className="valiente-nav-link"
      onMouseEnter={triggerHoverScramble}
      onClick={onClick}
    >
      {displayText}
    </a>
  );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const pastHero = window.scrollY > window.innerHeight * 0.5;
      setIsPastHero(pastHero);

      // Auto-collapse/expand nav based on scroll position (only on desktop)
      if (window.innerWidth > 1200 && !isMobileMenuOpen) {
        if (pastHero && isNavExpanded) {
          setIsNavExpanded(false);
        } else if (!pastHero && !isNavExpanded) {
          setIsNavExpanded(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isNavExpanded, isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  return (
    <>
      {/* Top bar - Logo center, info right */}
      <header className={`header-valiente ${isScrolled ? 'scrolled' : ''}`}>
        {/* Left: Navigation (desktop) */}
        <div className="header-left">
          <nav className={`valiente-nav ${isNavExpanded ? 'expanded' : 'collapsed'}`}>
            {isNavExpanded ? (
              <div className="valiente-nav-links">
                <NavItem href="#projects" text="PROJECTS" isExpanded={isNavExpanded} />
                <NavItem href="#about" text="ABOUT" isExpanded={isNavExpanded} />
                <NavItem href={`mailto:${PERSONAL_INFO.email}`} text="CONTACT" isExpanded={isNavExpanded} />
                <NavItem href="/resume.pdf" text="RESUME" isExpanded={isNavExpanded} />
              </div>
            ) : (
              <button className="valiente-hamburger" onClick={toggleNav} aria-label="Expand navigation">
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
              </button>
            )}
          </nav>
        </div>

        {/* Center: Logo */}
        <a href="#hero" className="header-logo-center" onClick={scrollToTop}>
          TREY.ML
        </a>

        {/* Right: Location + Contact button */}
        <div className="header-right">
          <span className="header-location">TAMPA, FL</span>
          <a href={`mailto:${PERSONAL_INFO.email}`} className="header-contact-btn">
            <span className="contact-btn-text">GET IN TOUCH</span>
            <span className="contact-btn-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </span>
          </a>
        </div>

        {/* Mobile hamburger */}
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

      {/* Mobile nav overlay */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#projects" onClick={handleNavClick}>Projects</a>
          <a href="#about" onClick={handleNavClick}>About</a>
          <a href={`mailto:${PERSONAL_INFO.email}`} onClick={handleNavClick}>Contact</a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" onClick={handleNavClick}>Resume</a>
        </nav>
      </div>
    </>
  );
};

export default Header;
