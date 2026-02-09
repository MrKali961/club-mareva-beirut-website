'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Category = 'All' | 'Events' | 'News' | 'Mareva Malt Mavericks Tastings';

export interface PostItem {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  slug: string;
  excerpt: string;
  readTime: string;
}

interface NewsEventsClientProps {
  posts: PostItem[];
}

const categories: Category[] = ['All', 'Events', 'News', 'Mareva Malt Mavericks Tastings'];

export default function NewsEventsClient({ posts }: NewsEventsClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredPosts = activeCategory === 'All'
    ? posts
    : activeCategory === 'Events'
      ? posts.filter(post =>
          post.category === 'Events' ||
          post.category === 'International Events' ||
          post.category === 'Mareva Malt Mavericks Tastings'
        )
      : posts.filter(post => post.category === activeCategory);

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 9, filteredPosts.length));
  };

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setVisibleCount(9);
  };

  return (
    <main className="min-h-screen bg-black pt-24">
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-green-dark/40 to-black">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,0.15),transparent_70%)]" />
          </div>
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay">
            <svg className="w-full h-full">
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl text-cream mb-6 tracking-tight">
              NEWS & EVENTS
            </h1>
            <p className="font-playfair text-gold text-lg md:text-xl max-w-2xl mx-auto tracking-wide">
              Discover our latest tastings, events, and club news
            </p>
          </motion.div>
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </section>

      {/* Category Filter */}
      <section className="relative z-20 -mt-8">
        <div className="container mx-auto px-6">
          <motion.div
            className="bg-black-800/80 backdrop-blur-md border border-gold/20 rounded-2xl p-2 inline-flex flex-wrap gap-2 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(201,162,39,0.1)'
            }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`
                  relative px-4 md:px-6 py-3 rounded-xl font-playfair text-xs md:text-sm uppercase tracking-widest
                  transition-all duration-300
                  ${activeCategory === category
                    ? 'bg-gold text-black font-semibold shadow-[0_0_20px_rgba(201,162,39,0.4)]'
                    : 'bg-transparent text-gold border border-gold/40 hover:border-gold hover:bg-gold/5'
                  }
                `}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {displayedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <Link href={`/news-and-events/${post.slug}`}>
                    <div className="group relative bg-black-800 rounded-xl overflow-hidden border border-gold/20 hover:border-gold transition-all duration-500 h-full">
                      {/* Image Container */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <>
                            {/* Base gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-black-800 to-black" />

                            {/* Radial glow effect */}
                            <div className="absolute inset-0 opacity-30">
                              <div className="w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,39,0.2),transparent_60%)]" />
                            </div>

                            {/* Placeholder pattern */}
                            <div className="absolute inset-0 opacity-10">
                              <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(201,162,39,0.1)_25%,rgba(201,162,39,0.1)_50%,transparent_50%,transparent_75%,rgba(201,162,39,0.1)_75%)] bg-[length:60px_60px]" />
                            </div>
                          </>
                        )}

                        {/* Dark overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-gold text-black px-3 py-1 text-xs font-playfair font-semibold uppercase tracking-wider rounded-md">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 relative">
                        <h3 className="font-playfair text-2xl text-cream mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-300">
                          {post.title}
                        </h3>

                        <p className="text-cream/70 text-sm font-playfair mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm font-playfair">
                          <span className="text-gold">{post.date}</span>
                          <span className="text-cream/70">{post.readTime}</span>
                        </div>

                        {/* Hover indicator */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                          style={{ transformOrigin: 'left' }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More Button */}
          {hasMore && (
            <motion.div
              className="flex justify-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                onClick={handleLoadMore}
                className="relative px-12 py-4 bg-gold text-black font-playfair font-semibold text-sm uppercase tracking-widest rounded-lg overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Load More</span>

                {/* Shimmer effect */}
                <motion.span
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{
                    x: '200%',
                    transition: {
                      duration: 0.6,
                      ease: 'easeInOut',
                    },
                  }}
                />

                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 blur-xl bg-gold/40" />
                </div>
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Decorative footer section */}
      <section className="relative py-20 border-t border-gold/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-dark/5 to-transparent" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-playfair text-3xl text-cream mb-4">
              Stay Connected
            </p>
            <p className="font-playfair text-gold/80 max-w-2xl mx-auto">
              Never miss an exclusive event or tasting. Follow our social channels for the latest updates.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
