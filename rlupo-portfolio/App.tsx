import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
// import CredentialStrip from './components/CredentialStrip';
import ProjectList from './components/ProjectList';
import About from './components/About';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  useLenis();
  useScrollAnimations();

  return (
    <>
      <Cursor />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content" className="main">
        <Hero />
        {/* <CredentialStrip /> */}
        <ProjectList />
        <About />
      </main>
      <Footer />
    </>
  );
};

export default App;
