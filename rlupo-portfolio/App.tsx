import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Carousel from './components/Carousel';
import ArchiveList from './components/ArchiveList';
import Footer from './components/Footer';
import InfoOverlay from './components/InfoOverlay';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const onPreloaderComplete = useCallback(() => setLoaded(true), []);

  useLenis(loaded && !infoOpen);
  useScrollAnimations();

  return (
    <>
      <Preloader onComplete={onPreloaderComplete} />
      <Cursor />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className={`site-content ${loaded ? 'site-content--visible' : ''}`}>
        <Header onInfoClick={() => setInfoOpen(true)} />
        <main id="main-content" className="main">
          <Carousel />
          <ArchiveList />
        </main>
        <Footer />
      </div>
      <InfoOverlay isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
};

export default App;
