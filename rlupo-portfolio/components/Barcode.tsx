import React from 'react';

interface BarcodeProps {
  className?: string;
  bars?: number;
}

const Barcode: React.FC<BarcodeProps> = ({ className = "", bars = 20 }) => {
  return (
    <div className={`flex items-stretch h-8 overflow-hidden ${className}`}>
      {Array.from({ length: bars }).map((_, i) => {
        const width = Math.random() > 0.5 ? 'w-1' : 'w-3';
        const margin = Math.random() > 0.7 ? 'mr-1' : 'mr-px';
        return (
          <div 
            key={i} 
            className={`bg-black h-full ${width} ${margin}`}
          />
        );
      })}
    </div>
  );
};

export default Barcode;