'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Phone, Instagram, Facebook, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [showMap, setShowMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShowMap(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-green overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,162,39,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(201,162,39,0.06)_0%,transparent_50%)]" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Map & Location */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Map Preview */}
            <div ref={mapContainerRef} className="relative aspect-[4/3] w-full mb-8 border border-gold/30 overflow-hidden group">
              {/* Google Maps Embed */}
              {showMap ? (
                <iframe
                  src="https://maps.google.com/maps?q=WH5G%2B3P+Jal+El+Dib,+Lebanon&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Club Mareva Beirut Location"
                  className="grayscale contrast-125 brightness-75"
                />
              ) : (
                <div className="w-full h-full bg-black-800 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gold/40" />
                </div>
              )}
              {/* Click overlay to open in Google Maps */}
              <a
                href="https://maps.app.goo.gl/RCXy9Fkz9CC7ciux7"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-transparent group-hover:bg-gold/10 transition-colors duration-300 hidden md:flex items-center justify-center"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-black/80 text-gold font-playfair text-sm tracking-wider uppercase">
                  View on Google Maps
                </span>
              </a>

              {/* Corner accents */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-gold/50" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-gold/50" />
            </div>

            {/* Mobile-only Google Maps button */}
            <a
              href="https://maps.app.goo.gl/RCXy9Fkz9CC7ciux7"
              target="_blank"
              rel="noopener noreferrer"
              className="block md:hidden mt-4 text-center py-3 bg-gold text-black font-playfair text-sm font-medium tracking-wider uppercase"
            >
              Open in Google Maps
            </a>

            {/* Contact Details */}
            <div className="space-y-4">
              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-playfair text-xs tracking-[0.2em] uppercase text-gold mb-1">Address</p>
                  <p className="font-playfair text-cream/90">Sea Side Rd, Jal El Dib</p>
                  <p className="font-playfair text-cream/60 text-sm">Beirut, Lebanon</p>
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-playfair text-xs tracking-[0.2em] uppercase text-gold mb-1">Opening Hours</p>
                  <p className="font-playfair text-cream/90">Open Daily</p>
                  <p className="font-playfair text-cream/60 text-sm">5:00 PM - Late</p>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-playfair text-xs tracking-[0.2em] uppercase text-gold mb-1">Reservations</p>
                  <a
                    href="tel:+96179117997"
                    className="font-playfair text-cream/90 hover:text-gold transition-colors duration-200"
                  >
                    +961 79 117 997
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - CTA Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-16 h-px bg-gold mb-6 mx-auto lg:mx-0 origin-left"
            />

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-playfair text-xs tracking-[0.3em] uppercase text-gold mb-4"
            >
              Begin Your Journey
            </motion.p>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-playfair text-4xl md:text-5xl lg:text-6xl text-cream mb-6 leading-tight"
            >
              Visit Club <span className="text-gold italic">Mareva</span> Beirut
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-playfair text-cream/80 text-lg mb-8 max-w-md mx-auto lg:mx-0"
            >
              Experience the finest cigars and spirits in Beirut&apos;s most distinguished lounge. Reserve your table today.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              {/* WhatsApp Button */}
              <motion.a
                href="https://wa.me/96179117997"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold text-black font-playfair font-medium tracking-wider uppercase text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,162,39,0.5)]"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="relative z-10">Reserve via WhatsApp</span>
                {/* Shimmer effect */}
                <motion.span
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  whileHover={{
                    x: '200%',
                    transition: { duration: 0.6, ease: 'easeInOut' },
                  }}
                />
              </motion.a>

              {/* Contact Page Link */}
              <Link href="/contact">
                <motion.span
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(201, 162, 39, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-gold/50 text-gold font-playfair font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:border-gold w-full sm:w-auto"
                >
                  Contact Us
                </motion.span>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center gap-6 justify-center lg:justify-start"
            >
              <span className="font-playfair text-xs tracking-[0.2em] uppercase text-cream/40">
                Follow Us
              </span>
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com/clubmarevabeirut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 border border-gold/30 flex items-center justify-center text-cream/60 group-hover:text-gold group-hover:border-gold transition-all duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                  </motion.div>
                </a>
                <a
                  href="https://facebook.com/clubmarevabeirut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 border border-gold/30 flex items-center justify-center text-cream/60 group-hover:text-gold group-hover:border-gold transition-all duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </motion.div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
