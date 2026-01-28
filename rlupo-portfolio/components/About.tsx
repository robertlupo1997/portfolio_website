import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from './TextScramble';

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const decorativeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const statement = statementRef.current;
    const decorative = decorativeRef.current;

    if (!section || !statement || !decorative) return;

    // Parallax on statement text (slower)
    gsap.to(statement, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    // Parallax on decorative SVG (faster, opposite direction creates overlap effect)
    gsap.to(decorative, {
      y: 80,
      rotation: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section className="about-overlap" id="about" ref={sectionRef}>
      <div className="about-header-overlap">
        <TextScramble
          text="ABOUT"
          as="h2"
          className="about-title-overlap"
          duration={1200}
          triggerOnView={true}
          threshold={0.3}
        />
      </div>

      <div className="about-content-overlap">
        {/* Decorative SVG element */}
        <svg
          ref={decorativeRef}
          className="about-decorative"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="180" stroke="var(--accent-teal)" strokeWidth="0.5" opacity="0.3" />
          <circle cx="200" cy="200" r="140" stroke="var(--accent-blue)" strokeWidth="0.5" opacity="0.25" />
          <circle cx="200" cy="200" r="100" stroke="var(--accent-teal)" strokeWidth="0.5" opacity="0.2" />
          <circle cx="200" cy="200" r="60" stroke="var(--accent-blue)" strokeWidth="0.5" opacity="0.15" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.1" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.1" />
          <line x1="57" y1="57" x2="343" y2="343" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.08" />
          <line x1="343" y1="57" x2="57" y2="343" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.08" />
        </svg>

        {/* Statement text that overlaps */}
        <p className="about-statement-overlap" ref={statementRef}>
          I turn data into products that actually work.
        </p>

        <div className="about-body">
          <p className="about-bio-overlap">
            Data Scientist with a B.A. in Statistics from USF. Currently in corporate FP&A
            at Franklin Street, previously built AI agent prototypes at ORIGIN Construction
            using Claude Code and FastAPI. I focus on predictive modeling, recommendation
            systems, and bringing ML from notebook to production.
          </p>

          <div className="skills-overlap">
            <h3 className="skills-title-overlap">Tech Stack</h3>
            <div className="skills-grid-overlap">
              {SKILLS.map((skill) => (
                <span key={skill} className="skill-tag-overlap">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
