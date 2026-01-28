import React, { useEffect, useState } from 'react';
import TextScramble from './TextScramble';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after mount with slight delay
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Location tag at top left */}
      <span className={`hero-location ${isLoaded ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
        TAMPA, FL
      </span>

      {/* Main content - bottom aligned */}
      <div className="hero-content">
        <h1 className="hero-name">
          <span className="hero-name-line">
            <span className={`hero-name-text ${isLoaded ? 'animate' : ''}`} style={{ animationDelay: '0s' }}>
              <TextScramble
                text="TREY"
                triggerOnView={false}
                duration={1000}
                delay={200}
              />
            </span>
          </span>
          <span className="hero-name-line">
            <span className={`hero-name-text ${isLoaded ? 'animate' : ''}`} style={{ animationDelay: '0.1s' }}>
              <TextScramble
                text="LUPO"
                triggerOnView={false}
                duration={1000}
                delay={400}
              />
            </span>
          </span>
        </h1>

        <p className={`hero-role ${isLoaded ? 'animate' : ''}`} style={{ animationDelay: '0.3s' }}>
          Data Scientist & AI Builder
        </p>
      </div>

      {/* Scroll indicator */}
      <div className={`hero-scroll ${isLoaded ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
