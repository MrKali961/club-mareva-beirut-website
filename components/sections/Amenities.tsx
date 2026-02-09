'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Archive, Sofa, Lock, Wine, Wrench, Cigarette, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Amenity {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  image?: string;
  link?: string;
}

const amenities: Amenity[] = [
  {
    icon: Archive,
    title: 'Premium Humidor',
    description: 'State-of-the-art Spanish cedar humidor with one of the most advanced humidification systems for both storage and walk-in humidors',
    image: '/images/clubmarevabeirut/2025/ANGELO20251114-L0034.jpg',
    link: '/cigars',
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
    link: '/contact',
  },
  {
    icon: Wine,
    title: 'Specialty Bar',
    description: 'International cocktails featuring Vlada Stojanov\'s specialty drinks, one of the world\'s best sommeliers based in LA',
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

// SVG path animation for draw-on effect
function AnimatedIcon({ Icon, isHovered }: { Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; isHovered: boolean }) {
  return (
    <motion.div
      animate={{
        scale: isHovered ? 1.15 : 1,
        rotate: isHovered ? 8 : 0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="relative"
    >
      {/* Icon with draw effect */}
      <motion.div
        animate={{
          filter: isHovered ? 'drop-shadow(0 0 12px rgba(201,162,39,0.8))' : 'drop-shadow(0 0 0px rgba(201,162,39,0))',
        }}
        transition={{ duration: 0.3 }}
        className="relative text-gold"
      >
        <Icon className="w-12 h-12" strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
}

function AmenityCard({ amenity, index }: { amenity: Amenity; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = amenity.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-black-800 border border-black-800 hover:border-gold transition-all duration-500 overflow-hidden"
    >
      {/* Mobile: always show image */}
      {amenity.image && (
        <div className="block md:hidden relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={amenity.image}
            alt={amenity.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      )}

      {/* Image reveal on hover - desktop only */}
      <div className="hidden md:block">
        <AnimatePresence>
          {isHovered && amenity.image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={amenity.image}
                alt={amenity.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Dark overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        animate={{ opacity: isHovered ? 0.8 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(201, 162, 39, 0.15) 0%, transparent 60%)',
        }}
      />

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none z-[2]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Card content */}
      <motion.div
        animate={{ y: isHovered ? -8 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 p-8 flex flex-col items-center text-center space-y-4"
      >
        {/* Icon with animation */}
        <AnimatedIcon Icon={Icon} isHovered={isHovered} />

        {/* Title */}
        <h3 className="font-playfair text-2xl text-gold tracking-wide">
          {amenity.title}
        </h3>

        {/* Description */}
        <p className="font-playfair text-sm text-cream/80 leading-relaxed max-w-[280px]">
          {amenity.description}
        </p>

        {/* Explore link - always visible on mobile, shows on hover on desktop */}
        {amenity.link && (
          <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <Link
              href={amenity.link}
              className="inline-flex items-center gap-2 mt-2 text-gold font-playfair text-xs tracking-[0.15em] uppercase hover:text-gold-light transition-colors duration-300"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </motion.div>

      {/* Corner Accents */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/50 z-10"
      />
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/50 z-10"
      />

      {/* Bottom highlight line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent origin-center z-10"
      />
    </motion.div>
  );
}

export default function Amenities() {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.8 });

  return (
    <section className="relative bg-black-800 py-20 md:py-28 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201, 162, 39, 0.1) 2px, rgba(201, 162, 39, 0.1) 4px),
                             repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(201, 162, 39, 0.1) 2px, rgba(201, 162, 39, 0.1) 4px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isTitleInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6 origin-center"
          />

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-playfair text-xs tracking-[0.3em] uppercase text-gold mb-4"
          >
            World-Class Facilities
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-playfair text-4xl md:text-5xl lg:text-6xl text-cream tracking-wider"
          >
            OUR <span className="italic text-gold">Amenities</span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isTitleInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6 origin-center"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isTitleInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 font-playfair text-cream/60 max-w-lg mx-auto"
          >
            Every detail crafted for the ultimate cigar experience
          </motion.p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {amenities.map((amenity, index) => (
            <AmenityCard key={amenity.title} amenity={amenity} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center mt-16"
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
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
