import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from './TextScramble';

gsap.registerPlugin(ScrollTrigger);

import { SKILL_GROUPS, TIMELINE } from '../constants';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const decorativeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const statement = statementRef.current;
    const decorative = decorativeRef.current;

    if (!section || !statement || !decorative) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
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
    }

    // Blur reveal on statement
    if (!prefersReducedMotion) {
      gsap.fromTo(
        statement,
        { filter: 'blur(6px)' },
        {
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statement,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section || t.trigger === statement) t.kill();
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
          <circle cx="200" cy="200" r="180" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.3" />
          <circle cx="200" cy="200" r="140" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.25" />
          <circle cx="200" cy="200" r="100" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.2" />
          <circle cx="200" cy="200" r="60" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.15" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.1" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.1" />
          <line x1="57" y1="57" x2="343" y2="343" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.08" />
          <line x1="343" y1="57" x2="57" y2="343" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.08" />
        </svg>

        {/* Statement text that overlaps */}
        <p className="about-statement-overlap" ref={statementRef}>
          I make financial data useful with code.
        </p>

        <div className="about-body">
          <p className="about-bio-overlap">
            Corporate FP&A Analyst at Franklin Street in Tampa. I build Python SDKs
            that replace manual Oracle exports, ML frameworks in Rust that ship with
            statistical rigor, and revenue models that actually reconcile across
            business lines.
          </p>

          <p className="about-bio-overlap">
            Background: B.A. Statistics from USF, MIT Data Science certificate, and
            an AI engineering internship at Origin Construction. I write code that
            ships to production, not notebooks that sit in repos.
          </p>

          <div className="skills-overlap">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label} className="skills-group-overlap">
                <h3 className="skills-title-overlap">{group.label}</h3>
                <div className="skills-grid-overlap">
                  {group.items.map((skill) => (
                    <span key={skill} className="skill-tag-overlap">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="services-overlap">
            <h3 className="services-title-overlap">TIMELINE</h3>
            <div className="timeline-list">
              {TIMELINE.map((entry) => (
                <div key={entry.year} className="timeline-entry-overlap">
                  <span className={`timeline-year ${entry.current ? 'current' : ''}`}>{entry.year}</span>
                  <div>
                    <div className="timeline-title-overlap">{entry.title}</div>
                    <div className="timeline-sub-overlap">{entry.sub}</div>
                  </div>
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
