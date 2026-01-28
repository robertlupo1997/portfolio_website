import React, { useState, useRef, useEffect } from 'react';
import { PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const textRef = useRef<SVGTextElement>(null);

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

  // Resize text to fit viewport
  useEffect(() => {
    const resizeText = () => {
      if (textRef.current && footerRef.current) {
        const containerWidth = footerRef.current.offsetWidth;
        const textBBox = textRef.current.getBBox();
        const scaleFactor = (containerWidth - 48) / textBBox.width; // 48px for padding
        textRef.current.style.transform = `scale(${scaleFactor})`;
        textRef.current.style.transformOrigin = 'left center';
      }
    };

    resizeText();
    window.addEventListener('resize', resizeText);
    return () => window.removeEventListener('resize', resizeText);
  }, []);

  const socialLinks = [
    { href: PERSONAL_INFO.github, label: 'GitHub' },
    { href: PERSONAL_INFO.linkedin, label: 'LinkedIn' },
    { href: PERSONAL_INFO.huggingface, label: 'HuggingFace' },
  ];

  return (
    <footer className="footer-giant" id="contact" ref={footerRef}>
      {/* Giant name spanning viewport */}
      <div className="footer-giant-name">
        <svg className="footer-name-svg" viewBox="0 0 1000 120" preserveAspectRatio="xMinYMid meet">
          <text
            ref={textRef}
            x="0"
            y="95"
            className="footer-name-text"
            fill="var(--text-primary)"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '110px', letterSpacing: '-0.03em' }}
          >
            TREY LUPO
          </text>
        </svg>
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
