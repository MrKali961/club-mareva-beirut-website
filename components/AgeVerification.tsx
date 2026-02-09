'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const AGE_VERIFICATION_KEY = 'club-mareva-age-verified';
const VERIFICATION_EXPIRY_DAYS = 30;

export default function AgeVerification() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check localStorage for existing verification
    const stored = localStorage.getItem(AGE_VERIFICATION_KEY);
    if (stored) {
      try {
        const { verified, expiry } = JSON.parse(stored);
        if (verified && new Date(expiry) > new Date()) {
          setIsVerified(true);
          return;
        }
      } catch {
        // Invalid stored data, show verification
      }
    }
    setIsVerified(false);
  }, []);

  const handleVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      // Store verification with expiry
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + VERIFICATION_EXPIRY_DAYS);
      localStorage.setItem(
        AGE_VERIFICATION_KEY,
        JSON.stringify({ verified: true, expiry: expiry.toISOString() })
      );
      setIsExiting(true);
      setTimeout(() => setIsVerified(true), 600);
    } else {
      // Redirect to a safe page or show message
      window.location.href = 'https://www.google.com';
    }
  };

  // Don't render anything while checking localStorage
  if (isVerified === null) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black" />
    );
  }

  // Already verified
  if (isVerified) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        >
          {/* Background with noise texture */}
          <div className="absolute inset-0 bg-black">
            {/* Subtle radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.08)_0%,transparent_70%)]" />
            {/* Noise overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2
            }}
            className="relative z-10 max-w-md mx-4 text-center"
          >
            {/* Decorative top line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-24 h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-gold to-transparent"
            />

            {/* Logo / Brand */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-6"
            >
              <h1 className="font-playfair text-3xl md:text-4xl tracking-wider">
                <span className="text-gold">Club</span>{' '}
                <span className="text-white">Mareva</span>
              </h1>
              <p className="mt-2 text-cream/60 text-sm tracking-[0.3em] uppercase font-playfair">
                Beirut
              </p>
            </motion.div>

            {/* Decorative emblem */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-20 h-16 mx-auto mb-8"
            >
              <Image
                src="/images/club-mareva-logo-gold.svg"
                alt="Club Mareva Beirut"
                width={80}
                height={60}
                className="object-contain"
              />
            </motion.div>

            {/* Main question */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="font-playfair text-xl md:text-2xl text-white mb-3">
                Welcome to an Exclusive Experience
              </h2>
              <p className="text-cream/70 font-playfair text-base mb-8 leading-relaxed">
                Are you of legal smoking age in your country of residence?
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                onClick={() => handleVerify(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-10 py-4 bg-gold text-black font-playfair font-medium tracking-wider uppercase text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,162,39,0.4)]"
              >
                <span className="relative z-10">Yes, I Am</span>
                {/* Shimmer effect */}
                <motion.span
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  whileHover={{
                    x: '200%',
                    transition: { duration: 0.6, ease: 'easeInOut' },
                  }}
                />
              </motion.button>

              <motion.button
                onClick={() => handleVerify(false)}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(201, 162, 39, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-transparent border border-gold/50 text-gold font-playfair font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:border-gold"
              >
                No, I'm Not
              </motion.button>
            </motion.div>

            {/* Legal disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-8 text-cream/40 text-xs font-playfair leading-relaxed max-w-sm mx-auto"
            >
              By entering this site, you agree to our Terms of Service and confirm
              that you are of legal smoking age in your jurisdiction.
            </motion.p>

            {/* Decorative bottom line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-24 h-px mx-auto mt-8 bg-gradient-to-r from-transparent via-gold to-transparent"
            />
          </motion.div>

          {/* Corner accents */}
          <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-gold/20" />
          <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-gold/20" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-gold/20" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-gold/20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
