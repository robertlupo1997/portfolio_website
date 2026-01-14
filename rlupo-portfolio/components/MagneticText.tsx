import React, { useEffect, useRef, useState } from 'react';

interface MagneticTextProps {
  text: string;
  className?: string;
  cellSize?: number;
  repelRadius?: number;
  repelStrength?: number;
}

interface Cell {
  element: HTMLDivElement;
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
}

/**
 * MagneticText - Zajno-style magnetic text effect
 * Text breaks into cells that repel from the mouse cursor
 */
const MagneticText: React.FC<MagneticTextProps> = ({
  text,
  className = '',
  cellSize = 24,
  repelRadius = 100,
  repelStrength = 15,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellContainerRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<Cell[]>([]);
  const [isReady, setIsReady] = useState(false);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const cellContainer = cellContainerRef.current;
    if (!container || !canvas || !cellContainer) return;

    // Skip on touch devices
    if ('ontouchstart' in window) {
      setIsReady(true);
      return;
    }

    // Get computed styles to match the original text
    const computedStyle = window.getComputedStyle(container);
    const fontSize = parseFloat(computedStyle.fontSize) || 200;
    const fontFamily = computedStyle.fontFamily || 'sans-serif';
    const fontWeight = computedStyle.fontWeight || '900';

    // Set canvas size based on container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw text to canvas
    ctx.fillStyle = '#000';
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Clear existing cells using DOM methods
    while (cellContainer.firstChild) {
      cellContainer.removeChild(cellContainer.firstChild);
    }

    // Create cells for filled pixels
    const cells: Cell[] = [];
    const cols = Math.ceil(canvas.width / cellSize);
    const rows = Math.ceil(canvas.height / cellSize);
    const dataUrl = canvas.toDataURL();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize;
        const y = row * cellSize;

        // Check if this cell has any filled pixels
        let hasFill = false;
        for (let py = y; py < y + cellSize && py < canvas.height; py++) {
          for (let px = x; px < x + cellSize && px < canvas.width; px++) {
            const i = (py * canvas.width + px) * 4;
            if (pixels[i + 3] > 128) { // Alpha > 128
              hasFill = true;
              break;
            }
          }
          if (hasFill) break;
        }

        if (hasFill) {
          const cell = document.createElement('div');
          cell.className = 'magnetic-cell';
          cell.style.position = 'absolute';
          cell.style.left = `${x}px`;
          cell.style.top = `${y}px`;
          cell.style.width = `${cellSize}px`;
          cell.style.height = `${cellSize}px`;
          cell.style.backgroundImage = `url(${dataUrl})`;
          cell.style.backgroundPosition = `-${x}px -${y}px`;
          cell.style.backgroundSize = `${canvas.width}px ${canvas.height}px`;
          cell.style.willChange = 'transform';
          cell.style.pointerEvents = 'none';

          cellContainer.appendChild(cell);
          cells.push({
            element: cell,
            baseX: x,
            baseY: y,
            currentX: 0,
            currentY: 0,
          });
        }
      }
    }

    cellsRef.current = cells;
    setIsReady(true);

    // Animation loop
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      const mouse = mouseRef.current;
      const containerRect = container.getBoundingClientRect();

      cells.forEach(cell => {
        const cellCenterX = containerRect.left + cell.baseX + cellSize / 2;
        const cellCenterY = containerRect.top + cell.baseY + cellSize / 2;

        const dx = mouse.x - cellCenterX;
        const dy = mouse.y - cellCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = 0;
        let targetY = 0;

        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * repelStrength;
          targetX = -(dx / dist) * force;
          targetY = -(dy / dist) * force;
        }

        // Smooth interpolation
        cell.currentX = lerp(cell.currentX, targetX, 0.15);
        cell.currentY = lerp(cell.currentY, targetY, 0.15);

        cell.element.style.transform = `translate(${cell.currentX}px, ${cell.currentY}px)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // Start animation
    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [text, cellSize, repelRadius, repelStrength]);

  return (
    <div
      ref={containerRef}
      className={`magnetic-text-container ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Hidden canvas for rendering */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      {/* Cell container */}
      <div ref={cellContainerRef} className="magnetic-cells" style={{ position: 'absolute', inset: 0 }} />
      {/* Original text (hidden but maintains layout) */}
      <span style={{ visibility: isReady ? 'hidden' : 'visible' }}>{text}</span>
    </div>
  );
};

export default MagneticText;
