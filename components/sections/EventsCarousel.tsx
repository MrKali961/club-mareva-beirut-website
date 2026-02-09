'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface EventItem {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  slug: string;
}

interface EventsCarouselProps {
  events: EventItem[];
}

// Check if category is a masterclass for special styling
const isMasterclass = (category: string) => {
  return category.toLowerCase().includes('masterclass') ||
         category.toLowerCase().includes('master class') ||
         category.toLowerCase().includes('tasting');
};

const EventCard = ({ event, index }: { event: EventItem; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const masterclass = isMasterclass(event.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-full"
    >
      <Link
        href={`/news-and-events/${event.slug}`}
        className="block relative h-[400px] md:h-[500px] group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: isHovered ? 1.12 : 1,
              filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
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

            {/* Dark gradient overlay - enhanced */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          </motion.div>
        </div>

        {/* Category Badge - Enhanced for Masterclasses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
          className="absolute top-6 left-6 z-20"
        >
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 backdrop-blur-sm text-xs font-playfair font-semibold tracking-widest uppercase ${
            masterclass
              ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-black shadow-[0_0_20px_rgba(201,162,39,0.4)]'
              : 'bg-gold/90 text-black'
          }`}>
            {masterclass && (
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
            )}
            {event.category}
          </span>
        </motion.div>

        {/* Masterclass special indicator */}
        {masterclass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            className="absolute top-6 right-6 z-20"
          >
            <div className="w-10 h-10 border border-gold/50 flex items-center justify-center rotate-45">
              <span className="text-gold text-lg -rotate-45">★</span>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          {/* Date with icon */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            className="flex items-center gap-2 mb-3"
          >
            <Calendar className="w-4 h-4 text-gold" />
            <span className="font-playfair text-gold text-sm tracking-wider uppercase">
              {event.date}
            </span>
          </motion.div>

          <motion.h3
            animate={{ y: isHovered ? -8 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-playfair text-3xl md:text-4xl text-cream mb-4 leading-tight"
          >
            {event.title}
          </motion.h3>

          {/* Read more indicator on hover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-gold font-playfair text-sm tracking-wider uppercase"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>

          {/* Hover line indicator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold origin-left"
            style={{ width: '100%' }}
          />
        </div>

      </Link>
    </motion.div>
  );
};

const EventsCarousel = ({ events }: EventsCarouselProps) => {
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
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

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

  if (events.length === 0) {
    return (
      <section className="relative w-full bg-black py-20 md:py-28">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="font-playfair text-cream/60 text-lg mb-6">No upcoming events — check back soon</p>
          <a href="/contact" className="font-playfair text-gold text-sm tracking-wider uppercase hover:text-gold-light transition-colors">Contact Us</a>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-black py-20 md:py-28 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-playfair text-xs tracking-[0.3em] uppercase text-gold mb-4"
          >
            Exclusive Gatherings
          </motion.p>

          <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl text-cream mb-4 tracking-tight">
            LATEST <span className="italic text-gold">Events</span>
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-32 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent origin-center"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 font-playfair text-cream/60 max-w-lg mx-auto"
          >
            Join us for masterclasses, tastings, and exclusive member events
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <motion.button
            onClick={scrollPrev}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 translate-x-0 md:-translate-x-16 z-40 w-14 h-14 md:w-16 md:h-16 bg-black/60 md:bg-gold/90 backdrop-blur-sm hover:bg-gold hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] transition-all duration-300 flex items-center justify-center group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-black group-hover:translate-x-[-2px] transition-transform duration-300" />
          </motion.button>

          <motion.button
            onClick={scrollNext}
            whileHover={{ scale: 1.05, x: 4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 translate-x-0 md:translate-x-16 z-40 w-14 h-14 md:w-16 md:h-16 bg-black/60 md:bg-gold/90 backdrop-blur-sm hover:bg-gold hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] transition-all duration-300 flex items-center justify-center group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-black group-hover:translate-x-[2px] transition-transform duration-300" />
          </motion.button>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 md:gap-8">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="flex-[0_0_100%] md:flex-[0_0_calc(50%-16px)] lg:flex-[0_0_calc(33.333%-22px)] min-w-0"
                >
                  <EventCard event={event} index={index} />
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
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-full border-2 border-gold"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ scale: 1.8 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* View All Events CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center mt-12"
        >
          <Link href="/news-and-events">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 px-8 py-4 border border-gold/50 text-gold font-playfair font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:border-gold hover:bg-gold/10"
            >
              View All Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
};

export default EventsCarousel;
