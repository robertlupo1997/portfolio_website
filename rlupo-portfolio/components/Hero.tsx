import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const [time, setTime] = useState('');

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
    <section className="section hero">
      {/* Giant Title */}
      <div className="hero_title-holder">
        <h1 className="hero_title">TREY</h1>
        <div className="hero_splitter"></div>
        <h1 className="hero_title">ML</h1>
      </div>

      {/* Orange Info Box - 3 columns */}
      <div className="hero_label-wrapper">
        {/* Column 1: Photo hole */}
        <div className="hero_label-col hole">
          {/* Photo placeholder or actual image */}
          <span style={{ padding: '1em', fontSize: '12px', opacity: 0.5 }}>[PHOTO]</span>
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
        </div>

        {/* Column 3: Barcode and time */}
        <div className="hero_label-col last">
          <div className="barcode_group">
            <h3 className="barcode_avail">AVLB : 2025</h3>
            <img src="./assets/barcode.svg" alt="" className="barcode center" />
            <h3 className="barcode_time">OPEN TO WORK</h3>
          </div>
          <h3 className="barcode_time" id="clock">{time}</h3>
        </div>
      </div>
    </section>
  );
};

export default Hero;
