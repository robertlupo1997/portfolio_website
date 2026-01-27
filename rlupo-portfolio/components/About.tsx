import React from 'react';

const SKILLS = [
  'Python',
  'R',
  'SQL',
  'Machine Learning',
  'XGBoost',
  'Scikit-learn',
  'Pandas',
  'NumPy',
  'TensorFlow',
  'Claude Code',
  'FastAPI',
  'React',
  'TypeScript',
];

const About: React.FC = () => {
  return (
    <section className="about" id="about">
      <div className="about-header">
        <h2 className="about-title">ABOUT</h2>
      </div>

      <div className="about-grid">
        <div className="about-content">
          <p className="about-statement">
            I turn data into products that actually work.
          </p>

          <p className="about-bio">
            Data Scientist with a B.A. in Statistics from USF. Currently in corporate FP&A
            at Franklin Street, previously built AI agent prototypes at ORIGIN Construction
            using Claude Code and FastAPI. I focus on predictive modeling, recommendation
            systems, and bringing ML from notebook to production.
          </p>

          <div className="skills">
            <h3 className="skills-title">Tech Stack</h3>
            <div className="skills-grid">
              {SKILLS.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="about-visual">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
            <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
            <line x1="40" y1="100" x2="160" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
            <line x1="100" y1="40" x2="100" y2="160" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default About;
