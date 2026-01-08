import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import About from './components/About';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import { useLenis } from './hooks/useLenis';

declare global {
  interface Window {
    gsap: any;
  }
}

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Lenis smooth scroll
  useLenis();

  // Trigger hero animations after preloader completes
  useEffect(() => {
    if (isLoaded && window.gsap) {
      const gsap = window.gsap;

      // Animate hero elements in sequence
      const tl = gsap.timeline({ delay: 0.1 });

      // Animate nav
      tl.from('.nav', {
        y: -50,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Animate hero title letters (split text effect)
      tl.from('.hero_title', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1
      }, '-=0.3');

      // Animate hero splitter
      tl.from('.hero_splitter', {
        scale: 0,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }, '-=0.5');

      // Animate hero label wrapper
      tl.from('.hero_label-wrapper', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3');

      // Animate barcode holder
      tl.from('.barcode_holder', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.2');
    }
  }, [isLoaded]);

  const handlePreloaderComplete = () => {
    setIsLoaded(true);
  };

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={handlePreloaderComplete} />

      {/* Noise/grain overlay */}
      <div className="noise"></div>

      <Header />

      <main className="main">
        <Hero />

        <ProjectsSection />

        <About />

        <Footer />
      </main>
    </>
  );
};

export default App;
