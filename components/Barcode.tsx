import React from 'react';

interface BarcodeProps {
  className?: string;
  bars?: number;
  color?: string;
  seed?: number;
}

// Deterministic pseudo-random based on seed
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const Barcode: React.FC<BarcodeProps> = ({ 
  className = "", 
  bars = 20, 
  color = "black",
  seed = 42 
}) => {
  // Generate consistent bar widths based on seed
  const barWidths = Array.from({ length: bars }, (_, i) => {
    const rand = seededRandom(seed + i);
    return rand > 0.6 ? 3 : rand > 0.3 ? 2 : 1;
  });

  return (
    <svg 
      className={className}
      viewBox={`0 0 ${bars * 4} 24`}
      fill="none"
      preserveAspectRatio="none"
    >
      {barWidths.map((width, i) => (
        <rect
          key={i}
          x={i * 4}
          y="0"
          width={width}
          height="24"
          fill={color === "white" ? "#FFFFFF" : "#000000"}
        />
      ))}
    </svg>
  );
};

export default Barcode;
