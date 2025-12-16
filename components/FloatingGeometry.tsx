import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface GeometryProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

const WireframeIcosahedron: React.FC<GeometryProps> = ({ mouse }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    if (meshRef.current && wireRef.current) {
      // Slow rotation
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.005;
      wireRef.current.rotation.x += 0.003;
      wireRef.current.rotation.y += 0.005;

      // Subtle mouse follow
      const targetX = mouse.current.x * 0.3;
      const targetY = -mouse.current.y * 0.3;
      meshRef.current.rotation.z += (targetX - meshRef.current.rotation.z) * 0.02;
      meshRef.current.rotation.x += (targetY - meshRef.current.rotation.x) * 0.01;
      wireRef.current.rotation.z += (targetX - wireRef.current.rotation.z) * 0.02;
      wireRef.current.rotation.x += (targetY - wireRef.current.rotation.x) * 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        {/* Solid inner shape with transmission material */}
        <mesh ref={meshRef} scale={1.8}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#FF6B00"
            transparent
            opacity={0.15}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Wireframe outer */}
        <lineSegments ref={wireRef} scale={1.85}>
          <edgesGeometry args={[new THREE.IcosahedronGeometry(1, 0)]} />
          <lineBasicMaterial color="#FF6B00" linewidth={1} transparent opacity={0.6} />
        </lineSegments>
      </group>
    </Float>
  );
};

interface FloatingGeometryProps {
  className?: string;
}

const FloatingGeometry: React.FC<FloatingGeometryProps> = ({ className = '' }) => {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  };

  // Respect reduced motion
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  return (
    <div
      className={`${className}`}
      onMouseMove={handleMouseMove}
      style={{ touchAction: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FF6B00" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
        <WireframeIcosahedron mouse={mouse} />
      </Canvas>
    </div>
  );
};

export default FloatingGeometry;
