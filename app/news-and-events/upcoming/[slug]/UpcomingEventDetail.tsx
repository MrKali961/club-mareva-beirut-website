'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface EventData {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  body?: string;
  location?: string;
  month: string;
  day: string;
  displayDate: string;
  time: string;
}

interface OtherEvent {
  id: string;
  slug?: string;
  title: string;
  category: string;
  image: string;
  month: string;
  day: string;
  displayDate: string;
}

interface UpcomingEventDetailProps {
  event: EventData;
  otherEvents: OtherEvent[];
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function UpcomingEventDetail({ event, otherEvents }: UpcomingEventDetailProps) {
  return (
    <main className="min-h-screen bg-black">
      {/* Cinema Hero - Full Viewport */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
        {/* Background Image with Ken Burns */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-black via-green-dark/40 to-black" />
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,0.15),transparent_70%)]" />
              </div>
            </>
          )}
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

        {/* Top Bar: Category + Date Badge */}
        <div className="absolute top-28 sm:top-32 left-0 right-0 z-20 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-start justify-between">
            {/* Category Badge - Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
            >
              <span className="inline-flex items-center px-4 py-1.5 backdrop-blur-sm bg-gold/90 text-black text-xs font-playfair font-semibold tracking-widest uppercase">
                {event.category}
              </span>
            </motion.div>

            {/* Date Badge - Top Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="bg-black/60 backdrop-blur-sm border border-gold/30 px-4 sm:px-5 py-3 sm:py-4 flex flex-col items-center"
            >
              <span className="font-playfair text-xs tracking-[0.2em] text-gold uppercase leading-none mb-1">
                {event.month}
              </span>
              <span className="font-playfair text-3xl sm:text-4xl font-bold text-cream leading-none">
                {event.day}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-8 lg:px-12 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="mb-6 sm:mb-8"
            >
              <Link
                href="/news-and-events?filter=Events"
                className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors duration-300 font-playfair text-sm tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Events</span>
              </Link>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream mb-4 sm:mb-6 max-w-4xl leading-[1.1] tracking-tight"
            >
              {event.title}
            </motion.h1>

            {/* Date + Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease }}
              className="flex items-center gap-2 mb-4 sm:mb-6"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              <span className="font-playfair text-gold text-sm sm:text-base tracking-wider">
                {event.displayDate} at {event.time}
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease }}
              className="font-playfair text-cream/80 text-base sm:text-lg max-w-2xl leading-relaxed mb-8 sm:mb-10"
            >
              {event.description}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease }}
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
        </div>

        {/* Scroll Indicator */}
        {otherEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-1"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-5 h-5 text-cream/40" />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* More Upcoming Events */}
      {otherEvents.length > 0 && (
        <section className="relative bg-black py-16 sm:py-20 lg:py-28 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Section Header */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-playfair text-xs tracking-[0.3em] uppercase text-gold mb-10 sm:mb-14 text-center"
            >
              More Upcoming Events
            </motion.p>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {otherEvents.map((otherEvent, index) => (
                <OtherEventCard key={otherEvent.id} event={otherEvent} index={index} />
              ))}
            </div>

            {/* View All Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-center mt-12 sm:mt-16"
            >
              <Link href="/news-and-events?filter=Events">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 px-8 py-4 border border-gold/50 text-gold font-playfair font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:border-gold hover:bg-gold/10"
                >
                  View All Events
                </motion.span>
              </Link>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        </section>
      )}
    </main>
  );
}

function OtherEventCard({ event, index }: { event: OtherEvent; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease }}
    >
      <Link href={`/news-and-events/upcoming/${event.slug || event.id}`}>
        <div
          className="block relative h-[350px] sm:h-[400px] md:h-[450px] group overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: isHovered ? 1.12 : 1,
                filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
              }}
              transition={{ duration: 0.7, ease }}
              className="relative w-full h-full"
            >
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-black-800 via-green-dark to-black" />
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_60%_40%,rgba(201,162,39,0.2),transparent_60%)]" />
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
            </motion.div>
          </div>

          {/* Date Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.15, duration: 0.5 }}
            className="absolute top-5 left-5 z-20 bg-black/60 backdrop-blur-sm border border-gold/30 px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center"
          >
            <span className="font-playfair text-[10px] sm:text-xs tracking-[0.2em] text-gold uppercase leading-none mb-0.5 sm:mb-1">
              {event.month}
            </span>
            <span className="font-playfair text-2xl sm:text-3xl font-bold text-cream leading-none">
              {event.day}
            </span>
          </motion.div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              className="flex items-center gap-2 mb-2 sm:mb-3"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
              <span className="font-playfair text-gold text-xs sm:text-sm tracking-wider">
                {event.displayDate}
              </span>
            </motion.div>

            <motion.h3
              animate={{ y: isHovered ? -6 : 0 }}
              transition={{ duration: 0.4, ease }}
              className="font-playfair text-2xl sm:text-3xl text-cream leading-tight line-clamp-2"
            >
              {event.title}
            </motion.h3>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.5, ease }}
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold origin-left"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
