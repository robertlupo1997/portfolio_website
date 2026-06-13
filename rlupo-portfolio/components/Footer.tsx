import React, { useState } from 'react';
import { PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer-statement">
        Let's build something.
      </div>

      <div className="footer-grid">
        <div className="footer-col">
          <button
            className="footer-email"
            onClick={handleEmailClick}
            type="button"
            aria-live="polite"
          >
            {copied ? 'copied!' : PERSONAL_INFO.email}
          </button>
        </div>

        <div className="footer-col">
          <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href={PERSONAL_INFO.huggingface} target="_blank" rel="noopener noreferrer" className="footer-link">HuggingFace</a>
        </div>
      </div>

      <div className="footer-colophon">
        <span className="footer-label">Design + Development · Trey Lupo</span>
        <span className="footer-label">Fonts · Space Grotesk · Inter · JetBrains Mono</span>
        <span className="footer-label">©2026 Tampa, FL</span>
      </div>
    </footer>
  );
};

export default Footer;
