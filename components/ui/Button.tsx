'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface ButtonAsButton extends BaseButtonProps {
  href?: never;
  onClick?: () => void;
}

interface ButtonAsLink extends BaseButtonProps {
  href: string;
  onClick?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-black hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] relative overflow-hidden',
  secondary: 'bg-transparent border-2 border-gold text-gold hover:bg-gold/10',
  ghost: 'bg-transparent text-gold hover:bg-gold/5',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '', disabled = false, href, onClick }, ref) => {
    const baseClasses = 'font-playfair font-medium tracking-wide uppercase transition-all duration-300 relative inline-flex items-center justify-center';
    const variantClasses = buttonVariants[variant];
    const sizeClasses = buttonSizes[size];
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`;

    const motionProps: HTMLMotionProps<any> = {
      whileHover: disabled ? {} : { scale: 1.02 },
      whileTap: disabled ? {} : { scale: 0.98 },
      transition: { type: 'spring', stiffness: 400, damping: 17 },
    };

    const shimmerEffect = variant === 'primary' && !disabled && (
      <motion.span
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{
          x: '200%',
          transition: {
            duration: 0.6,
            ease: 'easeInOut',
          },
        }}
      />
    );

    if (href && !disabled) {
      return (
        <Link href={href} className={combinedClasses} ref={ref as any}>
          <motion.span className="relative z-10 inline-flex items-center justify-center w-full h-full" {...motionProps}>
            {shimmerEffect}
            {children}
          </motion.span>
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref as any}
        className={combinedClasses}
        onClick={onClick}
        disabled={disabled}
        {...motionProps}
      >
        {shimmerEffect}
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
