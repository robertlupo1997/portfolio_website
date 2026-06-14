import React, { useState, useEffect } from 'react';
import TextScramble from './TextScramble';

interface HeaderProps {
  onInfoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onInfoClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="header">
        <a href="#projects" className="header-name">
          <TextScramble text="TREY LUPO" triggerOnView={false} triggerOnHover={true} duration={600} />
        </a>

        <nav className="header-nav">
          <a href="#projects" className="header-pill">PROJECTS</a>
          <button className="header-pill" onClick={onInfoClick}>INFO</button>
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
          <a href="#projects" onClick={handleNavClick}>PROJECTS</a>
          <button onClick={() => { handleNavClick(); onInfoClick(); }}>INFO</button>
        </nav>
      </div>
    </>
  );
};

export default Header;
