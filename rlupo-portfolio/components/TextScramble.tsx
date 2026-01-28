import React, { useEffect, useRef, useState, ElementType } from 'react';
import { useTextScramble } from '../hooks/useTextScramble';

interface TextScrambleProps {
  text: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  triggerOnView?: boolean;
  threshold?: number;
  delay?: number;
}

const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  as: Component = 'span',
  className = '',
  duration = 1500,
  triggerOnView = true,
  threshold = 0.3,
  delay = 0,
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldTrigger, setShouldTrigger] = useState(false);
  const hasTriggeredRef = useRef(false);

  const { displayText, isScrambling } = useTextScramble({
    text,
    duration,
    trigger: shouldTrigger,
  });

  useEffect(() => {
    if (!triggerOnView) {
      // If not trigger on view, start immediately after delay
      const timer = setTimeout(() => setShouldTrigger(true), delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            setIsInView(true);
            hasTriggeredRef.current = true;
            // Apply delay before triggering scramble
            setTimeout(() => setShouldTrigger(true), delay);
          }
        });
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [triggerOnView, threshold, delay]);

  return React.createElement(
    Component,
    {
      ref: elementRef,
      className: `text-scramble ${className} ${isScrambling ? 'scrambling' : ''} ${isInView || !triggerOnView ? 'visible' : ''}`,
      'data-text': text,
    },
    displayText
  );
};

export default TextScramble;
