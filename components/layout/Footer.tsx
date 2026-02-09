'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Cigars', href: '/cigars' },
  { name: 'News & Events', href: '/news-and-events' },
  { name: 'Contact', href: '/contact' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [fabVisible, setFabVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setFabVisible(false);
      } else {
        setFabVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Main Footer */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="relative bg-black overflow-hidden"
      >
        {/* Corner Accent Decorations */}
        <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none">
          <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-gold to-transparent" />
          <div className="absolute top-0 left-0 w-px h-16 bg-gradient-to-b from-gold to-transparent" />
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none">
          <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-gold to-transparent" />
          <div className="absolute top-0 right-0 w-px h-16 bg-gradient-to-b from-gold to-transparent" />
        </div>

        {/* Top Border */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Column */}
            <motion.div variants={itemVariants} className="space-y-6">
              <Image
                src="/images/club-mareva-logo-gold.svg"
                alt="Club Mareva"
                width={168}
                height={56}
                className="h-auto"
              />
              <p className="font-playfair text-sm text-cream/60 italic">
                A sanctuary that ignites the senses
              </p>
              <p className="font-playfair text-sm text-cream/50 leading-relaxed">
                Beirut&apos;s premier cigar lounge offering an unparalleled selection of the world&apos;s
                finest cigars in an atmosphere of refined luxury.
              </p>
            </motion.div>

            {/* Quick Links Column */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="font-playfair text-lg text-gold tracking-wide">Quick Links</h3>
              <nav className="space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="group flex items-center gap-2 font-playfair text-sm text-cream/70 hover:text-gold transition-colors duration-300"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-gold transition-all duration-300" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>

            {/* Contact Column */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="font-playfair text-lg text-gold tracking-wide">Contact</h3>
              <div className="space-y-4">
                <a
                  href="https://maps.app.goo.gl/RCXy9Fkz9CC7ciux7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 font-playfair text-sm text-cream/70 hover:text-cream transition-colors duration-300"
                >
                  <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <span>Sea Side Road, Jal El Dib, Beirut, Lebanon</span>
                </a>
                <a
                  href="https://wa.me/96179117997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 font-playfair text-sm text-cream/70 hover:text-cream transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>+961 79 117 997</span>
                  <span className="text-[10px] uppercase tracking-wider text-gold/60 group-hover:text-gold transition-colors">
                    WhatsApp
                  </span>
                </a>
                <a
                  href="mailto:info@clubmareva.com"
                  className="group flex items-center gap-3 font-playfair text-sm text-cream/70 hover:text-cream transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>info@clubmareva.com</span>
                </a>
              </div>
            </motion.div>

            {/* Hours Column */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="font-playfair text-lg text-gold tracking-wide">Hours</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-playfair text-sm text-cream/70">Open Daily</p>
                    <p className="font-playfair text-lg text-cream">5:00 PM &ndash; Late</p>
                  </div>
                </div>
                <p className="font-playfair text-xs text-cream/50 italic pl-7">
                  Reservations recommended for groups of 4+
                </p>
              </div>
            </motion.div>
          </div>

          {/* Social Links Row */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex justify-center gap-4"
          >
            <a
              href="https://instagram.com/clubmarevabeirut"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="Follow us on Instagram"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full border border-cream/20 group-hover:border-gold group-hover:shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-cream group-hover:text-gold transition-colors duration-300" />
              </motion.div>
            </a>
            <a
              href="https://facebook.com/clubmarevabeirut"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="Follow us on Facebook"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full border border-cream/20 group-hover:border-gold group-hover:shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-300"
              >
                <Facebook className="w-5 h-5 text-cream group-hover:text-gold transition-colors duration-300" />
              </motion.div>
            </a>
            <a
              href="https://wa.me/96179117997"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="Contact us on WhatsApp"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full border border-cream/20 group-hover:border-gold group-hover:shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 text-cream group-hover:text-gold transition-colors duration-300" />
              </motion.div>
            </a>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold/20">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="font-playfair text-xs text-cream/50">
                &copy; 2020&ndash;{currentYear} Club Mareva Beirut. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="/privacy"
                  className="font-playfair text-xs text-cream/50 hover:text-gold transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="font-playfair text-xs text-cream/50 hover:text-gold transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Noise Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201, 162, 39, 0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      </motion.footer>

      {/* WhatsApp Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: fabVisible ? 1 : 0, scale: fabVisible ? 1 : 0.8, y: fabVisible ? 0 : 20 }}
        transition={{ duration: 0.4, delay: 1 }}
        style={{ pointerEvents: fabVisible ? 'auto' : 'none' }}
        className="fixed bottom-20 lg:bottom-8 right-6 lg:right-8 z-50"
      >
        <a
          href="https://wa.me/96179117997"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block"
          aria-label="Contact us on WhatsApp"
        >
          {/* Pulse Animation Ring */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-gold"
          />

          {/* Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-gold hover:bg-gold-light p-3.5 rounded-full shadow-2xl transition-all duration-300 group-hover:shadow-gold/40"
          >
            <MessageCircle className="w-5 h-5 text-black" strokeWidth={2} />
          </motion.div>

          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden lg:block">
            <div className="bg-black-800 text-cream text-xs font-playfair px-3 py-2 rounded-lg whitespace-nowrap shadow-xl border border-gold/20">
              Chat with us
            </div>
          </div>
        </a>
      </motion.div>
    </>
  );
}
