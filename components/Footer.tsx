import React from 'react';
import { motion } from 'framer-motion';
import { SITE_CONFIG } from '../constants';
import ScrambleText from './ScrambleText';

const Footer: React.FC = () => {
  const socials = [
    { name: 'GitHub', url: `https://github.com/${SITE_CONFIG.github}` },
    { name: 'LinkedIn', url: `https://linkedin.com/in/${SITE_CONFIG.linkedin}` },
    { name: 'Email', url: `mailto:${SITE_CONFIG.email}` },
  ];

  return (
    <footer className="bg-chrls-dark text-white pt-16 md:pt-24 pb-8 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Contact Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 md:mb-24">

          {/* Left: Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/50 mb-4">
              ©{SITE_CONFIG.year}
            </p>
            <p className="font-display text-2xl md:text-4xl font-bold mb-2">
              Say hello <span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
            </p>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="font-display text-2xl md:text-4xl font-bold underline decoration-2 underline-offset-4 hover:text-chrls-orange transition-colors"
            >
              {SITE_CONFIG.email.split('@')[0]}@{SITE_CONFIG.email.split('@')[1]}
            </a>
          </motion.div>

          {/* Right: Social Links */}
          <motion.div
            className="text-right space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {socials.map((social, i) => (
              <motion.a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-xs uppercase tracking-wider link-underline text-white/70 hover:text-white transition-colors"
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              >
                {social.name}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Giant Footer Text */}
        <motion.div
          className="border-t border-white/20 pt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="font-display font-black uppercase leading-[0.8] tracking-[-0.02em] text-center"
            style={{ fontSize: 'clamp(48px, 18vw, 240px)' }}
          >
            <ScrambleText
              text={SITE_CONFIG.name}
              scrambleOnHover={true}
              scrambleOnClick={true}
              speed={0.5}
              scramble={8}
            />
            <span className="text-chrls-orange">.</span>
            <ScrambleText
              text={SITE_CONFIG.domain}
              scrambleOnHover={true}
              scrambleOnClick={true}
              speed={0.5}
              scramble={8}
            />
          </h2>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
