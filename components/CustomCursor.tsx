import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Smooth spring animation for cursor
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Hide default cursor
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Detect hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for links and buttons
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
        
        // Check for data-cursor-text attribute
        const cursorTextEl = target.closest('[data-cursor-text]') as HTMLElement;
        if (cursorTextEl) {
          setCursorText(cursorTextEl.dataset.cursorText || '');
        } else if (target.closest('a[href*="github"]') || target.closest('[href*="github"]')) {
          setCursorText('VIEW');
        } else {
          setCursorText('');
        }
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      setCursorText('');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  // Don't render on touch devices or reduced motion
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return null;
    }
    if (window.matchMedia('(pointer: coarse)').matches) {
      return null;
    }
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 2.5 : 1,
            backgroundColor: isHovering ? '#FF6B00' : '#000000',
          }}
          transition={{ duration: 0.15 }}
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            marginLeft: -6,
            marginTop: -6,
          }}
        >
          {/* Cursor text */}
          {cursorText && isHovering && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute text-[8px] font-mono font-bold text-white whitespace-nowrap"
              style={{ mixBlendMode: 'difference' }}
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Cursor ring (follows with delay) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0 : 0.5,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid #FF6B00',
            marginLeft: -20,
            marginTop: -20,
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
