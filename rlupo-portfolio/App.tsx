import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import Carousel from './components/Carousel';
import InfoOverlay from './components/InfoOverlay';
import ProjectsOverlay from './components/ProjectsOverlay';
import AskPanel from './components/AskPanel';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import { useLenis } from './hooks/useLenis';
import { VizCaptureRoute } from './components/VizCaptureRoute';
import './styles/index.css';

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(() => window.location.pathname === '/ask');
  const [askInitialQuery, setAskInitialQuery] = useState('');
  const goToRef = useRef<((index: number) => void) | null>(null);
  const onPreloaderComplete = useCallback(() => setLoaded(true), []);

  const anyOverlayOpen = infoOpen || projectsOpen || askOpen;
  useLenis(loaded && !anyOverlayOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setAskOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleAskClose = useCallback(() => {
    setAskOpen(false);
    setAskInitialQuery('');
    if (window.location.pathname === '/ask') window.history.replaceState(null, '', '/');
  }, []);

  const handleAskOpen = useCallback((query = '') => {
    setAskInitialQuery(query);
    setAskOpen(true);
  }, []);

  const handleGoToSlide = useCallback((index: number) => {
    goToRef.current?.(index);
  }, []);

  const handleRegisterGoTo = useCallback((goTo: (index: number) => void) => {
    goToRef.current = goTo;
  }, []);

  if (import.meta.env.DEV) {
    const captureId = new URLSearchParams(window.location.search).get('viz-capture');
    if (captureId) {
      return <VizCaptureRoute id={captureId} />;
    }
  }

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
          <Carousel
            onRegisterGoTo={handleRegisterGoTo}
            loaded={loaded}
            onAskOpen={handleAskOpen}
            keyboardEnabled={!anyOverlayOpen}
          />
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
        onClose={handleAskClose}
        onGoToSlide={handleGoToSlide}
        initialQuery={askInitialQuery}
      />
    </>
  );
};

export default App;
