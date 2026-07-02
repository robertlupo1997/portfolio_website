import React, { useState, useEffect } from 'react';
import TextScramble from './TextScramble';

interface HeaderProps {
  onInfoClick: () => void;
  onProjectsClick: () => void;
  onAskClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onInfoClick, onProjectsClick, onAskClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="header">
        <span className="header-name">
          <TextScramble text="TREY LUPO" triggerOnView={false} triggerOnHover={true} duration={600} />
        </span>

        <nav className="header-nav">
          <button className="header-pill" onClick={onProjectsClick}>PROJECTS</button>
          <button className="header-pill" onClick={onInfoClick}>INFO</button>
          <button className="header-pill" onClick={onAskClick}>ASK ⌘K</button>
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
          <button onClick={() => { handleNavClick(); onProjectsClick(); }}>PROJECTS</button>
          <button onClick={() => { handleNavClick(); onInfoClick(); }}>INFO</button>
          <button onClick={() => { handleNavClick(); onAskClick(); }}>ASK</button>
        </nav>
      </div>
    </>
  );
};

export default Header;
