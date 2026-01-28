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

const SERVICES = [
  {
    title: 'AI Automation',
    description: 'Turn manual workflows into intelligent systems',
  },
  {
    title: 'Rapid Prototypes',
    description: 'From idea to working demo in days, not months',
  },
  {
    title: 'Data Products',
    description: 'Models that drive real business decisions',
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
          I turn ideas into working AI prototypes. Fast.
        </p>

        <div className="about-body">
          <p className="about-bio-overlap">
            Statistics grad turned AI builder. I spent 4 months at ORIGIN Construction
            shipping AI agent prototypes with Claude Code and FastAPI. Now I'm in FP&A
            at Franklin Street, which means I think about business problems, not just
            technical ones.
          </p>

          <p className="about-bio-overlap">
            I help startups and small teams test AI ideas without the enterprise timeline.
            Need a Claude-powered workflow? A predictive model? A FastAPI backend?
            Let's build it.
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
            <h3 className="services-title-overlap">WHAT I BUILD</h3>
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
