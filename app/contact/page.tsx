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

import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Instagram, Facebook, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';
import { submitContact } from './actions';

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
    <main className="relative z-20 w-full overflow-hidden pt-24">
      {/* Atmospheric Background Noise */}
      <div
        className="fixed inset-0 opacity-[0.08] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Split Screen Container */}
      <div className="relative z-10 flex flex-col lg:flex-row">
        {/* LEFT HALF - Google Maps */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideFromLeft}
          className="relative w-full lg:w-1/2 h-[35vh] lg:h-[calc(100vh-6rem)]"
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
          className="relative w-full lg:w-1/2 h-auto lg:h-[calc(100vh-6rem)] flex items-center justify-center p-6 lg:p-12"
        >
          {/* Contact Card */}
          <motion.div
            variants={containerVariants}
            className="relative w-full max-w-[420px] bg-black-800 border border-gold/30 p-6 md:p-8 shadow-[0_0_40px_rgba(201,162,39,0.1)]"
          >
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 space-y-5">
              {/* Logo and Brand */}
              <motion.div variants={fadeIn} className="text-center space-y-2">
                <h1 className="font-playfair text-3xl md:text-4xl font-bold tracking-wider text-cream">
                  CLUB MAREVA
                </h1>
                <h2 className="font-playfair text-xl md:text-2xl font-bold tracking-wider text-gold">
                  BEIRUT
                </h2>
                <p className="font-playfair text-sm italic text-cream/80 mt-3">
                  A sanctuary that ignites the senses
                </p>
              </motion.div>

              {/* Gold Divider */}
              <motion.div
                variants={fadeIn}
                className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"
              />

              {/* Address */}
              <motion.div variants={fadeIn} className="text-center">
                <p className="font-playfair text-cream/90 text-sm md:text-base leading-relaxed">
                  Sea Side Rd, Jal El Dib, Lebanon
                </p>
              </motion.div>

              {/* WhatsApp Contacts */}
              <motion.div variants={fadeIn} className="space-y-2 text-center">
                <h3 className="font-playfair text-xs tracking-widest text-gold/80 uppercase mb-2 inline-flex items-center justify-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp
                </h3>
                <Link
                  href="https://wa.me/96179117997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group transition-all duration-300"
                >
                  <span className="font-playfair text-cream/90 text-sm md:text-base relative">
                    +961 79 117 997
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
                <Link
                  href="https://wa.me/96181638731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group transition-all duration-300"
                >
                  <span className="font-playfair text-cream/90 text-sm md:text-base relative">
                    +961 81 638 731
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </motion.div>

              {/* Opening Hours */}
              <motion.div variants={fadeIn} className="space-y-1.5 text-center">
                <h3 className="font-playfair text-xs tracking-widest text-gold/80 uppercase mb-2 inline-flex items-center justify-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Hours
                </h3>
                <div>
                  <p className="font-playfair text-cream/90 text-sm md:text-base">Mon &ndash; Sat</p>
                  <p className="font-playfair text-cream/60 text-sm">11:00 AM &ndash; 11:00 PM</p>
                </div>
                <div>
                  <p className="font-playfair text-cream/90 text-sm md:text-base">Sunday</p>
                  <p className="font-playfair text-cream/60 text-sm">5:00 PM &ndash; 11:00 PM</p>
                </div>
              </motion.div>

              {/* Social Media */}
              <motion.div variants={fadeIn} className="space-y-2 text-center">
                <h3 className="font-playfair text-xs tracking-widest text-gold/80 uppercase mb-2">
                  Follow Us
                </h3>
                <div className="flex justify-center gap-6">
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
                    className="relative w-full bg-gold text-black py-3 px-5 font-playfair font-medium tracking-wide uppercase text-sm text-center overflow-hidden shadow-[0_0_20px_rgba(201,162,39,0.25)] transition-shadow duration-300 group-hover:shadow-[0_0_40px_rgba(201,162,39,0.4)]"
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
              className="absolute top-0 right-0 w-16 h-16 border-t border-r border-gold/15"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-gold/15"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Form Section */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 px-6 lg:px-12">
        <div className="max-w-xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <p className="font-playfair text-xs tracking-[0.3em] uppercase text-gold/80 mb-3">
              Get in Touch
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-cream tracking-wider mb-4">
              SEND US A MESSAGE
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
          </motion.div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, {
    success: false,
    message: '',
  });

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 border border-gold/30 bg-black-800"
      >
        <div className="w-16 h-16 mx-auto mb-4 border border-gold/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-playfair text-gold text-lg mb-2">Message Sent</p>
        <p className="font-playfair text-cream/70 text-sm">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      {state.message && !state.success && (
        <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-playfair">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            className="w-full bg-transparent border border-gold/30 px-4 py-3 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
          />
          {state.errors?.firstName && (
            <p className="text-red-400 text-xs mt-1 font-playfair">{state.errors.firstName}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            className="w-full bg-transparent border border-gold/30 px-4 py-3 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
          />
          {state.errors?.lastName && (
            <p className="text-red-400 text-xs mt-1 font-playfair">{state.errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          className="w-full bg-transparent border border-gold/30 px-4 py-3 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
        />
        {state.errors?.email && (
          <p className="text-red-400 text-xs mt-1 font-playfair">{state.errors.email}</p>
        )}
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows={5}
          className="w-full bg-transparent border border-gold/30 px-4 py-3 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors resize-none"
        />
        {state.errors?.message && (
          <p className="text-red-400 text-xs mt-1 font-playfair">{state.errors.message}</p>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={isPending}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gold text-black py-3.5 font-playfair font-semibold tracking-wider uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {isPending ? 'Sending...' : 'Send Message'}
      </motion.button>
    </motion.form>
  );
}
