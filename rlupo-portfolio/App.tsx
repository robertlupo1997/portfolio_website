import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CredentialStrip from './components/CredentialStrip';
import ProjectList from './components/ProjectList';
import About from './components/About';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const onPreloaderComplete = useCallback(() => setLoaded(true), []);

  useLenis(loaded);
  useScrollAnimations();

  return (
    <>
      <Preloader onComplete={onPreloaderComplete} />
      <Cursor />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className={`site-content ${loaded ? 'site-content--visible' : ''}`}>
        <Header />
        <main id="main-content" className="main">
          <Hero />
          <CredentialStrip />
          <ProjectList />
          <About />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
