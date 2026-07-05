import React from 'react';
import TextScramble from './TextScramble';
import { SKILL_GROUPS, TIMELINE } from '../constants';

const About: React.FC = () => (
  <section className="about" id="about">
    <div className="about-statement">
      <TextScramble
        text="I make financial data useful with code."
        as="p"
        className="about-statement-text"
        duration={800}
        triggerOnView={true}
        triggerOnHover={false}
        threshold={0.3}
      />
    </div>

    <div className="about-body">
      <p className="about-bio">
        Corporate FP&A Analyst at Franklin Street in Tampa. I build Python SDKs
        that replace manual Oracle exports, ML frameworks in Rust that ship with
        statistical rigor, and revenue models that actually reconcile across
        business lines.
      </p>

      <p className="about-bio">
        Background: B.A. Statistics from USF, MIT Data Science certificate, and
        an AI engineering internship at Origin Construction. I write code that
        ships to production, not notebooks that sit in repos.
      </p>

      <div className="about-skills">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label} className="skill-group">
            <h3 className="skill-group-label">{group.label.toLowerCase()}</h3>
            <div className="skill-tags">
              {group.items.map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="about-timeline">
        <h3 className="skill-group-label">timeline</h3>
        {TIMELINE.map((entry) => (
          <div key={entry.year} className="timeline-row">
            <span className={`timeline-year ${entry.current ? 'current' : ''}`}>{entry.year}</span>
            <div>
              <div className="timeline-title">{entry.title}</div>
              <div className="timeline-sub">{entry.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default About;
