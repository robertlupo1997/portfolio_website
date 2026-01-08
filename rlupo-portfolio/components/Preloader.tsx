import React, { useState, useEffect } from 'react';

const Preloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="preloader">
      <div className="preloader_bar" style={{ transform: `scaleX(${progress / 100})` }} />
      <div className="preloader_num">
        <span className="preloader_span">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default Preloader;
