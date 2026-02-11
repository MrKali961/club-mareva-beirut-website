'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';

// Pull quote component with decorative styling
function PullQuote({ text, attribution }: { text: string; attribution?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative my-12 md:my-16 py-8 px-6 md:px-12 border-y border-gold/30 md:border-y-0 md:border-l-2 md:border-gold md:pl-6"
    >
      {/* Decorative quote marks */}
      <span className="absolute top-0 left-4 md:left-8 text-6xl md:text-8xl text-gold/20 font-playfair leading-none select-none">
        &ldquo;
      </span>
      <span className="absolute bottom-0 right-4 md:right-8 text-6xl md:text-8xl text-gold/20 font-playfair leading-none select-none">
        &rdquo;
      </span>

      {/* Quote text */}
      <blockquote className="relative z-10 font-playfair text-xl md:text-2xl lg:text-3xl text-gold italic text-center leading-relaxed">
        {text}
      </blockquote>

      {/* Attribution */}
      {attribution && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-center font-playfair text-sm tracking-[0.2em] uppercase text-cream/50"
        >
          — {attribution}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function Story() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  const headline = "The Story of the First Cigar";
  const paragraphs = [
    "The genesis of the first cigar traces back to the 10th century Mayan civilization, a narrative imbued with a richness that mirrors the evolution of Club Mareva Beirut. These early innovators, after their routine tasks, would resort to a 'sicar' - the humble predecessor to our contemporary cigar.",
    "As we transition from the antiquity of the Mayans to the opulence of Club Mareva Beirut, it's evident that the core philosophy persists - the sacred ritual of savoring a well-crafted cigar.",
  ];

  const pullQuoteText = "The ritual that celebrates the luxurious pause, the thoughtful inhalation, and the sublime pleasure inherent in each cigar.";

  const closingParagraph = "If a Mayan were to traverse time and space into Club Mareva today, despite the initial astonishment at the sophisticated ambiance and high-end amenities, he would likely appreciate the sanctity we've maintained towards this age-old ritual. This connection, from the first 'sicar' to the premium cigars at Club Mareva Beirut, is a testament to the timeless allure of this practice.";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-32 md:py-40"
    >
      {/* Parallax Background with video option */}
      <motion.div
        style={{ y, opacity }}
        className="absolute -inset-y-[20%] inset-x-0 -z-10"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/clubmarevabeirut/2023/Pictures-1.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/75" />
        </div>
      </motion.div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-16 left-16 w-24 h-24 border-l border-t border-gold/10 hidden lg:block" />
      <div className="absolute top-16 right-16 w-24 h-24 border-r border-t border-gold/10 hidden lg:block" />
      <div className="absolute bottom-16 left-16 w-24 h-24 border-l border-b border-gold/10 hidden lg:block" />
      <div className="absolute bottom-16 right-16 w-24 h-24 border-r border-b border-gold/10 hidden lg:block" />

      {/* Content */}
      <div ref={textRef} className="relative z-20 max-w-4xl mx-auto px-6">
        {/* Top Decorative Line - larger */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4 origin-center"
        />

        {/* Brand logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <Image
            src="/images/club-mareva-logo-gold.svg"
            alt="Club Mareva Beirut"
            width={120}
            height={80}
            className="object-contain"
          />
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center font-playfair text-xs tracking-[0.3em] uppercase text-gold mb-6"
        >
          Heritage & Tradition
        </motion.p>

        {/* Headline with word animation */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-playfair text-4xl md:text-5xl lg:text-6xl text-cream mb-12 leading-tight tracking-tight text-center"
        >
          The Story of the{' '}
          <span className="text-gold italic">First Cigar</span>
        </motion.h2>

        {/* Body Text with Paragraph Fade Animation */}
        <div className="max-w-3xl mx-auto font-playfair text-base md:text-lg leading-relaxed text-cream/85 space-y-6 text-center">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {/* Pull Quote */}
        <PullQuote text={pullQuoteText} />

        {/* Closing paragraph */}
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-playfair text-base md:text-lg leading-relaxed text-cream/85 text-justify md:text-center"
          >
            {closingParagraph}
          </motion.p>
        </div>

        {/* Bottom Decorative Line - larger */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-12 origin-center"
        />

        {/* Bottom emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="flex justify-center mt-4"
        >
          <div className="w-6 h-6 border border-gold/30 rotate-45" />
        </motion.div>
      </div>

      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
