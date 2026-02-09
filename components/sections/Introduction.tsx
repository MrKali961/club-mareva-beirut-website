'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Button from '../ui/Button';

const Introduction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Ken Burns effect triggered by scroll
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative bg-black py-20 md:py-28 overflow-hidden"
    >
      {/* Leather grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='leather'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' seed='15' stitchTiles='stitch'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23leather)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

      {/* Atmospheric gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,162,39,0.06)_0%,transparent_60%)]" />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Image Column */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative order-2 lg:order-1"
          >
            {/* Main image with Ken Burns effect */}
            <div className="relative aspect-[4/5] w-full border border-gold/40 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <motion.div style={{ scale: imageScale }} className="absolute inset-0">
                <Image
                  src="/images/clubmarevabeirut/2025/ANGELO20251114-L0034.jpg"
                  alt="Club Mareva Beirut lounge interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>

              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold z-10" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold z-10" />

              {/* Subtle inner shadow for depth */}
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.3)] z-10 pointer-events-none" />
            </div>

            {/* Macro detail secondary image - cigar close-up */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.8, x: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 w-32 h-40 md:w-40 md:h-52 border border-gold/50 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20 hidden md:block"
            >
              <Image
                src="/images/clubmarevabeirut/2023/Pictures-1.jpg"
                alt="Premium cigar detail"
                fill
                className="object-cover"
                sizes="160px"
              />
              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold" />
            </motion.div>

          </motion.div>

          {/* Text Column */}
          <div className="relative order-1 lg:order-2">
            {/* Gold accent line - draws from top to bottom */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute -left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold via-gold to-gold/20 origin-top hidden lg:block"
            />

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-8"
            >
              {/* Headline */}
              <div className="space-y-4">
                <p className="font-playfair text-xs font-medium tracking-[0.3em] text-gold/90 uppercase">
                  Club Mareva
                </p>
                <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-cream leading-tight tracking-tight">
                  The <span className="italic text-gold">Experience</span>
                </h2>
              </div>

              {/* Body Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="font-playfair text-cream/90 text-base md:text-lg leading-relaxed max-w-xl space-y-4"
              >
                <p>
                  Located in Beirut, Club Mareva offers a unique place of peace and pleasure to their members and guests. Equipped with a state-of-the-art Spanish cedar humidor, this club boasts its excellence with one of the most advanced humidification systems to both its storage and walk-in humidors.
                </p>
                <p>
                  The British style lounge presents the guests the luxurious feeling of attending a racing Grand Prix reminiscent of the times of Stirling Moss with the Jaguar Racing Green walls and the comfortable Italian full grain leather seating.
                </p>
                <p>
                  Our unwavering commitment is to offer guests an experience that redefines pleasure, challenging their preconceived notions and elevating their sensory perceptions. Additionally, Club Mareva Beirut recognizes the significance of social interaction and encourages guests to connect, network and engage with like-minded individuals while indulging in our exclusive cigar and alcohol offerings.
                </p>
              </motion.div>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                {['Spanish Cedar Humidor', 'Premium Selection', 'Members Lounge'].map((feature, index) => (
                  <span
                    key={feature}
                    className="px-4 py-2 text-xs font-playfair tracking-wider uppercase text-gold/80 border border-gold/20 bg-gold/5"
                  >
                    {feature}
                  </span>
                ))}
              </motion.div>

              {/* CTA Button with enhanced shimmer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="pt-4"
              >
                <Button href="/cigars" variant="primary" size="lg">
                  Explore Our Cigars
                </Button>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Decorative bottom edge gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
};

export default Introduction;
