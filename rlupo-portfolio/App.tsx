import React from 'react';
import CustomCursor from './components/CustomCursor';
import PageLoader from './components/PageLoader';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import About from './components/About';
import Footer from './components/Footer';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  useLenis();
  useScrollAnimations();

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <PageLoader />
      <CustomCursor />
      <Header />

      <main id="main-content" className="main">
        <Hero />
        <ProjectsSection />
        <About />
        <Footer />
      </main>
    </>
  );
};

export default App;
