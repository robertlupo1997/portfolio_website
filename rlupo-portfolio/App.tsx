import React from 'react';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import About from './components/About';
import Footer from './components/Footer';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  // Initialize smooth scroll
  useLenis();
  // Initialize scroll-triggered animations
  useScrollAnimations();

  return (
    <>
      <CustomCursor />
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
