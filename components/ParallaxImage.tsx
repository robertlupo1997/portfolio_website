import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // Negative = slower, Positive = faster parallax
  scale?: number; // Extra scale to prevent gaps during parallax
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = '',
  speed = -50,
  scale = 1.2,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default ParallaxImage;
