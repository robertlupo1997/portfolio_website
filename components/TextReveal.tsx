import React from 'react';
import { motion, Variants } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  splitBy?: 'word' | 'character';
}

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.03,
  duration = 0.5,
  splitBy = 'word',
}) => {
  const items = splitBy === 'word' ? text.split(' ') : text.split('');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.div
      className={`${className} overflow-hidden`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block"
          style={{
            marginRight: splitBy === 'word' ? '0.25em' : undefined,
            transformOrigin: 'bottom',
            perspective: '1000px',
          }}
        >
          {item}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextReveal;
