import React from 'react';

interface MarqueeProps {
  text: string;
  direction?: 'left' | 'right';
  outlined?: boolean;
  className?: string;
  textClassName?: string;
  speed?: number;
}

const Marquee: React.FC<MarqueeProps> = ({ 
  text, 
  direction = 'left',
  outlined = true,
  className = '',
  textClassName = '',
  speed = 30
}) => {
  // Repeat text enough times to fill the screen
  const repeats = 12;
  
  return (
    <div className={`relative overflow-hidden whitespace-nowrap select-none ${className}`}>
      <div 
        className={`inline-flex ${direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {Array.from({ length: repeats }).map((_, i) => (
          <span 
            key={i}
            className={`
              font-display font-black uppercase pr-8 md:pr-12
              ${outlined ? 'text-outline' : ''}
              ${textClassName}
            `}
            style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
