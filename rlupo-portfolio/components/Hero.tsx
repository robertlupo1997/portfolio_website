import React, { useEffect, useState } from 'react';
import TextScramble from './TextScramble';
import MagneticButton from './MagneticButton';
import { PERSONAL_INFO } from '../constants';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 850);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-name-ghost">TREY LUPO</div>

      <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
        <div className="hero-hook">
          <span className="accent-amber">FP&amp;A Analyst.</span>
          <br />
          Builds production tools
          <br />
          with <span className="accent-blue">AI</span>.
        </div>

        <div className="hero-name-inline">
          <TextScramble text="TREY LUPO" triggerOnView={false} triggerOnHover={true} duration={800} delay={300} />
        </div>

        <div className="hero-status">
          <span className="status-dot" />
          Currently: Building nspb-api &middot; Open to AI/ML roles &middot; Tampa / Remote
        </div>

        <div className="hero-ctas">
          <MagneticButton href="#projects" className="btn-primary">
            SEE THE WORK
          </MagneticButton>
          <MagneticButton href={PERSONAL_INFO.github} className="btn-outline" external>
            GITHUB &rarr;
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};

export default Hero;
