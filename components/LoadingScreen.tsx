import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_CONFIG } from '../constants';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Respect reduced motion - skip loading animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onLoadingComplete();
      return;
    }

    // Simulate loading progress
    const duration = 2000; // 2 seconds total
    const interval = 20; // Update every 20ms
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment + Math.random() * 2;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onLoadingComplete, 800);
          }, 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          className="fixed inset-0 z-[10000] bg-chrls-cream flex flex-col items-center justify-center"
          exit={{
            clipPath: 'inset(0 0 100% 0)',
          }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="font-display font-black text-6xl md:text-8xl tracking-[-0.02em]">
              {SITE_CONFIG.name}<span className="text-chrls-orange">.</span>{SITE_CONFIG.domain}
            </h1>
          </motion.div>

          {/* Progress bar container */}
          <div className="w-64 md:w-96 relative">
            {/* Background bar */}
            <div className="h-1 bg-black/10 w-full" />

            {/* Progress bar */}
            <motion.div
              className="absolute top-0 left-0 h-1 bg-chrls-orange"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />

            {/* Percentage */}
            <div className="flex justify-between mt-4 font-mono text-[10px] uppercase tracking-wider">
              <span className="text-black/50">Loading</span>
              <span className="text-chrls-orange font-bold">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-8 font-mono text-[9px] uppercase tracking-wider text-black/40"
          >
            {SITE_CONFIG.title}
          </motion.div>
        </motion.div>
      ) : (
        /* Exit animation - orange wipe */
        <motion.div
          className="fixed inset-0 z-[10000] bg-chrls-orange"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
