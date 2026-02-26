'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import VideoBackground from '@/components/ui/VideoBackground';
import type { Brand } from '@/lib/adapters/brands-adapter';

interface CigarsClientProps {
  brands: Brand[];
}

// ---------------------------------------------------------------------------
// Shared animation config
// ---------------------------------------------------------------------------

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  }),
};

const lineExpand = {
  hidden: { scaleX: 0 },
  visible: (delay: number) => ({
    scaleX: 1,
    transition: { duration: 1.2, delay, ease: EASE_OUT_EXPO },
  }),
};

// ---------------------------------------------------------------------------
// Scroll indicator (kept from original)
// ---------------------------------------------------------------------------

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.5 }}
    >
      <span className="font-playfair text-cream/60 text-xs uppercase tracking-[0.2em]">
        Discover Our Collection
      </span>
      <div className="animate-scroll-bounce">
        <svg
          className="w-6 h-6 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Gold ornamental divider
// ---------------------------------------------------------------------------

function OrnamentalDivider({ className = '' }: { className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className={`flex items-center justify-center gap-4 ${className}`}>
      <motion.div
        className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-gold/50 origin-right"
        variants={lineExpand}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={0}
      />
      <motion.div
        className="w-2 h-2 border border-gold/40 rotate-45 shrink-0"
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      <motion.div
        className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-gold/50 origin-left"
        variants={lineExpand}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={0}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editorial introduction
// ---------------------------------------------------------------------------

const INTRO_PARAGRAPHS = [
  `Club Mareva stands as a haven for aficionados, a space where spirited dialogue ebbs and flows amidst clouds of vintage cigar smoke and glasses of refined single malts. Within the confines of our masterfully designed Spanish cedar walk-in humidor, you will discover a broad spectrum of premium hand-rolled cigars from both the old and new worlds, meticulously preserved in optimal temperature and humidity conditions.`,
  `We at Club Mareva pride ourselves on championing the singular charm of boutique cigar brands, striving to encapsulate the universal allure of cigar culture while illuminating the distinct cultural nuances imparted by each brand. In our lounge, you will encounter traces of Cuba, the Dominican Republic, Nicaragua, Mexico, Costa Rica, Honduras, and other tobacco-rich regions of the world.`,
  `Our club is renowned for its unparalleled range and quality, boasting more than 220 varieties of cigars. With our esteemed partnership with Habanos Cuba, we are the distinguished first Cuban Habanos Lounge in the Mid`,
];

function EditorialIntro() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section className="relative py-24 md:py-32 lg:py-40 px-6 bg-black overflow-hidden">
      {/* Subtle gradient atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black-800/20 to-black pointer-events-none" />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative corner marks (desktop) */}
      <div className="absolute top-12 left-12 w-20 h-20 border-l border-t border-gold/10 hidden lg:block" />
      <div className="absolute top-12 right-12 w-20 h-20 border-r border-t border-gold/10 hidden lg:block" />
      <div className="absolute bottom-12 left-12 w-20 h-20 border-l border-b border-gold/10 hidden lg:block" />
      <div className="absolute bottom-12 right-12 w-20 h-20 border-r border-b border-gold/10 hidden lg:block" />

      <div ref={sectionRef} className="relative z-10 max-w-3xl mx-auto">
        {/* Top ornamental divider */}
        <OrnamentalDivider className="mb-12 md:mb-16" />

        {/* Eyebrow */}
        <motion.p
          className="text-center font-playfair text-xs tracking-[0.3em] uppercase text-gold/70 mb-8"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.1}
        >
          A Haven for Aficionados
        </motion.p>

        {/* Paragraphs with drop cap on first */}
        <div className="space-y-8 md:space-y-10">
          {INTRO_PARAGRAPHS.map((paragraph, i) => (
            <motion.p
              key={i}
              className={`
                font-playfair text-base md:text-lg leading-[1.85] md:leading-[1.9]
                tracking-[0.01em] text-cream/85
                ${i === 0 ? 'first-letter:text-gold first-letter:font-playfair first-letter:text-6xl md:first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.8]' : ''}
              `}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.2 + i * 0.15}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {/* Bottom ornamental divider */}
        <OrnamentalDivider className="mt-12 md:mt-16" />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Brand card
// ---------------------------------------------------------------------------

function BrandCard({ brand, index }: { brand: Brand; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [isExpanded, setIsExpanded] = useState(false);

  const CHAR_LIMIT = 180;
  const needsTruncation = brand.description.length > CHAR_LIMIT;

  return (
    <motion.article
      ref={ref}
      id={brand.name.toLowerCase().replace(/\s+/g, '-')}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.12,
        ease: EASE_OUT_EXPO,
      }}
      className="group relative bg-black-800 border border-white/[0.06] overflow-hidden transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_40px_-12px_rgba(201,162,39,0.15)]"
    >
      {/* Logo area */}
      <div className="relative aspect-[3/2] bg-black-900 overflow-hidden">
        {/* Subtle radial gradient behind logo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.04)_0%,transparent_70%)]" />

        {/* Thin gold line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {brand.logo ? (
          <div className="absolute inset-0 flex items-center justify-center p-12 md:p-16">
            <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-playfair text-2xl md:text-3xl text-gold/40 tracking-widest uppercase">
              {brand.name}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="px-6 py-6 md:px-8 md:py-7">
        {/* Brand name */}
        <h3 className="font-playfair text-xl md:text-2xl text-gold tracking-wide font-semibold mb-1">
          {brand.name}
        </h3>

        {/* Origin and established */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-playfair text-sm text-cream/50 tracking-wide">
            {brand.origin}
          </span>
          {brand.established && (
            <>
              <span className="text-gold/30">|</span>
              <span className="font-playfair text-sm text-cream/40 tracking-wide">
                {brand.established}
              </span>
            </>
          )}
        </div>

        {/* Thin separator */}
        <div className="w-8 h-px bg-gold/30 mb-4" />

        {/* Description */}
        <p className="font-playfair text-sm md:text-[0.9375rem] leading-[1.8] text-cream/70">
          {isExpanded || !needsTruncation
            ? brand.description
            : `${brand.description.slice(0, CHAR_LIMIT).trimEnd()}...`}
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="inline-block ml-2 font-playfair text-gold/70 hover:text-gold text-sm tracking-wide transition-colors duration-300"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </p>

        {/* Website link */}
        {brand.website && (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-5 font-playfair text-xs tracking-[0.15em] uppercase text-gold/50 hover:text-gold transition-colors duration-300"
          >
            Visit brand
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </a>
        )}
      </div>
    </motion.article>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CigarsClient({ brands }: CigarsClientProps) {
  const brandsHeaderRef = useRef(null);
  const isBrandsHeaderInView = useInView(brandsHeaderRef, { once: true, margin: '-50px' });

  return (
    <div className="min-h-screen bg-black pt-24">
      {/* ================================================================
          HERO
          ================================================================ */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <VideoBackground
          posterSrc="/images/clubmarevabeirut/2025/Delamain-Sig-Cigar-Bottles-at-Club-Mareva-Beirut-scaled.jpg"
          fallbackImageSrc="/images/clubmarevabeirut/2025/Delamain-Sig-Cigar-Bottles-at-Club-Mareva-Beirut-scaled.jpg"
          alt="Club Mareva Beirut Cigars"
          overlayClassName="bg-black/70"
          enableKenBurns={true}
        />

        {/* Radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] z-10" />

        {/* Hero content */}
        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: EASE_OUT_EXPO }}
          >
            <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl text-gold mb-6 tracking-tight font-bold">
              THE CIGARS
            </h1>
            <motion.div
              className="w-24 h-[2px] bg-gold mx-auto mb-6"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.p
              className="font-playfair text-cream text-lg md:text-xl max-w-2xl mx-auto tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.7 }}
            >
              Over 220 premium varieties from the world&#39;s finest regions
            </motion.p>
          </motion.div>
        </div>

        <ScrollIndicator />
      </section>

      {/* ================================================================
          EDITORIAL INTRODUCTION
          ================================================================ */}
      <EditorialIntro />

      {/* ================================================================
          BRAND SHOWCASE
          ================================================================ */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-black relative">
        {/* Section header */}
        <div ref={brandsHeaderRef} className="max-w-7xl mx-auto mb-16 md:mb-20 text-center">
          <motion.p
            className="font-playfair text-gold/70 text-xs uppercase tracking-[0.3em] mb-4"
            variants={fadeUp}
            initial="hidden"
            animate={isBrandsHeaderInView ? 'visible' : 'hidden'}
            custom={0}
          >
            Curated Excellence
          </motion.p>
          <motion.h2
            className="font-playfair text-4xl md:text-5xl lg:text-6xl text-gold mb-5 tracking-tight font-bold"
            variants={fadeUp}
            initial="hidden"
            animate={isBrandsHeaderInView ? 'visible' : 'hidden'}
            custom={0.1}
          >
            OUR BRANDS
          </motion.h2>
          <motion.div
            className="w-16 h-[2px] bg-gold mx-auto mb-6"
            variants={lineExpand}
            initial="hidden"
            animate={isBrandsHeaderInView ? 'visible' : 'hidden'}
            custom={0.2}
          />
          <motion.p
            className="font-playfair text-cream/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            animate={isBrandsHeaderInView ? 'visible' : 'hidden'}
            custom={0.3}
          >
            Explore our carefully curated selection of the world&#39;s finest cigar brands,
            each chosen for their exceptional quality and heritage.
          </motion.p>
        </div>

        {/* Brand grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {brands.map((brand, index) => (
            <BrandCard key={brand.name} brand={brand} index={index} />
          ))}
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-20 bg-black" />
    </div>
  );
}
