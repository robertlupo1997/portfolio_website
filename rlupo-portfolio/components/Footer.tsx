import React, { useState } from 'react';
import { PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  };

  const socialLinks = [
    { href: PERSONAL_INFO.github, label: 'GitHub' },
    { href: PERSONAL_INFO.linkedin, label: 'LinkedIn' },
    { href: PERSONAL_INFO.huggingface, label: 'HuggingFace' },
  ];

  return (
    <footer className="footer-giant" id="contact">
      {/* Giant name spanning viewport */}
      <div className="footer-giant-name">
        <span className="footer-name-text">TREY LUPO</span>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <span className="footer-location">TAMPA, FL</span>
          <span className="footer-divider">|</span>
          <span className="footer-year">&copy;{currentYear}</span>
        </div>

        <button
          className="footer-email-btn"
          onClick={handleEmailClick}
          type="button"
          title={copied ? 'Copied!' : 'Click to copy email'}
        >
          {copied ? 'Copied!' : PERSONAL_INFO.email}
        </button>

        <div className="footer-bottom-right">
          {socialLinks.map((link, index) => (
            <React.Fragment key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                {link.label}
              </a>
              {index < socialLinks.length - 1 && <span className="footer-divider">|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
