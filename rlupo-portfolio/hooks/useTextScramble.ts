import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTextScrambleOptions {
  text: string;
  duration?: number;
  scrambleChars?: string;
  trigger?: boolean;
}

interface UseTextScrambleReturn {
  displayText: string;
  isScrambling: boolean;
  triggerScramble: () => void;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const useTextScramble = ({
  text,
  duration = 1000,
  scrambleChars = DEFAULT_CHARS,
  trigger = false,
}: UseTextScrambleOptions): UseTextScrambleReturn => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(false);

  const getRandomChar = useCallback(() => {
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  }, [scrambleChars]);

  const runScramble = useCallback(() => {
    if (isScrambling) return;

    setIsScrambling(true);
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * text.length);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < revealedCount) {
          result += text[i];
        } else {
          result += Math.random() > 0.3 ? getRandomChar() : text[i];
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setIsScrambling(false);
        startTimeRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [text, duration, getRandomChar, isScrambling]);

  // Manual trigger for hover effects
  const triggerScramble = useCallback(() => {
    runScramble();
  }, [runScramble]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // Auto-trigger ONCE when trigger changes to true
  useEffect(() => {
    if (trigger && !hasTriggeredRef.current && !isScrambling) {
      hasTriggeredRef.current = true;
      runScramble();
    }
  }, [trigger, runScramble, isScrambling]);

  return { displayText, isScrambling, triggerScramble };
};

export default useTextScramble;
