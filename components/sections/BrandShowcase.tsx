'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

// Premium cigar brand partners with their logos
const brands = [
  { name: 'Habanos', logo: '/images/external/habanos-sa-logo-vector.png' },
  { name: 'Davidoff', logo: '/images/external/davidoff_cigars_logo.png' },
  { name: 'Caldwell', logo: '/images/external/7085500fef0c5d55f740aa2b82a20d69_Caldwell-Cigar-Co-logo.jpg' },
  { name: 'Hiram & Solomon', logo: '/images/external/Hiram-Solomon-Logo.png' },
  { name: 'Patoro', logo: '/images/external/patoro.jpg' },
  { name: 'Drew Estate', logo: '/images/external/drew-estate-logo.svg' },
  { name: 'Rocky Patel', logo: '/images/external/rocky-patel-logo.png' },
  { name: 'Casdagli', logo: '/images/external/casdagli-logo.jpg' },
  { name: 'Saga', logo: '/images/external/saga-cigars.jpg' },
  { name: 'Smoking Jacket', logo: '/images/external/smoking-jacket-logo.jpg' },
];

function LogoItem({ brand }: { brand: { name: string; logo: string } }) {
  return (
    <div className="flex-shrink-0 mx-8 bg-white/10 rounded-md p-2 transition-all duration-300 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105">
      <Image
        src={brand.logo}
        alt={brand.name}
        width={100}
        height={60}
        className="object-contain h-20 w-auto"
      />
    </div>
  );
}

// Static fallback grid for reduced motion preference
function StaticLogoGrid() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-8 px-6">
      {brands.map((brand) => (
        <div
          key={brand.name}
          className="transition-all duration-300 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105"
        >
          <Image
            src={brand.logo}
            alt={brand.name}
            width={100}
            height={60}
            className="object-contain h-20 w-auto"
          />
        </div>
      ))}
    </div>
  );
}

export default function BrandShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-8 md:py-12 overflow-hidden"
      style={{ backgroundColor: '#006039' }}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #006039, #004d2e, #006039)' }} />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.05)_0%,transparent_70%)]" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-playfair text-xs tracking-[0.3em] uppercase text-gold/90 font-medium mb-4"
          >
            Our Partners
          </motion.p>

        </div>

        {/* Marquee Container - visible for normal motion preference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative overflow-hidden motion-safe:block motion-reduce:hidden"
        >
          {/* Edge fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#006039] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#006039] to-transparent z-10 pointer-events-none" />

          {/* Scrolling track - continuous motion, always looping right to left */}
          <div className="flex w-max animate-marquee">
            {/* First set of logos */}
            {brands.map((brand) => (
              <LogoItem key={brand.name} brand={brand} />
            ))}
            {/* Duplicate for seamless loop */}
            {brands.map((brand) => (
              <LogoItem key={`${brand.name}-dup`} brand={brand} />
            ))}
          </div>
        </motion.div>

        {/* Static fallback for reduced motion preference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="hidden motion-reduce:block"
        >
          <StaticLogoGrid />
        </motion.div>
      </div>
    </section>
  );
}
