'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Masonry from 'react-masonry-css';

export interface PostData {
  title: string;
  slug: string;
  date: string;
  category: string;
  featuredImage: string;
  content: string;
  images: string[];
}

export interface RelatedPostData {
  title: string;
  slug: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
}

interface PostClientProps {
  post: PostData;
  relatedPosts: RelatedPostData[];
}

export default function PostClient({ post, relatedPosts }: PostClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { scrollYProgress } = useScroll();

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  }, [post.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  }, [post.images.length]);

  // Prevent body scroll when lightbox is open and add keyboard navigation
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setLightboxOpen(false);
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [lightboxOpen, nextImage, prevImage]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <main className="min-h-screen bg-black pt-24">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gold z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-black via-green-dark/40 to-black">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,0.15),transparent_70%)]" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 bg-gold text-black text-sm font-semibold tracking-wider uppercase mb-6">
              {post.category}
            </span>

            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-cream mb-6 max-w-4xl leading-[1.1]">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-cream/70 text-sm">
              <span>{post.date}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-[800px] mx-auto px-6 py-20"
      >
        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.article>

      {/* Image Gallery - Masonry Layout */}
      {post.images.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-cream mb-4">
              Gallery
            </h2>
            <div className="w-24 h-[2px] bg-gold mx-auto" />
          </motion.div>

          <Masonry
            breakpointCols={{
              default: 3,
              1280: 3,
              1024: 2,
              768: 2,
              480: 1
            }}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {post.images.map((image, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                onClick={() => openLightbox(index)}
                className="relative w-full overflow-hidden group cursor-pointer block"
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-auto block transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                  {/* Border on hover */}
                  <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/80 transition-all duration-400" />

                  {/* Zoom icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-400 shadow-lg">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>

                  {/* Image number badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-gold text-xs font-playfair font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {index + 1}
                  </div>
                </div>
              </motion.button>
            ))}
          </Masonry>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-cream/10 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-playfair text-4xl font-bold text-cream mb-12">
              Related Posts
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/news-and-events/${relatedPost.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden mb-4">
                      {relatedPost.image ? (
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-black-800 to-black" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <span className="inline-block text-gold text-xs font-semibold tracking-wider uppercase mb-2">
                      {relatedPost.category}
                    </span>

                    <h3 className="font-playfair text-2xl font-bold text-cream mb-2 group-hover:text-gold transition-colors duration-300">
                      {relatedPost.title}
                    </h3>

                    <p className="text-cream/70 text-sm mb-3 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>

                    <span className="text-cream/50 text-xs">{relatedPost.date}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Carousel */}
      <AnimatePresence>
        {lightboxOpen && post.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 z-50 flex flex-col"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream/10">
              <div className="text-cream font-playfair text-sm">
                <span className="text-gold font-semibold">{currentImageIndex + 1}</span>
                <span className="text-cream/50"> / {post.images.length}</span>
              </div>
              <div className="text-cream/50 text-xs hidden md:block">
                Use arrow keys to navigate • ESC to close
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="text-cream hover:text-gold transition-colors duration-300 p-2 hover:bg-cream/5 rounded-full"
                aria-label="Close lightbox"
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Image Area */}
            <div className="flex-1 flex items-center justify-center relative px-16 py-8" onClick={(e) => e.stopPropagation()}>
              {/* Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 md:left-8 p-3 bg-black/50 hover:bg-gold/90 text-cream hover:text-black rounded-full transition-all duration-300 z-10 group"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 md:right-8 p-3 bg-black/50 hover:bg-gold/90 text-cream hover:text-black rounded-full transition-all duration-300 z-10 group"
                aria-label="Next image"
              >
                <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Main Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full h-full max-w-5xl max-h-[65vh] md:max-h-[70vh]"
                >
                  <Image
                    src={post.images[currentImageIndex]}
                    alt={`Gallery image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail Strip */}
            <div className="border-t border-cream/10 bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
              <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-transparent pb-2">
                  {post.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded transition-all duration-300 ${
                        currentImageIndex === index
                          ? 'ring-2 ring-gold ring-offset-2 ring-offset-black scale-105'
                          : 'opacity-50 hover:opacity-100 hover:ring-1 hover:ring-cream/30'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      {currentImageIndex === index && (
                        <motion.div
                          layoutId="activeThumb"
                          className="absolute inset-0 border-2 border-gold rounded"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .prose-article {
          color: var(--color-cream);
        }

        .prose-article p {
          font-size: 1.25rem;
          line-height: 1.9;
          margin-bottom: 1.5rem;
          color: rgba(245, 245, 240, 0.9);
        }

        .prose-article h2 {
          font-family: var(--font-playfair), serif;
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--color-cream);
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .prose-article h3 {
          font-family: var(--font-playfair), serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--color-cream);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }

        .prose-article blockquote {
          font-family: var(--font-playfair), serif;
          font-size: 1.5rem;
          font-style: italic;
          line-height: 1.6;
          color: var(--color-gold);
          border-left: 4px solid var(--color-gold);
          padding-left: 2rem;
          margin: 3rem 0;
        }

        .prose-article strong {
          color: var(--color-cream);
          font-weight: 600;
        }

        .prose-article a {
          color: var(--color-gold);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .prose-article a:hover {
          color: var(--color-gold-light);
        }

        .prose-article img {
          display: none;
        }

        .prose-article ul, .prose-article ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
          color: rgba(245, 245, 240, 0.9);
        }

        .prose-article li {
          margin-bottom: 0.5rem;
          line-height: 1.8;
          font-size: 1.125rem;
        }

        /* Masonry Grid Styles */
        .masonry-grid {
          display: flex;
          margin-left: -8px;
          width: auto;
        }

        .masonry-grid-column {
          padding-left: 8px;
          background-clip: padding-box;
        }

        .masonry-grid-column > button {
          margin-bottom: 8px;
        }

        /* Custom scrollbar for thumbnail strip */
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(201, 162, 39, 0.3);
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(201, 162, 39, 0.5);
        }
      `}</style>
    </main>
  );
}
