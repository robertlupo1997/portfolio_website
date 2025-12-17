import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Barcode from './Barcode';
import QRCode from './QRCode';
import ParticleField from './ParticleField';
import FloatingGeometry from './FloatingGeometry';
import ScrambleText from './ScrambleText';
import { SITE_CONFIG } from '../constants';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const infoBoxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Skip animations if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Subtle parallax effect on scroll (title only)
    gsap.to(titleRef.current, {
      y: 80,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative pt-32 md:pt-40 pb-8 px-4 md:px-8 min-h-screen flex flex-col items-center">

      {/* Particle Field Background */}
      <ParticleField className="opacity-50" />

      {/* 3D Floating Geometry - Desktop only */}
      <motion.div
        className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 h-80 pointer-events-auto"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <FloatingGeometry className="w-full h-full" />
      </motion.div>

      {/* Giant Title - CHRLS.DSGN style - Centered */}
      <motion.div
        className="w-full mb-8 md:mb-12 flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1
          ref={titleRef}
          className="font-display font-black text-black leading-[0.85] tracking-[-0.02em] uppercase text-center"
          style={{ fontSize: 'clamp(48px, 15vw, 200px)' }}
        >
          <ScrambleText
            text={SITE_CONFIG.name}
            scrambleOnHover={true}
            scrambleOnClick={true}
            speed={0.6}
            scramble={6}
          />
          <span className="text-chrls-orange">.</span>
          <ScrambleText
            text={SITE_CONFIG.domain}
            scrambleOnHover={true}
            scrambleOnClick={true}
            speed={0.6}
            scramble={6}
          />
        </h1>
      </motion.div>

      {/* Orange Info Box - Always visible, cool entrance */}
      <motion.div
        ref={infoBoxRef}
        className="w-full max-w-5xl flex flex-col md:flex-row gap-0"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.9,
          delay: 0.3,
          ease: [0.16, 1, 0.3, 1],
          scale: { duration: 0.7 }
        }}
      >

        {/* Main Orange Box */}
        <div className="bg-chrls-orange border-2 border-black flex-1">
          <div className="flex flex-col md:flex-row">

            {/* Left: QR Code + Binary text */}
            <div className="p-4 md:p-6 border-b-2 md:border-b-0 md:border-r-2 border-black flex gap-4 items-start">
              <div className="flex-shrink-0">
                <QRCode
                  url={`https://github.com/${SITE_CONFIG.github}`}
                  size={72}
                />
              </div>
              <div className="font-mono text-[8px] md:text-[9px] leading-tight text-black/80 max-w-[200px]">
                <p>CAN BE HANDLED BY BOTH RECRUITERS AND COLLABORATORS. THINK MORE: DATA-DRIVEN DECISIONS. APPLY ON GITHUB AND SHARE. SIDE STEP: MANUAL PROCESSES (OPTIONAL, BUT RECOMMENDED).</p>
              </div>
            </div>

            {/* Right: Title */}
            <div className="p-4 md:p-6 flex flex-col justify-between flex-1">
              <div className="font-mono text-[8px] md:text-[9px] leading-tight text-black/80 mb-4 hidden md:block">
                FOR BEST RESULTS: CONTACT YOUR PROFESSIONAL DATA SCIENTIST / ML ENGINEER. SOMETHING'S NEVER TOO COMPLEX. FOR WORST RESULTS: DEPLOY WITHOUT TESTING. NOW TIME TO SIT BACK & ANALYZE.
              </div>
              <h2 className="font-display font-bold text-xl md:text-2xl uppercase tracking-wide">
                Independent Developer
              </h2>
            </div>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="bg-chrls-orange border-2 border-t-0 md:border-t-2 md:border-l-0 border-black p-4 md:p-6 flex flex-col justify-between min-w-[140px]">
          <p className="font-mono text-[9px] text-right">{SITE_CONFIG.name}©{SITE_CONFIG.year}</p>
          <div className="flex justify-end gap-2 my-2">
            <Barcode bars={8} className="h-4 w-16" />
          </div>
          <p className="font-mono text-[9px] text-right">MADE IN {SITE_CONFIG.location.split(',')[1]?.trim() || 'USA'}.</p>
        </div>
      </motion.div>

      {/* Status Bar */}
      <motion.div
        className="w-full mt-8 md:mt-12 py-4 border-y border-chrls-light flex items-center justify-center flex-wrap gap-4 md:gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Barcode bars={12} className="h-4 w-20 opacity-50" />

        <div className="flex items-center gap-4 md:gap-6 font-mono text-[9px] md:text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            AVLB : {SITE_CONFIG.year}(MMX{SITE_CONFIG.year.slice(-2)})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full border border-black"></span>
            {SITE_CONFIG.available ? 'OPEN FOR WORK' : 'COMING SOON'}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full border border-black"></span>
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <Barcode bars={12} className="h-4 w-20 opacity-50" />
      </motion.div>

    </section>
  );
};

export default Hero;
