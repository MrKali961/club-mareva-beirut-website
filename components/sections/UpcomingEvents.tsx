'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface UpcomingEventItem {
  id: string;
  slug?: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
  featured: boolean;
  month: string;       // "MAR", "APR" - pre-computed
  day: string;         // "15", "22" - pre-computed
  displayDate: string; // "Saturday, March 15" - pre-computed
}

interface UpcomingEventsProps {
  events: UpcomingEventItem[];
}

const UpcomingEventCard = ({
  event,
  index,
  isFirst,
}: {
  event: UpcomingEventItem;
  index: number;
  isFirst: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/news-and-events/upcoming/${event.slug || event.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full"
      >
      <div
        className="block relative h-[400px] md:h-[500px] group overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: isHovered ? 1.12 : 1,
              filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full"
          >
            {/* Featured image or gradient placeholder */}
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
                {/* Enhanced gradient placeholder background */}
                <div className="absolute inset-0 bg-gradient-to-br from-black-800 via-green-dark to-black" />

                {/* Pattern overlay for visual interest */}
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_60%_40%,rgba(201,162,39,0.2),transparent_60%)]" />
                </div>

                {/* Decorative cigar pattern */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-32 h-32 border border-gold/30 rotate-45" />
                </div>
              </>
            )}

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          </motion.div>
        </div>

        {/* Date Badge — top-left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.15, duration: 0.5 }}
          className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur-sm border border-gold/30 px-4 py-3 flex flex-col items-center"
        >
          <span className="font-playfair text-xs text-gold tracking-[0.2em] uppercase leading-none mb-1">
            {event.month}
          </span>
          <span className="font-playfair text-3xl font-bold text-cream leading-none">
            {event.day}
          </span>
        </motion.div>

        {/* "NEXT" Badge — top-right, first card only */}
        {isFirst && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
            className="absolute top-6 right-6 z-20"
          >
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-gold via-gold-light to-gold px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span
                className="font-playfair text-black font-bold tracking-[0.2em] uppercase"
                style={{ fontSize: '10px' }}
              >
                NEXT
              </span>
            </div>
          </motion.div>
        )}

        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.25, duration: 0.5 }}
          className="absolute bottom-0 left-0 right-0 p-8 z-10"
        >
          {/* Display date with calendar icon */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            className="flex items-center gap-2 mb-3"
          >
            <Calendar className="w-4 h-4 text-gold" />
            <span className="font-playfair text-gold text-sm tracking-wider uppercase">
              {event.displayDate}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            animate={{ y: isHovered ? -8 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-playfair text-3xl md:text-4xl text-cream mb-4 leading-tight line-clamp-2"
          >
            {event.title}
          </motion.h3>

          {/* Description — fades in on hover */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
            transition={{ duration: 0.3 }}
            className="font-playfair text-cream/70 text-sm line-clamp-2 mb-1"
          >
            {event.description}
          </motion.p>

          {/* Bottom accent line — scaleX 0→1 on hover from origin-left */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold origin-left"
            style={{ width: '100%' }}
          />
        </motion.div>
      </div>
      </motion.div>
    </Link>
  );
};

const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 1 },
        '(min-width: 1024px)': { slidesToScroll: 1 },
      },
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (events.length === 0) return null;

  return (
    <section className="relative w-full bg-black py-20 md:py-28 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-playfair text-xs tracking-[0.3em] uppercase text-gold mb-8 text-center"
        >
          Upcoming Events
        </motion.p>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Strips */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-0 bottom-0 w-10 md:w-12 z-40 flex items-center justify-center bg-gradient-to-r from-black/70 via-black/30 to-transparent hover:from-black/90 hover:via-black/50 transition-all duration-300 group cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gold/70 group-hover:text-gold group-hover:translate-x-[-2px] transition-all duration-300" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-0 bottom-0 w-10 md:w-12 z-40 flex items-center justify-center bg-gradient-to-l from-black/70 via-black/30 to-transparent hover:from-black/90 hover:via-black/50 transition-all duration-300 group cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gold/70 group-hover:text-gold group-hover:translate-x-[2px] transition-all duration-300" />
          </button>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 md:gap-8">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="flex-[0_0_100%] md:flex-[0_0_calc(50%-16px)] lg:flex-[0_0_calc(33.333%-22px)] min-w-0"
                >
                  <UpcomingEventCard event={event} index={index} isFirst={index === 0} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-3 mt-12 md:mt-16">
          {scrollSnaps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollTo(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="relative group"
              aria-label={`Go to slide ${index + 1}`}
            >
              <motion.div
                animate={{
                  scale: selectedIndex === index ? 1 : 0.7,
                  backgroundColor: selectedIndex === index ? '#C9A227' : '#404040',
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-2.5 h-2.5 rounded-full"
              />
              {selectedIndex === index && (
                <motion.div
                  layoutId="upcomingActiveIndicator"
                  className="absolute inset-0 rounded-full border-2 border-gold"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ scale: 1.8 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
};

export default UpcomingEvents;
