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
      // Fallback to mailto
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  };

  const socialLinks = [
    { href: PERSONAL_INFO.github, label: 'GitHub' },
    { href: PERSONAL_INFO.linkedin, label: 'LinkedIn' },
    { href: PERSONAL_INFO.huggingface, label: 'HuggingFace' },
    { href: '/resume.pdf', label: 'Resume' },
  ];

  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <h2 className="footer-headline">
          LET'S<br />CONNECT
        </h2>

        <button
          className="footer-email"
          onClick={handleEmailClick}
          type="button"
          title={copied ? 'Copied!' : 'Click to copy email'}
        >
          {copied ? 'Copied!' : PERSONAL_INFO.email}
        </button>

        <div className="footer-links">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="footer-copyright">
          &copy; {currentYear} Trey Lupo
        </p>
      </div>
    </footer>
  );
};

export default Footer;
