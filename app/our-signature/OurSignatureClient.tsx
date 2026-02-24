"use client";

import { useEffect, useRef, useState, useCallback, forwardRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SignatureContentSection {
  heading?: string;
  text: string;
  image?: string;
  imageAlt?: string;
}

interface SignatureItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  gallery: string[];
  contentSections?: SignatureContentSection[];
  specs: { label: string; value: string }[];
  collaborators: string;
  postSlug: string;
  order: number;
}

interface OurSignatureClientProps {
  items: SignatureItem[];
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function OurSignatureClient({ items }: OurSignatureClientProps) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSections = items.length + 2; // hero + items + closing

  const setRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      sectionRefs.current[index] = el;
    },
    [],
  );

  // IntersectionObserver for dot navigation
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((section, index) => {
      if (!section) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        { threshold: 0.5 },
      );
      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  const scrollTo = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-black">
      {/* ───── Hero Section ───── */}
      <section
        ref={setRef(0)}
        className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(201,162,39,0.08),transparent_70%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gold tracking-tight mb-6">
            Our Signature
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="font-playfair text-cream/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Exclusive collaborations. Limited editions. Unmistakably Mareva.
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-cream/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ───── Vault Sections ───── */}
      {items.map((item, index) => (
        <VaultSection
          key={item.id}
          item={item}
          index={index}
          ref={setRef(index + 1)}
          isFirst={index === 0}
        />
      ))}

      {/* ───── Closing Section ───── */}
      <section
        ref={setRef(items.length + 1)}
        className="relative bg-black py-20 sm:py-28 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="font-playfair text-2xl sm:text-3xl text-gold mb-4"
          >
            Experience Our Collection
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-playfair text-cream/60 text-sm sm:text-base mb-10 leading-relaxed"
          >
            Visit Club Mareva Beirut to discover these exclusive creations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <a
              href="https://wa.me/96179117997"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-gold text-black font-playfair font-semibold text-sm sm:text-base uppercase tracking-[0.15em] overflow-hidden group relative"
              >
                <span className="relative z-10">Reserve via WhatsApp</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </motion.span>
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      {/* ───── Dot Navigation (desktop only) ───── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-3">
        {Array.from({ length: totalSections }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className="relative group p-1"
            aria-label={`Go to section ${i + 1}`}
          >
            <motion.div
              animate={{
                scale: activeIndex === i ? 1 : 0.7,
                backgroundColor:
                  activeIndex === i ? "#C9A227" : "rgba(245,245,240,0.25)",
              }}
              transition={{ duration: 0.3, ease }}
              className="w-2.5 h-2.5 rounded-full"
            />
            {activeIndex === i && (
              <motion.div
                layoutId="signatureActiveNav"
                className="absolute inset-0 rounded-full border-2 border-gold"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ scale: 1.8 }}
              />
            )}
          </button>
        ))}
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   Vault Section — hero + editorial detail panel
   ───────────────────────────────────────────── */

interface VaultSectionProps {
  item: SignatureItem;
  index: number;
  isFirst: boolean;
}

const VaultSection = forwardRef<HTMLElement, VaultSectionProps>(
  function VaultSection({ item, index, isFirst }, ref) {
    const hasContentSections =
      item.contentSections && item.contentSections.length > 0;

    return (
      <>
        {/* ── Full-viewport Hero ── */}
        <section
          ref={ref}
          className="relative h-[100svh] min-h-[600px] overflow-hidden"
        >
          {/* Background Image with Ken Burns */}
          <motion.div
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 12, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              priority={isFirst}
              sizes="100vw"
            />
          </motion.div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

          {/* Content — bottom-left */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-8 lg:px-12 pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-7xl mx-auto">
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
                className="mb-4 sm:mb-6"
              >
                <span className="inline-flex items-center px-4 py-1.5 backdrop-blur-sm bg-gold/90 text-black text-xs font-playfair font-semibold tracking-widest uppercase">
                  {item.category}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease }}
                className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream mb-3 sm:mb-4 max-w-4xl leading-[1.1] tracking-tight"
              >
                {item.title}
              </motion.h2>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease }}
                className="font-playfair text-cream/70 text-base sm:text-lg italic max-w-xl mb-6 sm:mb-8 leading-relaxed"
              >
                {item.tagline}
              </motion.p>

              {/* Specs Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease }}
                className="flex flex-wrap gap-4 sm:gap-0 mb-6 sm:mb-8"
              >
                {item.specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex flex-col pr-5 sm:pr-6 ${
                      i > 0 ? "sm:pl-6 sm:border-l sm:border-gold/30" : ""
                    }`}
                  >
                    <span className="font-playfair text-[10px] sm:text-xs tracking-[0.2em] text-gold uppercase leading-none mb-1">
                      {spec.label}
                    </span>
                    <span className="font-playfair text-sm sm:text-base text-cream font-semibold leading-tight">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Collaborators */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.45, ease }}
                className="font-playfair text-gold/60 text-xs sm:text-sm tracking-wider mb-5 sm:mb-6"
              >
                In collaboration with {item.collaborators}
              </motion.p>

              {/* Scroll down hint when detail sections exist */}
              {hasContentSections ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5, ease }}
                  className="flex items-center gap-3"
                >
                  <Link
                    href={`/${item.postSlug}`}
                    className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-playfair text-sm tracking-wider uppercase transition-colors duration-300 group"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5, ease }}
                >
                  <Link
                    href={`/${item.postSlug}`}
                    className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-playfair text-sm tracking-wider uppercase transition-colors duration-300 group"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* ── Editorial Detail Panel ── */}
        {hasContentSections && (
          <section className="relative bg-black overflow-hidden">
            {/* Top decorative line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

            {/* Decorative glow */}
            <div className="absolute top-1/4 left-0 w-80 h-80 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-32">
              {item.contentSections!.map((section, sIdx) => (
                <motion.div
                  key={sIdx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1,
                    ease,
                  }}
                  className={`${sIdx > 0 ? "mt-16 sm:mt-20 lg:mt-28" : ""}`}
                >
                  {section.image ? (
                    /* ── Section with image: alternating layout ── */
                    <div
                      className={`flex flex-col ${
                        sIdx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                      } gap-8 sm:gap-10 lg:gap-16 items-center`}
                    >
                      {/* Text side */}
                      <div className="flex-1 min-w-0">
                        {section.heading && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              x: sIdx % 2 === 0 ? -20 : 20,
                            }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease }}
                            className="mb-4 sm:mb-6"
                          >
                            <span className="font-playfair text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gold">
                              {section.heading}
                            </span>
                            <div className="w-12 h-px bg-gradient-to-r from-gold/60 to-transparent mt-3" />
                          </motion.div>
                        )}
                        <p className="font-playfair text-cream/80 text-base sm:text-lg leading-relaxed">
                          {section.text}
                        </p>
                      </div>

                      {/* Image side */}
                      <div className="flex-1 min-w-0 w-full">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease }}
                          className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden"
                        >
                          <Image
                            src={section.image}
                            alt={section.imageAlt || item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          {/* Subtle border glow */}
                          <div className="absolute inset-0 border border-gold/10" />
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    /* ── Text-only section: centered ── */
                    <div className="max-w-3xl mx-auto text-center">
                      {section.heading && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, ease }}
                          className="mb-4 sm:mb-6"
                        >
                          <span className="font-playfair text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gold">
                            {section.heading}
                          </span>
                          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent mx-auto mt-3" />
                        </motion.div>
                      )}
                      <p className="font-playfair text-cream/70 text-base sm:text-lg leading-relaxed italic">
                        {section.text}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Read Full Story link at bottom of detail panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease }}
                className="flex justify-center mt-16 sm:mt-20"
              >
                <Link
                  href={`/${item.postSlug}`}
                  className="inline-flex items-center gap-3 px-8 py-4 border border-gold/50 text-gold font-playfair font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:border-gold hover:bg-gold/10 group"
                >
                  <span>Read the Full Story</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          </section>
        )}
      </>
    );
  },
);
