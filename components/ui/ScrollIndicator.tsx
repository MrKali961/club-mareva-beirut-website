'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  className?: string;
  text?: string;
}

export default function ScrollIndicator({ className = '', text = 'Scroll to explore' }: ScrollIndicatorProps) {
  const handleClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex flex-col items-center gap-2 cursor-pointer ${className}`}
      aria-label="Scroll down to explore"
    >
      {/* Text label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="text-cream/60 text-xs tracking-[0.2em] uppercase font-playfair group-hover:text-gold/80 transition-colors duration-300"
      >
        {text}
      </motion.span>

      {/* Animated line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent origin-top"
      />

      {/* Bouncing chevron */}
      <motion.div
        animate={{
          y: [0, 6, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-gold group-hover:text-gold-light transition-colors duration-300"
      >
        <ChevronDown size={20} strokeWidth={1.5} />
      </motion.div>

      {/* Subtle glow on hover */}
      <motion.div
        className="absolute -bottom-4 w-8 h-8 rounded-full bg-gold/0 group-hover:bg-gold/10 transition-all duration-500 blur-xl"
      />
    </motion.button>
  );
}
