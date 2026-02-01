import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from './TextScramble';

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  'Python',
  'SQL',
  'Excel',
  'Power BI',
  'Machine Learning',
  'LightGBM',
  'Scikit-learn',
  'Pandas',
  'FastAPI',
  'React',
  'Claude/AI Tools',
  'Financial Modeling',
];

const SERVICES = [
  {
    title: 'Financial Analytics',
    description: 'Dashboards and reports that executives actually use',
  },
  {
    title: 'Process Automation',
    description: 'Python scripts that save hours of manual work',
  },
  {
    title: 'ML & Prediction',
    description: 'Models with proper validation that ship to production',
  },
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
          duration={1000}
          triggerOnView={true}
          triggerOnHover={true}
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
          I make financial data useful.
        </p>

        <div className="about-body">
          <p className="about-bio-overlap">
            Corporate FP&A Analyst at Franklin Street in Tampa. I build dashboards,
            automate reports, and use AI tools to make financial analysis faster.
            My job is turning raw data into insights that help leadership make decisions.
          </p>

          <p className="about-bio-overlap">
            Background: B.A. Statistics from USF, MIT Data Science certificate, and
            an AI engineering internship at Origin Construction where I built Python
            automation tools. I write code that ships—not just models that sit in notebooks.
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

          <div className="services-overlap">
            <h3 className="services-title-overlap">WHAT I DO</h3>
            <div className="services-grid-overlap">
              {SERVICES.map((service) => (
                <div key={service.title} className="service-card-overlap">
                  <h4 className="service-card-title">{service.title}</h4>
                  <p className="service-card-description">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
