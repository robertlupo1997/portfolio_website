import React from 'react';

interface TickerTapeProps {
  text: string;
  direction?: 'left' | 'right';
  className?: string;
}

const TickerTape: React.FC<TickerTapeProps> = ({ text, direction = 'left', className = '' }) => {
  const content = (
    <>
      <span className="mx-4">{text}</span>
      <span className="mx-4 text-orange-500">●</span>
      <span className="mx-4 font-mono">2024-2025</span>
      <span className="mx-4 text-orange-500">●</span>
      <span className="mx-4">{text}</span>
      <span className="mx-4 text-orange-500">●</span>
      <span className="mx-4 font-mono">AVAILABLE FOR WORK</span>
      <span className="mx-4 text-orange-500">●</span>
    </>
  );

  return (
    <div className={`relative overflow-hidden w-full whitespace-nowrap bg-orange-600 text-black py-3 select-none ${className}`}>
      <div className={`inline-block ${direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'}`}>
        <div className="flex items-center text-xl md:text-3xl font-bold tracking-tighter uppercase font-display">
          {content}
          {content}
          {content}
          {content}
        </div>
      </div>
    </div>
  );
};

export default TickerTape;