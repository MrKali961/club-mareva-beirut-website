/**
 * Contact Page for Club Mareva Beirut
 *
 * Design Approach: BOLD SPLIT-SCREEN LUXURY
 * - Left: Dark-styled interactive Google Maps embed with golden borders
 * - Right: Elegant contact card with atmospheric depth
 * - Orchestrated entrance animations with staggered reveals
 * - Hover interactions on social icons with scale transforms
 * - Gold accent underlines on clickable elements
 * - Atmospheric noise texture and layered gradients
 * - Fully responsive with mobile stacking
 */

'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Instagram, Facebook, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  // Animation variants for orchestrated entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const slideFromLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const slideFromRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden pt-24">
      {/* Atmospheric Background Noise */}
      <div
        className="fixed inset-0 opacity-[0.08] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Split Screen Container */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* LEFT HALF - Google Maps */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideFromLeft}
          className="relative w-full lg:w-1/2 h-[35vh] lg:h-[calc(100vh-6rem)] bg-black-800"
        >
          {/* Map Container with Gold Border */}
          <div className="relative h-full w-full p-6 lg:p-12">
            <div className="relative h-full w-full border border-gold/30 shadow-[0_0_60px_rgba(201,162,39,0.15)] overflow-hidden">
              {/* Google Maps Embed with Dark/Night Styling */}
              <iframe
                src="https://maps.google.com/maps?q=WH5G%2B3P+Jal+El+Dib,+Lebanon&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Club Mareva Beirut Location"
                className="grayscale contrast-125 brightness-75 hue-rotate-15"
              />

              {/* Gradient Overlay for Depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 pointer-events-none" />
            </div>
          </div>

          {/* Decorative Corner Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-gold/40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-gold/40"
          />
        </motion.div>

        {/* RIGHT HALF - Contact Information Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideFromRight}
          className="relative w-full lg:w-1/2 h-auto lg:h-[calc(100vh-6rem)] flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-black-800 via-black to-green-dark/20"
        >
          {/* Contact Card */}
          <motion.div
            variants={containerVariants}
            className="relative w-full max-w-[500px] bg-black border border-gold p-8 md:p-12 shadow-[0_0_80px_rgba(201,162,39,0.25)]"
          >
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 space-y-8">
              {/* Logo and Brand */}
              <motion.div variants={fadeIn} className="text-center space-y-3">
                <h1 className="font-playfair text-4xl md:text-5xl font-bold tracking-wider text-cream">
                  CLUB MAREVA
                </h1>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold tracking-wider text-gold">
                  BEIRUT
                </h2>
                <p className="font-playfair text-sm md:text-base italic text-cream/80 mt-4">
                  A sanctuary that ignites the senses
                </p>
              </motion.div>

              {/* Gold Divider */}
              <motion.div
                variants={fadeIn}
                className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"
              />

              {/* Address */}
              <motion.div variants={fadeIn} className="space-y-2">
                <div className="flex items-start gap-3 group">
                  <MapPin className="w-5 h-5 text-gold mt-1 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <p className="font-playfair text-cream/90 text-sm md:text-base leading-relaxed">
                    Sea Side Rd, Jal El Dib, Lebanon
                  </p>
                </div>
              </motion.div>

              {/* WhatsApp Contacts */}
              <motion.div variants={fadeIn} className="space-y-3">
                <h3 className="font-playfair text-xs tracking-widest text-gold/80 uppercase mb-3">
                  WhatsApp
                </h3>
                <Link
                  href="https://wa.me/96179117997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-all duration-300"
                >
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <span className="font-playfair text-cream/90 text-sm md:text-base relative">
                    +961 79 117 997
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
                <Link
                  href="https://wa.me/96181638731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-all duration-300"
                >
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <span className="font-playfair text-cream/90 text-sm md:text-base relative">
                    +961 81 638 731
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </motion.div>

              {/* Opening Hours */}
              <motion.div variants={fadeIn} className="space-y-2">
                <h3 className="font-playfair text-xs tracking-widest text-gold/80 uppercase mb-3">
                  Hours
                </h3>
                <div className="flex items-start gap-3 group">
                  <Clock className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-playfair text-cream/90 text-sm md:text-base">Open Daily</p>
                    <p className="font-playfair text-cream/60 text-sm">5:00 PM &ndash; Late</p>
                  </div>
                </div>
              </motion.div>

              {/* Social Media */}
              <motion.div variants={fadeIn} className="space-y-3">
                <h3 className="font-playfair text-xs tracking-widest text-gold/80 uppercase mb-3">
                  Follow Us
                </h3>
                <div className="flex gap-6">
                  <Link
                    href="https://instagram.com/clubmarevabeirut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className="p-3 border border-gold/30 bg-gold/5 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10 group-hover:shadow-[0_0_20px_rgba(201,162,39,0.3)]"
                    >
                      <Instagram className="w-6 h-6 text-gold" />
                    </motion.div>
                  </Link>
                  <Link
                    href="https://facebook.com/clubmarevabeirut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className="p-3 border border-gold/30 bg-gold/5 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10 group-hover:shadow-[0_0_20px_rgba(201,162,39,0.3)]"
                    >
                      <Facebook className="w-6 h-6 text-gold" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>

              {/* Gold Divider */}
              <motion.div
                variants={fadeIn}
                className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"
              />

              {/* Get Directions Button */}
              <motion.div variants={fadeIn}>
                <Link
                  href="https://maps.app.goo.gl/RCXy9Fkz9CC7ciux7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="relative w-full bg-gold text-black py-4 px-6 font-playfair font-medium tracking-wide uppercase text-sm md:text-base text-center overflow-hidden shadow-[0_0_30px_rgba(201,162,39,0.4)] transition-shadow duration-300 group-hover:shadow-[0_0_50px_rgba(201,162,39,0.6)]"
                  >
                    {/* Shimmer Effect */}
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
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Directions
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            {/* Corner Decorative Accents */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="absolute top-0 right-0 w-16 h-16 border-t border-r border-gold/20"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-gold/20"
            />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
