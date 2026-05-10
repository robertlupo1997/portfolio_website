import React from 'react';
import { useMagneticEffect } from '../hooks/useMagneticEffect';

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  href, children, className = '', external = false, onClick,
}) => {
  const ref = useMagneticEffect(0.3);

  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      className={className}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
};

export default MagneticButton;
