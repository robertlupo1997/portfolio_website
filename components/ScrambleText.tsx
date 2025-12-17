import React from 'react';
import { useScramble } from 'use-scramble';

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleOnHover?: boolean;
  scrambleOnClick?: boolean;
  speed?: number;
  tick?: number;
  step?: number;
  scramble?: number;
  seed?: number;
  chance?: number;
  overflow?: boolean;
  range?: [number, number];
}

const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  scrambleOnHover = true,
  scrambleOnClick = true,
  speed = 0.5,
  tick = 1,
  step = 1,
  scramble = 4,
  seed = 0,
  chance = 0.8,
  overflow = true,
  range = [65, 125],
}) => {
  const { ref, replay } = useScramble({
    text,
    speed,
    tick,
    step,
    scramble,
    seed,
    chance,
    overflow,
    range,
    playOnMount: true,
  });

  const handleInteraction = () => {
    replay();
  };

  return (
    <span
      ref={ref}
      className={`cursor-pointer select-none ${className}`}
      onClick={scrambleOnClick ? handleInteraction : undefined}
      onMouseEnter={scrambleOnHover ? handleInteraction : undefined}
    />
  );
};

export default ScrambleText;
