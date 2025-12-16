import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

interface ParticleFieldProps {
  className?: string;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const particles: Particle[] = [];
      const particleCount = 600;
      const noiseScale = 0.005;
      const noiseStrength = 2;

      class Particle {
        pos: p5.Vector;
        vel: p5.Vector;
        acc: p5.Vector;
        maxSpeed: number;
        prevPos: p5.Vector;
        alpha: number;

        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
          this.maxSpeed = p.random(1, 2.5);
          this.prevPos = this.pos.copy();
          this.alpha = p.random(15, 60);
        }

        update() {
          // Flow field using Perlin noise
          const angle = p.noise(
            this.pos.x * noiseScale,
            this.pos.y * noiseScale,
            p.frameCount * 0.002
          ) * p.TWO_PI * noiseStrength;

          const force = p5.Vector.fromAngle(angle);
          force.mult(0.2);
          this.acc.add(force);

          // Mouse influence
          if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            const mousePos = p.createVector(p.mouseX, p.mouseY);
            const dir = p5.Vector.sub(mousePos, this.pos);
            const dist = dir.mag();
            if (dist < 120) {
              dir.normalize();
              dir.mult(p.map(dist, 0, 120, 1.5, 0));
              this.acc.add(dir);
            }
          }

          this.vel.add(this.acc);
          this.vel.limit(this.maxSpeed);
          this.prevPos = this.pos.copy();
          this.pos.add(this.vel);
          this.acc.mult(0);

          // Wrap around edges
          if (this.pos.x > p.width) { this.pos.x = 0; this.prevPos.x = 0; }
          if (this.pos.x < 0) { this.pos.x = p.width; this.prevPos.x = p.width; }
          if (this.pos.y > p.height) { this.pos.y = 0; this.prevPos.y = 0; }
          if (this.pos.y < 0) { this.pos.y = p.height; this.prevPos.y = p.height; }
        }

        show() {
          // CHRLS Orange: #FF6B00 = rgb(255, 107, 0)
          p.stroke(255, 107, 0, this.alpha);
          p.strokeWeight(1);
          p.line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current!.offsetWidth,
          containerRef.current!.offsetHeight
        );
        canvas.parent(containerRef.current!);
        p.background(245, 245, 240); // chrls-cream

        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }
      };

      p.draw = () => {
        // Subtle fade effect for trails
        p.fill(245, 245, 240, 20);
        p.noStroke();
        p.rect(0, 0, p.width, p.height);

        particles.forEach(particle => {
          particle.update();
          particle.show();
        });
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(
            containerRef.current.offsetWidth,
            containerRef.current.offsetHeight
          );
        }
      };
    };

    p5InstanceRef.current = new p5(sketch);

    return () => {
      p5InstanceRef.current?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`particle-field absolute inset-0 -z-10 ${className}`}
      aria-hidden="true"
    />
  );
};

export default ParticleField;
