import React, { useEffect } from 'react';
import { X, ExternalLink, Loader2 } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, url, title }) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-7xl h-[90vh] bg-[#F0F0F0] border-2 border-black shadow-[8px_8px_0px_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black text-white border-b-2 border-black">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="font-mono text-xs uppercase tracking-wider">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 text-xs font-mono uppercase hover:bg-white/10 transition-colors"
            >
              <ExternalLink size={14} />
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="absolute inset-0 top-12 flex items-center justify-center bg-[#F0F0F0] pointer-events-none">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 size={32} className="animate-spin" />
            <span className="font-mono text-xs uppercase">Loading Demo...</span>
          </div>
        </div>

        {/* Iframe */}
        <iframe
          src={url}
          title={title}
          className="w-full h-[calc(100%-48px)] border-0 relative z-10 bg-white"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default DemoModal;
