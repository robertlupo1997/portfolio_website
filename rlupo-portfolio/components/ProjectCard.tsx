import React, { useState } from 'react';
import { Project } from '../types';
import { ArrowUpRight, Github, Play } from 'lucide-react';
import DemoModal from './DemoModal';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageUrl = `https://picsum.photos/800/600?random=${index + 10}`;

  return (
    <>
      <div className="group block w-full border-b border-black py-12 first:border-t">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Index & Meta */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full py-2">
            <div className="font-mono text-xs uppercase mb-4">
              {(index + 1).toString().padStart(2, '0')} / {project.category}
            </div>
            <div className="hidden lg:flex gap-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-black rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-gray-800"
                title="View on GitHub"
              >
                <Github className="text-white" size={20} />
              </a>
              {project.liveUrl && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75 hover:bg-orange-500"
                  title="View Live Demo"
                >
                  <Play className="text-white ml-0.5" size={20} fill="white" />
                </button>
              )}
            </div>
          </div>

          {/* Title & Desc */}
          <div className="lg:col-span-4">
            <h3 className="text-4xl md:text-5xl font-bold uppercase font-display leading-none mb-4 group-hover:text-orange-600 transition-colors">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map(tag => (
                <span key={tag} className="border border-black px-2 py-1 text-[10px] font-mono uppercase rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm md:text-base text-gray-600 max-w-md mb-4">
              {project.description}
            </p>

            {/* Mobile buttons */}
            <div className="flex gap-3 lg:hidden">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-mono uppercase hover:bg-gray-800 transition-colors"
              >
                <Github size={14} />
                GitHub
              </a>
              {project.liveUrl && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-xs font-mono uppercase hover:bg-orange-500 transition-colors"
                >
                  <Play size={14} fill="white" />
                  Live Demo
                </button>
              )}
            </div>
          </div>

          {/* Image Preview */}
          <div
            className="lg:col-span-5 relative overflow-hidden aspect-[4/3] lg:aspect-[16/10] bg-gray-200 cursor-pointer"
            onClick={() => project.liveUrl ? setIsModalOpen(true) : window.open(project.githubUrl, '_blank')}
          >
            <img
              src={imageUrl}
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
            />
            {project.liveUrl && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                  <Play className="text-white ml-1" size={28} fill="white" />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Demo Modal */}
      {project.liveUrl && (
        <DemoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          url={project.liveUrl}
          title={project.title}
        />
      )}
    </>
  );
};

export default ProjectCard;
