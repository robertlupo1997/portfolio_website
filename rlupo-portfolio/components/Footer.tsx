import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F0F0F0] pt-24 pb-8 px-4 md:px-8 flex flex-col justify-between min-h-[60vh]">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         <div>
            <p className="font-mono text-xs uppercase opacity-50 mb-4">( Contact )</p>
            <h2 className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tight leading-none mb-8">
              Let's work<br/>together.
            </h2>
            <a href="mailto:hello@robertlupo.dev" className="inline-flex items-center gap-2 text-xl font-mono border-b border-black pb-1 hover:text-orange-600 hover:border-orange-600 transition-colors">
              hello@rlupo.dev <ArrowUpRight size={20} />
            </a>
         </div>

         <div className="flex flex-col justify-end md:items-end">
            <nav className="flex flex-col gap-2 text-right">
              {['Github', 'LinkedIn', 'Twitter', 'Resume'].map(link => (
                <a key={link} href="#" className="text-4xl font-display font-bold uppercase hover:text-orange-600 transition-colors">
                  {link}
                </a>
              ))}
            </nav>
         </div>
      </div>

      <div className="mt-24 border-t-2 border-black pt-4 flex justify-between items-end">
        <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter text-black uppercase font-display">
          Rlupo.dev
        </h1>
        <div className="hidden md:block font-mono text-xs text-right pb-2">
           DESIGNED & BUILT<br/>IN NEW YORK
        </div>
      </div>

    </footer>
  );
};

export default Footer;