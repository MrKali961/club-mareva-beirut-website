"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface HighlightItem {
  id: number | string;
  title: string;
  date: string;
  category: string;
  image: string;
  mediaType: "image" | "video";
  slug: string;
  /** Drives the destination URL and the badge label. */
  type: "upcoming" | "event" | "news";
}

interface FeaturedHighlightsProps {
  items: HighlightItem[];
}

const ease = [0.22, 1, 0.36, 1] as const;

function itemHref(item: HighlightItem): string {
  // Events have a dedicated upcoming detail route; past events + news land on the
  // canonical /[slug] page (which redirects events to the upcoming route when applicable).
  if (item.type === "upcoming") return `/news-and-events/upcoming/${item.slug}`;
  return `/${item.slug}`;
}

function badgeLabel(item: HighlightItem): string {
  if (item.type === "upcoming") return "Upcoming";
  if (item.type === "event") return "Event";
  return item.category || "News";
}

export default function FeaturedHighlights({ items }: FeaturedHighlightsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="relative bg-black py-16 sm:py-24 lg:py-28 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Soft gold glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease }}
          className="mb-12 sm:mb-16 text-center"
        >
          <p className="font-playfair text-xs tracking-[0.3em] uppercase text-gold/80 mb-4">
            Featured
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-cream mb-4 tracking-tight">
            Latest Highlights
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"
          />
        </motion.div>

        {/* Cards grid — 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => {
            const href = itemHref(item);
            return (
              <motion.div
                key={`${item.type}-${item.slug}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + index * 0.12,
                  ease,
                }}
              >
                <Link
                  href={href}
                  className="group block relative overflow-hidden bg-black/40 border border-gold/15 hover:border-gold/40 transition-colors duration-500"
                >
                  {/* Image with 16:9 aspect */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    {item.image ? (
                      item.mediaType === "video" ? (
                        <video
                          src={item.image}
                          muted
                          loop
                          playsInline
                          autoPlay
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                        />
                      ) : (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                          className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-black to-black-800" />
                    )}

                    {/* Bottom gradient over image for text legibility on the badge */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                    {/* Type badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 bg-black/70 backdrop-blur-sm border border-gold/30 text-gold font-playfair text-[10px] tracking-[0.2em] uppercase">
                        {badgeLabel(item)}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="relative p-5 sm:p-6">
                    <p className="font-playfair text-[11px] tracking-[0.25em] uppercase text-gold/70 mb-3">
                      {item.date}
                    </p>
                    <h3 className="font-playfair text-lg sm:text-xl text-cream leading-snug mb-4 min-h-[3.5rem] group-hover:text-gold transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gold/80 group-hover:text-gold transition-colors">
                      <span className="font-playfair text-[11px] tracking-[0.2em] uppercase">
                        {item.type === "upcoming" || item.type === "event"
                          ? "View Event"
                          : "Read More"}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Bottom gold accent line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
