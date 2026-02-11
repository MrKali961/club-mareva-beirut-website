'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [fabVisible, setFabVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

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

    return () => {
      window.removeEventListener('resize', checkDesktop);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Animation props — desktop: animate on mount; mobile: animate on scroll into view
  const trigger = isDesktop
    ? { initial: 'hidden' as const, animate: 'visible' as const }
    : { initial: 'hidden' as const, whileInView: 'visible' as const, viewport: { once: true } };

  return (
    <>
      {/* ═══ Curtain Reveal Footer ═══ */}
      <motion.footer
        {...trigger}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
          },
        }}
        className="lg:fixed lg:bottom-0 lg:left-0 lg:w-full lg:z-0 relative z-0 w-full min-h-screen flex flex-col bg-black-900 overflow-hidden"
      >
        {/* ── Atmospheric Background Layers ── */}




        {/* ═══ Center Content ═══ */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-16 lg:py-0">
          <div className="flex flex-col items-center w-full max-w-5xl">
            {/* ── Brand Header ── */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 1.2, delay: 0.2, ease: easeOut },
                },
              }}
              className="flex flex-col items-center text-center"
            >
              <Image
                src="/images/club-mareva-logo-gold.svg"
                alt="Club Mareva"
                width={180}
                height={60}
                className="h-auto w-[140px] lg:w-[180px]"
                priority
              />
              <p className="font-playfair text-sm md:text-base italic text-cream/70 mt-4">
                A sanctuary that ignites the senses
              </p>
            </motion.div>

            {/* Gold divider */}
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-8 mb-10 animate-line-expand animation-delay-500" />

            {/* ── Sections Grid ── */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, delay: 0.5, ease: easeOut },
                },
              }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 w-full text-center lg:text-left"
            >
              {/* — Explore — */}
              <div>
                <h4 className="font-playfair text-xs tracking-[0.2em] text-gold uppercase mb-5">
                  Explore
                </h4>
                <nav className="flex flex-col gap-3">
                  <Link href="/" className="group font-playfair text-sm text-cream/60 hover:text-gold transition-colors duration-300 relative w-fit lg:w-fit mx-auto lg:mx-0">
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                  <Link href="/cigars" className="group font-playfair text-sm text-cream/60 hover:text-gold transition-colors duration-300 relative w-fit mx-auto lg:mx-0">
                    Cigars
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                  <Link href="/news-and-events" className="group font-playfair text-sm text-cream/60 hover:text-gold transition-colors duration-300 relative w-fit mx-auto lg:mx-0">
                    News &amp; Events
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                  <Link href="/contact" className="group font-playfair text-sm text-cream/60 hover:text-gold transition-colors duration-300 relative w-fit mx-auto lg:mx-0">
                    Contact
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                </nav>
              </div>

              {/* — Opening Hours — */}
              <div>
                <h4 className="font-playfair text-xs tracking-[0.2em] text-gold uppercase mb-5">
                  Opening Hours
                </h4>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-playfair text-sm text-cream/80">Monday &ndash; Saturday</p>
                    <p className="font-playfair text-sm text-cream/50">11:00 AM &ndash; 11:00 PM</p>
                  </div>
                  <div>
                    <p className="font-playfair text-sm text-cream/80">Sunday</p>
                    <p className="font-playfair text-sm text-cream/50">5:00 PM &ndash; 11:00 PM</p>
                  </div>
                </div>
              </div>

              {/* — Contact — */}
              <div>
                <h4 className="font-playfair text-xs tracking-[0.2em] text-gold uppercase mb-5">
                  Contact
                </h4>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://maps.app.goo.gl/RCXy9Fkz9CC7ciux7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group font-playfair text-sm text-cream/60 hover:text-gold transition-colors duration-300 relative w-fit mx-auto lg:mx-0"
                  >
                    Sea Side Rd, Jal El Dib
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </a>
                  <a
                    href="https://wa.me/96179117997"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group font-playfair text-sm text-cream/60 hover:text-gold transition-colors duration-300 relative w-fit mx-auto lg:mx-0"
                  >
                    +961 79 117 997
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </a>
                  <a
                    href="mailto:info@clubmareva.com"
                    className="group font-playfair text-sm text-cream/60 hover:text-gold transition-colors duration-300 relative w-fit mx-auto lg:mx-0"
                  >
                    info@clubmareva.com
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </a>
                </div>
              </div>

              {/* — Follow Us — */}
              <div>
                <h4 className="font-playfair text-xs tracking-[0.2em] text-gold uppercase mb-5">
                  Follow Us
                </h4>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
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
                      className="p-2.5 rounded-full border border-cream/15 group-hover:border-gold group-hover:shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-300"
                    >
                      <Instagram className="w-4 h-4 text-cream/70 group-hover:text-gold transition-colors duration-300" />
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
                      className="p-2.5 rounded-full border border-cream/15 group-hover:border-gold group-hover:shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-300"
                    >
                      <Facebook className="w-4 h-4 text-cream/70 group-hover:text-gold transition-colors duration-300" />
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
                      className="p-2.5 rounded-full border border-cream/15 group-hover:border-gold group-hover:shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-300"
                    >
                      <MessageCircle className="w-4 h-4 text-cream/70 group-hover:text-gold transition-colors duration-300" />
                    </motion.div>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Gold divider */}
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-10 mb-8 animate-line-expand animation-delay-700" />

            {/* ── Reserve CTA ── */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, delay: 1.0, ease: easeOut },
                },
              }}
            >
              <a
                href="https://wa.me/96179117997"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="relative bg-gold text-black py-4 px-10 font-playfair font-medium tracking-wider uppercase text-sm text-center overflow-hidden shadow-[0_0_20px_rgba(201,162,39,0.25)] transition-shadow duration-300 group-hover:shadow-[0_0_40px_rgba(201,162,39,0.4)]"
                >
                  {/* Shimmer Effect */}
                  <motion.span
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{
                      x: '200%',
                      transition: { duration: 0.6, ease: 'easeInOut' },
                    }}
                  />
                  <span className="relative z-10">Reserve Your Visit</span>
                </motion.div>
              </a>
            </motion.div>
          </div>
        </div>

        {/* ═══ Bottom Bar ═══ */}
        <div className="relative z-10 border-t border-gold/15">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.6, delay: 1.1, ease: easeOut },
                },
              }}
              className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left"
            >
              {/* Legal Links */}
              <div className="flex items-center gap-x-4">
                <Link
                  href="/privacy"
                  className="font-playfair text-xs text-cream/40 hover:text-gold transition-colors duration-300"
                >
                  Privacy
                </Link>
                <span className="text-cream/20 text-xs">&middot;</span>
                <Link
                  href="/terms"
                  className="font-playfair text-xs text-cream/40 hover:text-gold transition-colors duration-300"
                >
                  Terms
                </Link>
              </div>
            </motion.div>

            {/* Copyright */}
            <motion.p
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.6, delay: 1.2, ease: easeOut },
                },
              }}
              className="font-playfair text-[10px] text-cream/30 text-center mt-4 tracking-wider uppercase"
            >
              &copy; 2020&ndash;{currentYear} Club Mareva Beirut. All rights
              reserved.
            </motion.p>
            <p className="font-playfair text-[10px] text-cream/25 text-center mt-2 tracking-wide">
              Powered by{' '}
              <a
                href="https://theelitessolutions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/35 hover:text-gold transition-colors duration-300"
              >
                The Elites Solutions
              </a>
            </p>
          </div>
        </div>
      </motion.footer>

      {/* ═══ WhatsApp Floating Button (preserved) ═══ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: fabVisible ? 1 : 0,
          scale: fabVisible ? 1 : 0.8,
          y: fabVisible ? 0 : 20,
        }}
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
