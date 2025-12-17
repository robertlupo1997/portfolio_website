import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE } from '../constants';
import Barcode from './Barcode';
import ScrambleText from './ScrambleText';

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-12 md:py-20 px-4 md:px-8 bg-chrls-cream border-t-2 border-black">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          className="flex justify-between items-start mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight">
              <ScrambleText
                text="Experience"
                scrambleOnHover={true}
                scrambleOnClick={true}
                speed={0.4}
                scramble={5}
              />
            </h2>
            <Barcode bars={8} className="h-4 w-16 hidden md:block" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-black/50">
            {EXPERIENCE.length} POSITIONS
          </span>
        </motion.div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {EXPERIENCE.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="border-2 border-black bg-white overflow-hidden card-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {/* Header Strip */}
              <div className="bg-chrls-orange border-b-2 border-black px-4 py-3 flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  {exp.period}
                </span>
                <Barcode bars={6} className="h-3 w-10" seed={index * 13} />
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                <h3 className="font-display font-bold text-lg md:text-xl uppercase leading-tight mb-1">
                  {exp.company}
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-wider text-chrls-orange mb-4">
                  {exp.role}
                </p>
                <p className="font-mono text-[11px] leading-relaxed text-black/70 mb-4">
                  {exp.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="font-mono text-[9px] uppercase bg-black text-white px-2 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;
