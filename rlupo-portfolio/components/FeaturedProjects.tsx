import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FEATURED_PROJECTS } from '../constants';
import LineReveal from './LineReveal';

gsap.registerPlugin(ScrollTrigger);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);

const useCountUp = (target: number | undefined, isVisible: boolean) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible || !target) return;

    const duration = 1200;
    const startTime = performance.now();
    let frame: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, target]);

  return target ? value : null;
};

const layoutVariants = ['image-right', 'image-full', 'image-left'] as const;

const FeaturedEntry: React.FC<{
  project: typeof FEATURED_PROJECTS[0];
  index: number;
}> = ({ project, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const variant = layoutVariants[index % layoutVariants.length];
  const number = String(index + 1).padStart(2, '0');
  const countedMetric = useCountUp(project.metricNumeric, isVisible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll-driven parallax on project imagery
  useEffect(() => {
    const wrap = imageRef.current;
    const img = wrap?.querySelector('img');
    if (!wrap || !img) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.fromTo(
      img,
      { yPercent: -8, scale: 1.15 },
      {
        yPercent: 8,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const displayMetric = countedMetric !== null
    ? `${countedMetric}${project.metric?.includes('+') ? '+' : ''}`
    : project.metric;

  return (
    <div ref={ref} className={`fp-entry fp-entry--${variant} ${isVisible ? 'fp-entry--visible' : ''}`}>
      <div className="fp-image" ref={imageRef}>
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} loading={index === 0 ? 'eager' : 'lazy'} />
        ) : (
          <div className="fp-image-placeholder" />
        )}
      </div>

      <div className="fp-content">
        <span className="fp-number" aria-hidden="true">{number}</span>
        <span className="fp-category">{project.category.toLowerCase()}</span>
        <LineReveal as="h3" className="fp-title">{project.title}</LineReveal>
        {project.problem && <p className="fp-problem">{project.problem}</p>}

        <div className="fp-meta">
          <div className="fp-metric">
            <span className="fp-metric-value">{displayMetric}</span>
            <span className="fp-metric-label">{project.metricLabel.toLowerCase()}</span>
          </div>

          <div className="fp-stack">
            {project.primaryStack.map((tech) => (
              <span key={tech} className="fp-stack-tag">{tech.toLowerCase()}</span>
            ))}
          </div>
        </div>

        <div className="fp-links">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="fp-link">
              GitHub <ArrowIcon />
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="fp-link">
              Live <ArrowIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const FeaturedProjects: React.FC = () => (
  <section className="featured" id="projects">
    <h2 className="section-label">featured work</h2>
    {FEATURED_PROJECTS.map((project, index) => (
      <FeaturedEntry key={project.id} project={project} index={index} />
    ))}
  </section>
);

export default FeaturedProjects;
