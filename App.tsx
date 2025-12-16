import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import ProjectCard from './components/ProjectCard';
import Experience from './components/Experience';
import About from './components/About';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import { PROJECTS } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="min-h-screen bg-chrls-cream text-chrls-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Header />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Projects Section */}
        <section id="projects" className="py-12 md:py-20 px-4 md:px-8 bg-chrls-cream">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="flex justify-end mb-8">
              <span className="font-mono text-[10px] uppercase tracking-wider cursor-pointer hover:text-chrls-orange transition-colors">
                + VIEW ALL
              </span>
            </div>

            {/* Project Grid - Scrollable on mobile, grid on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
              {PROJECTS.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* Marquee - "SELECTED CLIENT WORK" style */}
        <Marquee
          text="MACHINE LEARNING PROJECTS •"
          outlined={true}
          className="py-8 md:py-12 border-y-2 border-black bg-chrls-cream"
        />

        {/* Experience Section */}
        <Experience />

        {/* About Section */}
        <About />
        
        {/* Footer */}
        <Footer />
      </main>
      </motion.div>
    </>
  );
};

export default App;
