import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <section className="section footer">
      {/* Top section - Contact */}
      <div className="footer_group">
        <div className="footer_email-wrapper">
          <div className="footer_hello-holder">
            <span className="footer_hello">Let's work together</span>
            <ArrowUpRight className="footer_arrow" size={32} strokeWidth={2} />
          </div>
          <a href={`mailto:${PERSONAL_INFO.email}`} className="footer_email">
            {PERSONAL_INFO.email}
          </a>
        </div>
        <div className="footer_social-handle">
          <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="footer_social">
            GitHub
          </a>
          <span className="footer_social-divider">/</span>
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="footer_social">
            LinkedIn
          </a>
          <span className="footer_social-divider">/</span>
          <a href={PERSONAL_INFO.huggingface} target="_blank" rel="noopener noreferrer" className="footer_social">
            HuggingFace
          </a>
        </div>
      </div>

      {/* Giant brand text */}
      <div className="footer_title-holder">
        <h1 className="footer_title">TREY</h1>
        <div className="footer_splitter dot"></div>
        <h1 className="footer_title">ML</h1>
      </div>

      {/* Bottom row - Copyright and Social */}
      <div className="footer_bottom">
        <div className="footer_copyright">©2025 Robert Lupo</div>
        <div className="footer_attribution">
          Design inspired by <a href="https://chrls.design" target="_blank" rel="noopener noreferrer">CHRLS.DSGN</a>
        </div>
      </div>
    </section>
  );
};

export default Footer;
