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
  startScramble: () => void;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

export const useTextScramble = ({
  text,
  duration = 1500,
  scrambleChars = DEFAULT_CHARS,
  trigger = false,
}: UseTextScrambleOptions): UseTextScrambleReturn => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const getRandomChar = useCallback(() => {
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  }, [scrambleChars]);

  const startScramble = useCallback(() => {
    if (isScrambling) return;

    setIsScrambling(true);
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Calculate how many characters should be revealed
      const revealedCount = Math.floor(progress * text.length);

      // Build the display string
      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < revealedCount) {
          result += text[i];
        } else {
          // Add some randomness to make it feel more organic
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // Auto-trigger when trigger changes to true
  useEffect(() => {
    if (trigger && !isScrambling) {
      startScramble();
    }
  }, [trigger, startScramble, isScrambling]);

  return { displayText, isScrambling, startScramble };
};

export default useTextScramble;
