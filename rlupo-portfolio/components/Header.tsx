import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/New_York'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav className="nav">
        {/* Logo */}
        <a href="#" className="nav_logo">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <rect x="4" y="4" width="18" height="18" fill="#0f0f0f" />
            <rect x="28" y="4" width="18" height="18" fill="#ff6d1b" />
            <rect x="4" y="28" width="18" height="18" fill="#ff6d1b" />
            <rect x="28" y="28" width="18" height="18" fill="#0f0f0f" />
          </svg>
        </a>

        {/* Center barcode with time */}
        <div className="barcode_holder">
          <h3 className="barcode_avail">{currentTime} EST</h3>
          <img src="./assets/barcode.svg" alt="" className="barcode center" />
          <h3 className="barcode_time">AVLB: 2025</h3>
        </div>

        {/* Right nav group - desktop */}
        <div className="nav_group">
          <a href="#work" className="nav_link">Work</a>
          <a href="#about" className="nav_link">About</a>
          <a href="mailto:treylupo1197@gmail.com" className="nav_link">Contact</a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="nav_mobile-btn"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="nav_mobile-menu">
          <a href="#work" onClick={() => setIsMenuOpen(false)} className="nav_mobile-link">Work</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="nav_mobile-link">About</a>
          <a href="mailto:treylupo1197@gmail.com" onClick={() => setIsMenuOpen(false)} className="nav_mobile-link">Contact</a>
          <div className="nav_mobile-info">
            <p>{currentTime} EST</p>
            <p>AVAILABLE FOR WORK</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
