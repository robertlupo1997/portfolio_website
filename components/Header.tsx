import React from 'react';
import { SITE_CONFIG } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-6">
      <div className="flex justify-between items-start w-full">
        {/* Logo - Asterisk style like CHRLS */}
        <div className="animate-spin-slow">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 100 100" 
            className="fill-current text-black"
          >
            <path d="M50 0 L55 42 L100 50 L55 58 L50 100 L45 58 L0 50 L45 42 Z" />
          </svg>
        </div>
        
        {/* Center - Contact */}
        <div className="text-center font-mono text-[10px] tracking-wider hidden md:block">
          <p className="mb-1">Say hello</p>
          <a 
            href={`mailto:${SITE_CONFIG.email}`}
            className="link-underline hover:text-chrls-orange transition-colors"
          >
            {SITE_CONFIG.email}
          </a>
        </div>

        {/* Right - Archive link */}
        <a 
          href="#projects" 
          className="font-mono text-[10px] tracking-wider underline underline-offset-2 hover:text-chrls-orange transition-colors"
        >
          ARCHIVE
        </a>
      </div>
    </header>
  );
};

export default Header;
