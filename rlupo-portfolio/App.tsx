import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import About from './components/About';
import Footer from './components/Footer';
import { PROJECTS } from './constants';

const App: React.FC = () => {
  return (
    <>
      {/* Noise/grain overlay */}
      <div className="noise"></div>

      <Header />

      <main className="main">
        <Hero />

        {/* Projects Section */}
        <section className="section project">
          <div className="home_project-track view-all">
            {/* Background marquee - top */}
            <div className="home_project-bg first">
              <div className="home_project-bgtxtholder outline">
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
              </div>
            </div>

            {/* Project grid */}
            <div className="home_project-content view-all">
              {PROJECTS.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {/* Background marquee - bottom */}
            <div className="home_project-bg last">
              <div className="home_project-bgtxtholder outline">
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
              </div>
            </div>
          </div>

          {/* Reminder section */}
          <div className="home_project-reminder">
            <img src="./assets/barcode.svg" alt="" className="home_project-remindericon" />
            <span className="home_project-remindertext">MORE PROJECTS IN TRAINING</span>
            <img src="./assets/barcode.svg" alt="" className="home_project-remindericon" />
          </div>
        </section>

        <About />

        <Footer />
      </main>
    </>
  );
};

export default App;
