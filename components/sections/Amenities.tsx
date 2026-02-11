'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Archive, Sofa, Lock, Wine, Wrench, Cigarette, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Amenity {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  image: string;
}

const amenities: Amenity[] = [
  {
    icon: Archive,
    title: 'Premium Humidor',
    description: 'State-of-the-art Spanish cedar humidor with one of the most advanced humidification systems for both storage and walk-in humidors',
    image: '/images/clubmarevabeirut/2025/ANGELO20251114-L0034.jpg',
  },
  {
    icon: Sofa,
    title: 'Open Lounge',
    description: 'British style lounge with Jaguar Racing Green walls and comfortable Italian full grain leather seating with big seating capacity',
    image: '/images/clubmarevabeirut/2023/Pictures-4.jpg',
  },
  {
    icon: Lock,
    title: 'Private Lounge',
    description: 'Exclusive private lounge catering around ten people, available for reservation for private occasions',
    image: '/images/clubmarevabeirut/2023/Pictures-2.jpg',
  },
  {
    icon: Wine,
    title: 'Specialty Bar',
    description: "International cocktails featuring Vlada Stojanov's specialty drinks, one of the world's best sommeliers based in LA",
    image: '/images/clubmarevabeirut/2023/Pictures-3.jpg',
  },
  {
    icon: Wrench,
    title: 'Luxury Accessories',
    description: 'St Dupont, Colibri, Elie Bleu, Les Fines Lames, Boveda, Palio, Peter Charles, Czevitrum and other prestigious brands',
    image: '/images/clubmarevabeirut/2023/Pictures-1.jpg',
  },
  {
    icon: Cigarette,
    title: 'Pipes Collection',
    description: 'A big selection of pipes for those who want to venture in the world of pipes alongside the cigar experience',
    image: '/images/clubmarevabeirut/2023/Pictures-5.jpg',
  },
];

function AmenityCard({ amenity, index }: { amenity: Amenity; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const [isActive, setIsActive] = useState(false);
  const Icon = amenity.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={() => setIsActive((prev) => !prev)}
      className="group relative aspect-[3/4] rounded-sm border border-gold/10 overflow-hidden cursor-pointer
                 min-w-[280px] md:min-w-[320px] lg:min-w-0 snap-center"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={amenity.image}
          alt={amenity.title}
          fill
          className={`object-cover transition-transform duration-500 ${
            isActive ? 'scale-105' : 'scale-100'
          }`}
          sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 33vw"
        />
      </div>

      {/* Bottom gradient — always visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Icon at top-right */}
      <div className="absolute top-4 right-4 z-10">
        <Icon className="w-5 h-5 text-gold/70" strokeWidth={1.5} />
      </div>

      {/* Title at bottom-left — always visible */}
      <div className="absolute bottom-5 left-5 right-5 z-10">
        <h3 className="font-playfair text-xl text-cream font-medium">
          {amenity.title}
        </h3>
      </div>

      {/* Frosted glass panel — slides up on hover/tap */}
      <motion.div
        initial={false}
        animate={{ y: isActive ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="absolute bottom-0 left-0 right-0 z-20 backdrop-blur-md bg-black/60 border-t border-gold/30 px-5 py-5"
        style={{ height: '40%' }}
      >
        <div className="flex flex-col justify-center h-full">
          <h4 className="font-playfair text-lg text-gold mb-2">
            {amenity.title}
          </h4>
          <p className="font-playfair text-sm text-cream/80 leading-relaxed line-clamp-3">
            {amenity.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ScrollDots({ count, activeIndex }: { count: number; activeIndex: number }) {
  return (
    <div className="flex justify-center gap-2 mt-6 lg:hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full bg-gold transition-opacity duration-300 ${
            i === activeIndex ? 'opacity-100' : 'opacity-30'
          }`}
        />
      ))}
    </div>
  );
}

export default function Amenities() {
  const titleRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.8 });
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth
      : 280;
    const gap = 16;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveScrollIndex(Math.min(index, amenities.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section className="relative bg-black py-20 md:py-28 overflow-hidden">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Corner accent L-shapes */}
      <div className="absolute top-16 left-16 w-24 h-24 border-l border-t border-gold/10 hidden lg:block" />
      <div className="absolute top-16 right-16 w-24 h-24 border-r border-t border-gold/10 hidden lg:block" />
      <div className="absolute bottom-16 left-16 w-24 h-24 border-l border-b border-gold/10 hidden lg:block" />
      <div className="absolute bottom-16 right-16 w-24 h-24 border-r border-b border-gold/10 hidden lg:block" />

      {/* Section Header */}
      <div ref={titleRef} className="relative z-10 text-center mb-16 md:mb-20 px-6">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isTitleInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-playfair text-xs tracking-[0.3em] uppercase text-gold mb-4"
        >
          Club Mareva Beirut
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-playfair text-4xl md:text-5xl lg:text-6xl text-cream tracking-wider"
        >
          Our <span className="italic text-gold">Amenities</span>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isTitleInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6 origin-center"
        />

        {/* Diamond emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isTitleInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center mt-4"
        >
          <div className="w-4 h-4 border border-gold/30 rotate-45" />
        </motion.div>
      </div>

      {/* Desktop Layout: 3-column grid */}
      <div className="relative z-10 hidden lg:grid grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
        {amenities.map((amenity, index) => (
          <AmenityCard key={amenity.title} amenity={amenity} index={index} />
        ))}
      </div>

      {/* Tablet/Mobile Layout: Horizontal scroll */}
      <div className="relative z-10 lg:hidden">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {amenities.map((amenity, index) => (
            <AmenityCard key={amenity.title} amenity={amenity} index={index} />
          ))}
        </div>
        <ScrollDots count={amenities.length} activeIndex={activeScrollIndex} />
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10 flex justify-center mt-16 px-6"
      >
        <Link href="/contact">
          <motion.span
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-black font-playfair font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,162,39,0.4)]"
          >
            Book Your Visit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
}
