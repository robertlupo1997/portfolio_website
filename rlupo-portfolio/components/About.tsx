import React from 'react';
import { PERSONAL_INFO } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="section about">
      <div className="home_about-wrapper">
        {/* Black background */}
        <div className="home_about-bg"></div>

        <div className="home_about-container">
          {/* Left column - Big text and info box */}
          <div className="home_about-col">
            <div className="home_about-titleholder">
              <div className="home_about-bigtextholder">
                ML ENGINEER & DATA SCIENTIST. PRODUCTION FOCUSED.
              </div>
            </div>
            <div className="home_about-intholder">
              <h2>ABOUT</h2>
              <p className="home_about-para">
                Robert "Trey" Lupo builds production ML systems with calibrated outputs.
                Currently FP&A Analyst at Franklin Street Properties, previously AI Engineering
                at Origin Construction. MIT Professional Certificate in Data Science,
                B.A. Statistics from University of South Florida.
              </p>
              <img src="./assets/about-gif.gif" alt="" className="home_gif about-para" loading="lazy" />
            </div>
          </div>

          {/* Right column - Orange box with credentials */}
          <div className="home_about-col about-box">
          <div className="home_about-awardcol">
            <div className="award_group">
              <h5 className="about_awards title">Benchmarks</h5>
              <h6 className="about_awards">0.97 AUC - KKBOX Churn</h6>
              <h6 className="about_awards">265-490ms - OVOD Inference</h6>
              <h6 className="about_awards">135+ Engineered Features</h6>
            </div>
            <div className="award_group">
              <h5 className="about_awards title">Education</h5>
              <h6 className="about_awards">MIT Data Science Certificate</h6>
              <h6 className="about_awards">B.A. Statistics, USF</h6>
            </div>
          </div>
          <div className="home_about-awardcol btm">
            <div className="award_group">
              <h5 className="about_awards title">Stack</h5>
              <h6 className="about_awards">Python</h6>
              <h6 className="about_awards">XGBoost / LightGBM</h6>
              <h6 className="about_awards">FastAPI / React</h6>
              <h6 className="about_awards">SHAP / DuckDB</h6>
            </div>
            <div className="award_group">
              <h5 className="about_awards title">Deploy</h5>
              <h6 className="about_awards">HuggingFace Spaces</h6>
              <h6 className="about_awards">Docker</h6>
              <h6 className="about_awards">Vercel</h6>
            </div>
            <div className="award_group">
              <h5 className="about_awards title">Contact</h5>
              <h6 className="about_awards">
                <a href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</a>
              </h6>
              <h6 className="about_awards">
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              </h6>
              <h6 className="about_awards">
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </h6>
            </div>
            <img src="./assets/awards-gif.gif" alt="" className="home_gif about_awards" loading="lazy" />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default About;
