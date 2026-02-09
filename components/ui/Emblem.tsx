'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface EmblemProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
  variant?: 'gold' | 'green';
}

const sizes = {
  sm: { className: 'w-6 h-6', width: 24, height: 24 },
  md: { className: 'w-8 h-8', width: 32, height: 32 },
  lg: { className: 'w-12 h-12', width: 48, height: 48 },
};

const variants = {
  gold: '/images/club-mareva-logo-gold.svg',
  green: '/images/club-mareva-logo-green.svg',
};

export default function Emblem({ size = 'md', className = '', animate = true, variant = 'gold' }: EmblemProps) {
  const { className: sizeClass, width, height } = sizes[size];

  const img = (
    <Image
      src={variants[variant]}
      alt="Club Mareva"
      width={width}
      height={height}
      className={`${sizeClass} ${className} object-contain`}
    />
  );

  if (!animate) {
    return img;
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        filter: 'drop-shadow(0 0 8px rgba(201, 162, 39, 0.5))',
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex"
    >
      {img}
    </motion.div>
  );
}
