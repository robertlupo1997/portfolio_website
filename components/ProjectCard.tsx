import React, { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Project } from '../types';
import Barcode from './Barcode';
import QRCode from './QRCode';

interface ProjectCardProps {
  project: Project;
  index: number;
}

// Card animation variants for staggered grid
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    }
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Parallax effect for image
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  // Professional data science themed images from Unsplash
  const imageThemes: Record<string, string> = {
    'kkbox': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    'obj-detect': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    'extraalearn': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    'amazon-rec': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    'shinkansen': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    'foodhub': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    'life-expectancy': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    'origin-projects': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
  };

  const imageUrl = imageThemes[project.id] || `https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop`;

  const handleDemoClick = (e: React.MouseEvent) => {
    if (project.demoUrl) {
      e.preventDefault();
      e.stopPropagation();
      window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.a
      ref={cardRef}
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full max-w-[320px] card-hover"
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="border-2 border-black bg-white overflow-hidden marching-ants">

        {/* Image Section - Blurred like CHRLS with Parallax */}
        <div ref={imageRef} className="relative aspect-[4/3] overflow-hidden bg-gray-200">
          <motion.img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover img-blur scale-110"
            style={{ y: imageY }}
            loading="lazy"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white font-mono text-[9px] uppercase tracking-wider px-2 py-1">
              {project.category}
            </span>
          </div>

          {/* Demo Button (if available) */}
          {project.demoUrl && (
            <button
              onClick={handleDemoClick}
              className="absolute top-3 right-3 bg-chrls-orange hover:bg-chrls-orange-dark text-black p-2 transition-colors"
              title="View Demo"
            >
              <ExternalLink size={14} />
            </button>
          )}

          {/* Metric Badge - Prominent display */}
          {project.metric && project.metricValue && (
            <div className="absolute bottom-3 right-3 bg-white border-2 border-black px-2 py-1">
              <span className="font-mono text-[10px] font-bold">
                {project.metric}: {project.metricValue}
              </span>
            </div>
          )}
        </div>

        {/* Ticket Info Section - Orange background */}
        <div className="bg-chrls-orange border-t-2 border-black p-4">

          {/* Project Title */}
          <h3 className="font-display font-bold text-lg md:text-xl uppercase leading-tight mb-2 text-black">
            {project.title}
          </h3>

          {/* Description - Truncated */}
          <p className="font-mono text-[10px] text-black/80 leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Tags Row */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-black/10 font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Metadata Row */}
          <div className="flex items-end justify-between gap-2 pt-2 border-t border-black/20">

            {/* Left: Barcode + Trained Date */}
            <div className="flex items-center gap-2">
              <Barcode
                bars={12}
                className="h-5 w-10"
                seed={index * 7}
              />

              <div className="flex flex-col">
                <span className="font-mono text-[7px] uppercase tracking-wider text-black/70">
                  TRAINED
                </span>
                <span className="font-mono text-[9px] font-bold">
                  {project.trainedDate}
                </span>
              </div>
            </div>

            {/* Center: Version */}
            <div className="flex flex-col items-center">
              <span className="font-mono text-[7px] uppercase tracking-wider text-black/70">
                VERSION
              </span>
              <span className="font-mono text-[9px] font-bold">
                {project.version}
              </span>
            </div>

            {/* Right: QR Code */}
            <QRCode
              url={project.githubUrl}
              size={36}
            />
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default ProjectCard;
