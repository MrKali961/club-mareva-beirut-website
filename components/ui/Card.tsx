'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
  image: string;
  title: string;
  date: string;
  category: string;
  slug: string;
  className?: string;
}

interface BrandCardProps {
  logo: string;
  name: string;
  origin: string;
  description?: string;
  className?: string;
}

export function EventCard({ image, title, date, category, slug, className = '' }: EventCardProps) {
  return (
    <Link href={`/events/${slug}`}>
      <motion.article
        className={`group relative overflow-hidden bg-black-800 cursor-pointer ${className}`}
        whileHover="hover"
        initial="initial"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.div
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.05 },
            }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="relative w-full h-full"
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

          <motion.div
            className="absolute inset-0 border-2 border-gold opacity-0"
            variants={{
              initial: { opacity: 0, scale: 0.95 },
              hover: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.3 }}
          />

          <div className="absolute top-4 left-4">
            <motion.span
              className="inline-block px-3 py-1 bg-gold text-black text-xs font-playfair font-semibold uppercase tracking-wider"
              variants={{
                initial: { x: 0 },
                hover: { x: 4 },
              }}
              transition={{ duration: 0.3 }}
            >
              {category}
            </motion.span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.p
              className="text-gold text-sm font-playfair font-medium mb-2 uppercase tracking-wide"
              variants={{
                initial: { opacity: 0.8 },
                hover: { opacity: 1 },
              }}
            >
              {date}
            </motion.p>
            <motion.h3
              className="text-white font-playfair text-2xl md:text-3xl font-bold leading-tight"
              variants={{
                initial: { y: 0 },
                hover: { y: -4 },
              }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h3>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export function BrandCard({ logo, name, origin, description, className = '' }: BrandCardProps) {
  return (
    <motion.article
      className={`group relative bg-black-800 p-8 cursor-pointer ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        variants={{
          initial: { y: 0 },
          hover: { y: -8 },
        }}
        transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <motion.div
          className="absolute inset-0 opacity-0 shadow-[0_20px_60px_rgba(201,162,39,0.15)]"
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative z-10">
          <div className="relative aspect-square mb-6 flex items-center justify-center bg-black/40 p-8">
            <motion.div
              className="relative w-full h-full"
              variants={{
                initial: { scale: 1, rotate: 0 },
                hover: { scale: 1.05, rotate: 2 },
              }}
              transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <Image
                src={logo}
                alt={name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            </motion.div>
          </div>

          <div className="text-center">
            <motion.h3
              className="font-playfair text-2xl font-bold text-cream mb-2"
              variants={{
                initial: { opacity: 0.9 },
                hover: { opacity: 1, color: '#C9A227' },
              }}
              transition={{ duration: 0.3 }}
            >
              {name}
            </motion.h3>
            <p className="text-cream/60 text-sm font-playfair uppercase tracking-widest mb-4">
              {origin}
            </p>
            {description && (
              <motion.p
                className="text-cream/80 text-sm font-playfair leading-relaxed"
                variants={{
                  initial: { opacity: 0, height: 0 },
                  hover: { opacity: 1, height: 'auto' },
                }}
                transition={{ duration: 0.4 }}
              >
                {description}
              </motion.p>
            )}
          </div>

          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold"
            variants={{
              initial: { width: 0 },
              hover: { width: '60%' },
            }}
            transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          />
        </div>
      </motion.div>
    </motion.article>
  );
}
