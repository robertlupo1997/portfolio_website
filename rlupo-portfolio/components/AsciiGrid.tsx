import React, { useRef, useEffect, useCallback } from 'react';

interface AsciiGridProps {
  isActive: boolean;
}

const CHARS = '.·:+*#@%&';
const CELL = 18;
const INFLUENCE_RADIUS = 200;

const BG = '#474741';
const DIM = '#55554D';
const MID = '#7A7A6E';
const BRIGHT = '#A6A77E';
const ACCENT = '#E85D3A';

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

const AsciiGrid: React.FC<AsciiGridProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const runningRef = useRef<boolean>(false);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const gridRef = useRef<number[]>([]);
  const dimsRef = useRef({ cols: 0, rows: 0 });

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.ceil(canvas.width / CELL);
    const rows = Math.ceil(canvas.height / CELL);
    dimsRef.current = { cols, rows };
    gridRef.current = new Array(cols * rows).fill(0);
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(frameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    runningRef.current = true;

    const draw = (time: number) => {
      if (!runningRef.current) return;

      const { cols, rows } = dimsRef.current;
      const grid = gridRef.current;
      const mouse = mouseRef.current;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${CELL - 4}px 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * CELL + CELL / 2;
          const py = y * CELL + CELL / 2;
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
          const eased = proximity * proximity * proximity;
          const idx = x + y * cols;
          grid[idx] = lerp(grid[idx], eased, 0.12);
          const val = grid[idx];
          const wave = Math.sin(time * 0.001 + x * 0.15 + y * 0.1) * 0.5 + 0.5;
          const intensity = Math.min(1, val + wave * 0.15 * 0.3);
          if (intensity < 0.05) continue;
          const charIdx = Math.floor(intensity * (CHARS.length - 1));

          if (val > 0.7) ctx.fillStyle = ACCENT;
          else if (val > 0.3) ctx.fillStyle = BRIGHT;
          else if (intensity > 0.15) ctx.fillStyle = MID;
          else ctx.fillStyle = DIM;

          ctx.globalAlpha = Math.min(1, intensity * 1.5 + 0.1);
          ctx.fillText(CHARS[charIdx], px, py);
        }
      }
      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default React.memo(AsciiGrid);
