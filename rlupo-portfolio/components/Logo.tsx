import React from 'react';

interface LogoProps {
  color?: string;
  width?: number;
}

const Logo: React.FC<LogoProps> = ({ color = '#E8E5DF', width = 200 }) => {
  // SVG viewport: 180 x 52
  // Letters built from parallelogram strokes at ~15° oblique angle
  // Each letter is ~28px wide, 28px tall, spaced 6px apart
  // Stroke width: 6px, skew offset: 7px (tan15° * 28 ≈ 7.5)
  // Baseline: y=28, capline: y=0
  const sk = 7; // horizontal skew for oblique
  const h = 28; // letter height
  const sw = 6; // stroke width (approximate bar thickness)

  // Parallelogram helper: given top-left x, produces a skewed rect
  // Points: top-left, top-right, bottom-right, bottom-left
  const para = (x: number, y: number, w: number, ht: number, skewX = sk) =>
    `${x + skewX},${y} ${x + skewX + w},${y} ${x + w},${y + ht} ${x},${y + ht}`;

  // Vertical bar: thin parallelogram
  const vbar = (x: number, y: number, ht = h) => para(x, y, sw, ht);

  // Horizontal bar: flat parallelogram (very short height = bar thickness)
  const hbar = (x: number, y: number, w: number) => para(x, y, w, sw, 0);

  const baseY = 0;

  // --- L: vertical bar (left) + bottom horizontal ---
  // vertical: x=0
  // bottom horizontal: y=28-6=22, width=20
  const L = (ox: number) => (
    <g key="L">
      <polygon points={vbar(ox, baseY)} fill={color} />
      <polygon points={hbar(ox, baseY + h - sw, 20)} fill={color} />
    </g>
  );

  // --- U: left vertical + right vertical + bottom horizontal ---
  // left at ox, right at ox+14
  const U = (ox: number) => (
    <g key="U">
      <polygon points={vbar(ox, baseY)} fill={color} />
      <polygon points={vbar(ox + 14, baseY)} fill={color} />
      <polygon points={hbar(ox, baseY + h - sw, 20)} fill={color} />
    </g>
  );

  // --- P: vertical bar + top horizontal + mid horizontal + right vertical (top half) ---
  const P = (ox: number) => (
    <g key="P">
      <polygon points={vbar(ox, baseY)} fill={color} />
      {/* top horizontal */}
      <polygon points={hbar(ox, baseY, 20)} fill={color} />
      {/* mid horizontal at h/2 */}
      <polygon points={hbar(ox, baseY + h / 2 - sw / 2, 20)} fill={color} />
      {/* right vertical: top half only */}
      <polygon points={vbar(ox + 14, baseY, h / 2)} fill={color} />
    </g>
  );

  // --- O: top horizontal + bottom horizontal + left vertical + right vertical ---
  const O = (ox: number) => (
    <g key="O">
      <polygon points={hbar(ox, baseY, 20)} fill={color} />
      <polygon points={hbar(ox, baseY + h - sw, 20)} fill={color} />
      <polygon points={vbar(ox, baseY)} fill={color} />
      <polygon points={vbar(ox + 14, baseY)} fill={color} />
    </g>
  );

  // Letter x-offsets (each letter ~27px wide including gap)
  const gap = 6;
  const lw = 20 + sw; // letter bounding width
  const xL = 0;
  const xU = xL + lw + gap;
  const xP = xU + lw + gap;
  const xO = xP + lw + gap;

  // Total mark width ≈ xO + lw + sk = xO + 26 + 7 = 127
  const markW = xO + lw + sk + 2;
  const svgW = 180;
  const svgH = 52;

  const scale = width / svgW;

  return (
    <svg
      width={width}
      height={svgH * scale}
      viewBox={`0 0 ${svgW} ${svgH}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Trey Lupo"
      role="img"
      style={{ display: 'block' }}
    >
      {/* LUPO mark */}
      <g transform={`translate(${(svgW - markW) / 2}, 4)`}>
        {L(xL)}
        {U(xU)}
        {P(xP)}
        {O(xO)}
      </g>

      {/* Subtext: "TREY LUPO" + decoration */}
      <text
        x={svgW / 2}
        y={svgH - 10}
        textAnchor="middle"
        fontFamily="var(--font-departure)"
        fontSize="7"
        letterSpacing="3"
        fill={color}
        opacity={0.55}
      >
        TREY LUPO
      </text>
      <text
        x={svgW / 2}
        y={svgH - 2}
        textAnchor="middle"
        fontFamily="var(--font-departure)"
        fontSize="6"
        letterSpacing="2"
        fill={color}
        opacity={0.3}
      >
        / / / / / / /
      </text>
    </svg>
  );
};

export default Logo;
