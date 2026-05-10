import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PERSONAL_INFO, MANIFESTO_LINES } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const ManifestoFooter: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const el = manifestoRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lines = el.querySelectorAll('.manifesto-line');
    gsap.fromTo(lines,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );

    return () => {
      ScrollTrigger.getAll().filter(t => t.trigger === el).forEach(t => t.kill());
    };
  }, []);

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
      <div className="manifesto" ref={manifestoRef}>
        {MANIFESTO_LINES.map((line) => (
          <div key={line} className="manifesto-line">{line}</div>
        ))}
      </div>

      <div className="footer-top">
        <div className="footer-message">
          Available for AI/ML roles and FP&A automation consulting.
        </div>
        <div className="footer-links">
          <a href={PERSONAL_INFO.github} className="footer-link" target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href={PERSONAL_INFO.linkedin} className="footer-link" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href={PERSONAL_INFO.huggingface} className="footer-link" target="_blank" rel="noopener noreferrer">HUGGING FACE</a>
        </div>
      </div>

      <div className="footer-bottom">
        <button className="footer-email" onClick={handleEmailClick} type="button" title={copied ? 'Copied!' : 'Click to copy email'}>
          {copied ? 'Copied!' : PERSONAL_INFO.email}
        </button>
        <span className="footer-copy">&copy; {currentYear} Trey Lupo</span>
      </div>
    </footer>
  );
};

export default ManifestoFooter;
