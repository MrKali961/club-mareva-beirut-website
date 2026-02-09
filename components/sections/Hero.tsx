/**
 * Hero Section for Club Mareva Beirut
 *
 * Luxury cinematic hero with:
 * - Video background (falls back to Ken Burns image on mobile)
 * - Staggered letter animation for tagline
 * - Decorative gold lines
 * - Scroll indicator at bottom
 * - Smooth scroll-based fade out
 */

'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import VideoBackground from '@/components/ui/VideoBackground';
import ScrollIndicator from '@/components/ui/ScrollIndicator';


export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth spring-based opacity for scroll fade
  const rawOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentOpacity = useSpring(rawOpacity, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Video/Image Background with parallax */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 -z-10">
        <VideoBackground
          posterSrc="/images/clubmarevabeirut/2023/Pictures-4.jpg"
          fallbackImageSrc="/images/clubmarevabeirut/2023/Pictures-4.jpg"
          alt="Club Mareva Beirut interior"
          enableKenBurns={true}
          priority={true}
        />

        {/* Gradient Overlay - cinematic dark vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(3,3,3,0.9) 0%, rgba(3,3,3,0.4) 40%, rgba(3,3,3,0.3) 60%, rgba(3,3,3,0.8) 100%),
              radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)
            `
          }}
        />
      </motion.div>

      {/* Decorative corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-gold/20 z-20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-gold/20 z-20" />

      {/* Main Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 md:px-[10%] py-[10%]"
      >
        {/* Decorative top gold line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-8"
        />

        {/* Content Column */}
        <div className="w-full max-w-3xl text-center">

          {/* Eyebrow Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-playfair text-[0.65rem] tracking-[0.4em] uppercase text-gold/80 mb-4"
          >
            Est. 2020 &mdash; Jal El Dib, Beirut
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="font-playfair text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
          >
            Where <span className="text-gold italic">Elegance</span> Meets
            <br />
            <span className="text-gold italic">Indulgence</span>
          </motion.h1>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold/60 to-transparent mb-6"
          />

          {/* Quote */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-playfair text-sm font-light leading-relaxed text-cream/80 md:text-base lg:text-lg max-w-2xl mx-auto"
          >
            Club Mareva Beirut transcends the conventional notion of a cigar club. It is a sanctuary that ignites the senses and elicits an unparalleled level of stimulation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-gold text-black font-playfair font-medium tracking-wider uppercase text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,162,39,0.4)]"
            >
              <span className="relative z-10">Reserve a Table</span>
              <motion.span
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                whileHover={{
                  x: '200%',
                  transition: { duration: 0.6, ease: 'easeInOut' },
                }}
              />
            </motion.a>
            <motion.a
              href="#experience"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(201, 162, 39, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-transparent border border-gold/50 text-gold font-playfair font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:border-gold"
            >
              Discover the Club
            </motion.a>
          </motion.div>
        </div>

        {/* Decorative bottom gold line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mt-8"
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <ScrollIndicator text="Discover More" />
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}
