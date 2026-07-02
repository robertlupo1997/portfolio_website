import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import Carousel from './components/Carousel';
import InfoOverlay from './components/InfoOverlay';
import ProjectsOverlay from './components/ProjectsOverlay';
import AskPanel from './components/AskPanel';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(() => window.location.pathname === '/ask');
  const goToRef = useRef<((index: number) => void) | null>(null);
  const onPreloaderComplete = useCallback(() => setLoaded(true), []);

  const anyOverlayOpen = infoOpen || projectsOpen || askOpen;
  useLenis(loaded && !anyOverlayOpen);
  useScrollAnimations();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setAskOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleGoToSlide = useCallback((index: number) => {
    goToRef.current?.(index);
  }, []);

  const handleRegisterGoTo = useCallback((goTo: (index: number) => void) => {
    goToRef.current = goTo;
  }, []);

  return (
    <>
      <Preloader onComplete={onPreloaderComplete} />
      <Cursor />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className={`site-content ${loaded ? 'site-content--visible' : ''}`}>
        <Header
          onInfoClick={() => setInfoOpen(true)}
          onProjectsClick={() => setProjectsOpen(true)}
          onAskClick={() => setAskOpen(true)}
        />
        <main id="main-content" className="main">
          <Carousel onRegisterGoTo={handleRegisterGoTo} loaded={loaded} />
        </main>
      </div>
      <InfoOverlay isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
      <ProjectsOverlay
        isOpen={projectsOpen}
        onClose={() => setProjectsOpen(false)}
        onGoToSlide={handleGoToSlide}
      />
      <AskPanel
        isOpen={askOpen}
        onClose={() => setAskOpen(false)}
        onGoToSlide={handleGoToSlide}
      />
    </>
  );
};

export default App;
