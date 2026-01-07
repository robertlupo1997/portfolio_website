import React from 'react';
import { Menu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 py-6 md:px-8 mix-blend-difference text-white">
      <div className="flex justify-between items-center w-full font-mono text-sm uppercase tracking-wide">
        <div className="font-bold flex items-center gap-2">
           <span className="w-2 h-2 bg-white rounded-full block animate-pulse"></span>
           RLUPO.DEV ©2025
        </div>
        
        <nav className="hidden md:flex gap-8">
          <a href="#work" className="hover:underline">Work</a>
          <a href="#about" className="hover:underline">About</a>
          <a href="mailto:hello@robertlupo.dev" className="hover:underline">Contact</a>
        </nav>

        <button className="md:hidden">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;