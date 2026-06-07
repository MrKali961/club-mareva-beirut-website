'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import type { ApiRaffleStandings } from '@/lib/api/types';

interface Props {
  standings: ApiRaffleStandings;
}

export default function GrandDrawTeaser({ standings }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const top = standings.countries.slice(0, 3);

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(198,177,88,0.10)_0%,transparent_55%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto mb-6 h-px w-16 origin-center bg-gold"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 font-playfair text-xs uppercase tracking-[0.3em] text-gold"
        >
          FIFA World Cup 2026
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-5 font-playfair text-4xl text-cream md:text-5xl"
        >
          The <span className="text-gold italic">Grand Draw</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mb-8 max-w-md font-playfair text-base leading-relaxed text-cream/70"
        >
          Spend, support your nation, and win. Every $10 earns a ticket — every goal earns more.
        </motion.p>

        {top.length > 0 && top.some((c) => c.percentage > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto mb-9 flex max-w-md items-center justify-center gap-3"
          >
            {top.map((c) => (
              <div
                key={c.code}
                className="flex flex-1 flex-col items-center gap-1.5 rounded-lg border border-cream/10 bg-white/[0.02] px-3 py-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {c.flagUrl && (
                  <img
                    src={c.flagUrl}
                    alt=""
                    className="h-5 w-8 rounded-[2px] object-cover ring-1 ring-white/10"
                  />
                )}
                <span className="truncate font-playfair text-xs text-cream/70">{c.name}</span>
                <span className="font-playfair text-sm text-gold">{c.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/grand-draw">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-gold px-8 py-4 font-playfair text-sm font-medium uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(198,177,88,0.5)]"
            >
              <Trophy className="h-5 w-5" />
              <span className="relative z-10">View the Standings</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.span>
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
