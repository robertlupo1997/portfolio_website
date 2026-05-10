import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from './TextScramble';
import Timeline from './Timeline';
import { SKILL_GROUPS } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const elements = section.querySelectorAll('.tl-entry, .skill-group, .about-statement');
    gsap.fromTo(elements,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1,
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      }
    );

    return () => {
      ScrollTrigger.getAll().filter(t => t.trigger === section).forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="section" id="about" ref={sectionRef}>
      <div className="section-label">
        <TextScramble text="ABOUT" triggerOnView={true} triggerOnHover={true} duration={1000} />
      </div>

      <div className="about-statement">
        I make <span className="amber">financial data</span> useful.
      </div>

      <Timeline />

      <div className="skills-section">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label} className="skill-group">
            <div className="sg-label">{group.label}</div>
            <div className="sg-items">
              {group.items.map((item) => (
                <span key={item} className="sg-tag">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
