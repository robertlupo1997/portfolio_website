import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 pb-8 px-4 md:px-8">
      
      {/* Top Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs uppercase border-b border-black/10 pb-4">
        <div>
          <span className="opacity-50 block">Role</span>
          Machine Learning Engineer
        </div>
        <div>
          <span className="opacity-50 block">Location</span>
          New York, USA
        </div>
        <div>
          <span className="opacity-50 block">Status</span>
          Available for hire
        </div>
        <div className="text-right hidden md:block">
           SCROLL DOWN
        </div>
      </div>

      {/* Main Typography */}
      <div className="flex-grow flex flex-col justify-center py-12">
        <h1 className="text-[14vw] leading-[0.8] font-black tracking-tighter font-display text-black uppercase">
          Robert<br/>
          <span className="ml-[10vw] text-orange-600">Lupo</span>
        </h1>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-black pt-6">
         <div className="md:col-span-8">
            <p className="text-xl md:text-3xl font-medium leading-tight max-w-4xl indent-12">
              An independent developer specialized in machine learning pipelines, predictive modeling, and data-driven solutions. Crafting robust code for complex problems.
            </p>
         </div>
         <div className="md:col-span-4 flex justify-end items-end">
            <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center animate-bounce">
              <ArrowDown size={20} />
            </div>
         </div>
      </div>
    </section>
  );
};

export default Hero;