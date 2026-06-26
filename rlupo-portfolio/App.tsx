import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import Carousel from './components/Carousel';
import InfoOverlay from './components/InfoOverlay';
import ProjectsOverlay from './components/ProjectsOverlay';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const goToRef = useRef<((index: number) => void) | null>(null);
  const onPreloaderComplete = useCallback(() => setLoaded(true), []);

  const anyOverlayOpen = infoOpen || projectsOpen;
  useLenis(loaded && !anyOverlayOpen);
  useScrollAnimations();

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
    </>
  );
};

export default App;
