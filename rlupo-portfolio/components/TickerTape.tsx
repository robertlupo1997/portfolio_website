import React from 'react';

interface TickerTapeProps {
  text: string;
  direction?: 'left' | 'right';
  className?: string;
}

const TickerTape: React.FC<TickerTapeProps> = ({ text, direction = 'left', className = '' }) => {
  const content = (
    <>
      <span className="mx-4 md:mx-6">{text}</span>
      <span className="mx-4 md:mx-6 text-[#00ffa3]">●</span>
    </>
  );

  return (
    <div className={`relative overflow-hidden w-full whitespace-nowrap py-4 select-none ${className}`}>
      <div className={`inline-block ${direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'}`}>
        <div className="flex items-center text-xl md:text-3xl font-bold tracking-tight uppercase font-primary">
          {content}
          {content}
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
