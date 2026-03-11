'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import type { ApiReservationSettings } from '@/lib/api/types';

interface Props {
  settings: ApiReservationSettings;
}

export default function ReservationSection({ settings }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  if (!settings.isEnabled) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-black overflow-hidden"
    >
      {/* Decorative background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(201,162,39,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_70%,rgba(39,83,62,0.15)_0%,transparent_50%)]" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column — Editorial Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-16 h-px bg-gold mb-6 mx-auto lg:mx-0 origin-left"
            />

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-playfair text-xs tracking-[0.3em] uppercase text-gold mb-4"
            >
              {settings.sectionSubtitle}
            </motion.p>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-playfair text-4xl md:text-5xl lg:text-6xl text-cream mb-6 leading-tight"
            >
              {settings.sectionTitle.split(' ').map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i} className="text-gold italic">{word}</span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-playfair text-cream/70 text-base md:text-lg mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              {settings.sectionDescription}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/reserve">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold text-black font-playfair font-medium tracking-wider uppercase text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,162,39,0.5)]"
                >
                  <CalendarCheck className="w-5 h-5" />
                  <span className="relative z-10">Reserve Your Table</span>
                  {/* Shimmer effect */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column — Decorative / Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              {/* Outer decorative border */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute inset-0 border border-gold/20"
              />

              {/* Inner offset border */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute inset-4 border border-gold/15"
              />

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 1, duration: 0.6, type: 'spring', stiffness: 200 }}
                >
                  <CalendarCheck className="w-12 h-12 text-gold/50 mb-4" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="font-playfair text-xs tracking-[0.3em] uppercase text-gold/50"
                >
                  Your Table Awaits
                </motion.p>
              </div>

              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold/40" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gold/40" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gold/40" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold/40" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
