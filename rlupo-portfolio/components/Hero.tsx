import React, { useState, useEffect, useRef } from 'react';
import { useLayeredParallax } from '../hooks/useLayeredParallax';
import MagneticText from './MagneticText';

const Hero: React.FC = () => {
  const [time, setTime] = useState('');
  const heroRef = useRef<HTMLElement>(null);

  // Zajno-style layered parallax
  // Speed: <1 = slow (background), >1 = fast (foreground)
  useLayeredParallax(heroRef, [
    { selector: '.hero_title-holder', speed: 0.3, maxOffset: 8 },    // Slowest - feels far back
    { selector: '.hero_label-wrapper', speed: 0.6, maxOffset: 12 },  // Middle layer
    { selector: '.hero_barcode-bar', speed: 1.0, maxOffset: 18 },    // Fastest - feels close
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={heroRef} className="section hero">
      {/* Giant Title */}
      <div className="hero_title-holder">
        <h1 className="hero_title">TREY</h1>
        <div className="hero_splitter"></div>
        <h1 className="hero_title">ML</h1>
      </div>

      {/* Orange Info Box - 3 columns */}
      <div className="hero_label-wrapper">
        {/* Column 1: Photo hole with GIF */}
        <div className="hero_label-col hole">
          <img src="./assets/hero-gif.gif" alt="" className="home_gif hero" />
        </div>

        {/* Column 2: Main info */}
        <div className="hero_label-col">
          <div className="hero_label-holder top">
            <p className="hero_label-paragraph">
              HYBRID MODEL: FP&A × MACHINE LEARNING. PRODUCTION ML WITH CALIBRATED OUTPUTS.
              DEPLOYED ON HUGGINGFACE SPACES, DOCKER, VERCEL. FRAMEWORKS: XGBOOST, LIGHTGBM, PYTORCH, SHAP.
            </p>
            <div className="hero_label-copy">TREY©2025</div>
          </div>
          <div className="hero_label-holder">
            <div className="hero_label-title">
              <h2>MACHINE LEARNING ENGINEER</h2>
            </div>
            <div className="hero_label-based">
              <h2>MADE IN USA.</h2>
            </div>
          </div>
          {/* Dashes GIF */}
          <div className="hero_gif-holder">
            <img src="./assets/dashes.gif" alt="" className="home_gif dashes" loading="lazy" />
          </div>
        </div>

      </div>

      {/* Barcode bar below orange section */}
      <div className="hero_barcode-bar">
        <div className="barcode_group">
          <img src="./assets/barcode.svg" alt="" className="barcode" />
          <span className="barcode_avail">AVLB : 2025(MMXXV)</span>
          <img src="./assets/barcode.svg" alt="" className="barcode center" />
          <span className="barcode_status">OPEN TO WORK</span>
          <img src="./assets/barcode.svg" alt="" className="barcode center" />
          <span className="barcode_time" id="clock">{time}</span>
          <img src="./assets/barcode.svg" alt="" className="barcode" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
