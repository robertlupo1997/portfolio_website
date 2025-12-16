import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Marquee from './Marquee';
import Barcode from './Barcode';
import { AWARDS, SKILLS } from '../constants';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Stagger animation for all skills
    gsap.from('.skill-tag', {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: skillsRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-chrls-dark text-white relative overflow-hidden">

      {/* Marquee Headline */}
      <div className="py-8 md:py-12 border-b border-white/20">
        <Marquee
          text="A DATA SCIENTIST & ML ENGINEER. ANALYTICALLY DRIVEN."
          outlined={false}
          textClassName="text-white"
          speed={35}
        />
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Bio Box */}
          <motion.div
            className="lg:col-span-7 bg-chrls-orange text-black p-6 md:p-8 relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-display text-base md:text-lg leading-relaxed mb-8">
              Robert Lupo is a Data Scientist passionate about turning data into actionable insights. With a B.A. in Statistics from USF and an Advanced DS/ML certification from MIT, he specializes in building production ML pipelines, predictive models, and data-driven solutions. His work spans churn prediction, computer vision, and recommender systems.
            </p>

            {/* Decorative Zigzag */}
            <div className="flex items-center gap-4">
              <svg width="120" height="24" viewBox="0 0 120 24" className="text-black">
                <path
                  d="M0 12 L10 4 L20 20 L30 4 L40 20 L50 4 L60 20 L70 4 L80 20 L90 4 L100 20 L110 4 L120 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <Barcode bars={8} className="h-4 w-16" />
            </div>
          </motion.div>

          {/* Right: Awards/Stats */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >

            {/* About Header */}
            <div className="flex justify-between items-start border-b border-white/30 pb-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">About</h3>

              {/* Decorative dots grid */}
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-chrls-orange" />
                ))}
              </div>
            </div>

            {/* Awards Grid */}
            <div className="grid grid-cols-3 gap-4 text-[10px] md:text-xs font-mono uppercase">
              {AWARDS.map((award, i) => (
                <motion.div
                  key={i}
                  className="space-y-1"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                >
                  <p className="text-chrls-orange font-bold">{award.source}</p>
                  {award.items.map((item, j) => (
                    <p key={j} className="text-white/70">{item}</p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Skills */}
            <div ref={skillsRef} className="mt-4 pt-4 border-t border-white/20">
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/50 mb-3">Core Technologies</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.slice(0, 10).map((skill, i) => (
                  <span
                    key={i}
                    className="skill-tag font-mono text-[10px] uppercase bg-white/10 px-2 py-1"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="border-y border-white/20 py-4 flex items-center justify-center gap-4">
        <Barcode bars={10} className="h-4 w-16" color="white" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/70">
          IN CASE OF EMERGENCY. PLEASE GO BACK AND VIEW ALL PROJECTS.
        </p>
        <Barcode bars={10} className="h-4 w-16" color="white" />
      </div>

    </section>
  );
};

export default About;
