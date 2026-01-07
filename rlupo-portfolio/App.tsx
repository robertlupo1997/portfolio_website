import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TickerTape from './components/TickerTape';
import ProjectCard from './components/ProjectCard';
import About from './components/About';
import Footer from './components/Footer';
import { PROJECTS } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#111] selection:bg-orange-500 selection:text-white">
      <Header />
      
      <main>
        <Hero />
        
        <TickerTape 
          text="AVAILABLE FOR FREELANCE & CONTRACT WORK  ✦  MACHINE LEARNING ENGINEER  ✦  DATA SCIENTIST  ✦" 
          className="bg-orange-600 text-black border-y border-black" 
        />
        
        <section id="work" className="py-24 px-4 md:px-8">
          <div className="flex justify-between items-end mb-16">
             <h2 className="text-xl md:text-2xl font-mono uppercase tracking-widest">( Selected Works )</h2>
             <span className="font-mono text-xs opacity-60">2023 — 2025</span>
          </div>

          <div className="flex flex-col">
            {PROJECTS.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>

        <About />
        
        <Footer />
      </main>
    </div>
  );
};

export default App;