import React, { useEffect, useState } from 'react';
import TextScramble from './TextScramble';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Main content - bottom aligned */}
      <div className="hero-content">
        <h1 className="hero-name">
          <span className="hero-name-line">
            <span className={`hero-name-text ${isLoaded ? 'animate' : ''}`} style={{ animationDelay: '0s' }}>
              <TextScramble
                text="TREY"
                triggerOnView={false}
                triggerOnHover={true}
                duration={800}
                delay={300}
              />
            </span>
          </span>
          <span className="hero-name-line">
            <span className={`hero-name-text ${isLoaded ? 'animate' : ''}`} style={{ animationDelay: '0.1s' }}>
              <TextScramble
                text="LUPO"
                triggerOnView={false}
                triggerOnHover={true}
                duration={800}
                delay={500}
              />
            </span>
          </span>
        </h1>

        <p className={`hero-role ${isLoaded ? 'animate' : ''}`} style={{ animationDelay: '0.3s' }}>
          FP&A Analyst · Data Scientist
        </p>
      </div>

    </section>
  );
};

export default Hero;
