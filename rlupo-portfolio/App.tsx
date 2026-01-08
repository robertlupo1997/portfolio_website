import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import About from './components/About';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import { useLenis } from './hooks/useLenis';

const App: React.FC = () => {
  // Initialize Lenis smooth scroll
  useLenis();

  return (
    <>
      <CustomCursor />
      <Preloader />

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
