'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Ticket, Target, Sparkles } from 'lucide-react';
import type { ApiRaffleStandings } from '@/lib/api/types';

interface Props {
  standings: ApiRaffleStandings | null;
}

function CountryRow({
  rank,
  name,
  flagUrl,
  percentage,
  barWidth,
  isLeader,
  inView,
  index,
}: {
  rank: number;
  name: string;
  flagUrl: string | null;
  percentage: number;
  barWidth: number;
  isLeader: boolean;
  inView: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.6) }}
      className={`relative flex items-center gap-4 rounded-lg border px-4 py-3 ${
        isLeader ? 'border-gold/40 bg-gold/[0.06]' : 'border-cream/10 bg-white/[0.02]'
      }`}
    >
      <span
        className={`w-6 text-center font-playfair text-sm ${isLeader ? 'text-gold' : 'text-cream/40'}`}
      >
        {rank}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {flagUrl ? (
        <img
          src={flagUrl}
          alt=""
          className="h-6 w-9 flex-shrink-0 rounded-[2px] object-cover ring-1 ring-white/10"
        />
      ) : (
        <span className="h-6 w-9 flex-shrink-0 rounded-[2px] bg-white/5" />
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span
            className={`truncate font-playfair text-base ${isLeader ? 'text-cream' : 'text-cream/80'}`}
          >
            {name}
          </span>
          <span
            className={`font-playfair tabular-nums ${isLeader ? 'text-lg text-gold' : 'text-base text-cream/70'}`}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${barWidth}%` } : { width: 0 }}
            transition={{ duration: 0.9, delay: 0.2 + Math.min(index * 0.04, 0.6), ease: [0.22, 1, 0.36, 1] }}
            className={`h-full rounded-full ${
              isLeader
                ? 'bg-gradient-to-r from-gold/70 to-gold'
                : 'bg-gradient-to-r from-cream/20 to-cream/40'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function GrandDrawClient({ standings }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const countries = standings?.countries ?? [];
  const maxPct = Math.max(1, ...countries.map((c) => c.percentage));
  const hasEntries = countries.some((c) => c.percentage > 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Ambient gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(198,177,88,0.10)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_80%,rgba(39,83,62,0.16)_0%,transparent_55%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="relative z-10 mx-auto max-w-4xl px-6 py-24 md:py-32">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="mb-5 font-playfair text-xs uppercase tracking-[0.35em] text-gold">
            FIFA World Cup 2026 &middot; Club Mareva Beirut
          </p>
          <h1 className="mb-6 font-playfair text-5xl leading-none text-cream md:text-7xl">
            {(standings?.campaignName ?? 'GRAND DRAW').split(' ').map((w, i, a) =>
              i === a.length - 1 ? (
                <span key={i} className="text-gold italic">
                  {w}
                </span>
              ) : (
                <span key={i}>{w} </span>
              ),
            )}
          </h1>
          <p className="mx-auto max-w-xl font-playfair text-base leading-relaxed text-cream/70 md:text-lg">
            Every $10 you spend earns a raffle ticket. Every goal your nation scores earns you more.
            Five winners crowned at the final whistle.
          </p>

          {standings?.totalTicketsIssued != null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-gold/[0.05] px-5 py-2"
            >
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="font-playfair text-sm tracking-wide text-cream/80">
                {standings.totalTicketsIssued.toLocaleString()} entries and counting
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Decorative divider */}
        <div className="my-12 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <Trophy className="h-5 w-5 text-gold/60" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>

        {/* Leaderboard */}
        {countries.length === 0 ? (
          <p className="text-center font-playfair text-cream/50">
            Standings will appear here once the campaign begins.
          </p>
        ) : (
          <>
            <h2 className="mb-6 text-center font-playfair text-xs uppercase tracking-[0.3em] text-cream/50">
              {hasEntries ? 'Share of total entries' : 'The race begins soon'}
            </h2>
            <div className="space-y-2.5">
              {countries.map((c, i) => (
                <CountryRow
                  key={c.code}
                  rank={i + 1}
                  name={c.name}
                  flagUrl={c.flagUrl}
                  percentage={c.percentage}
                  barWidth={(c.percentage / maxPct) * 100}
                  isLeader={i === 0 && hasEntries}
                  inView={inView}
                  index={i}
                />
              ))}
            </div>
          </>
        )}

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { icon: Ticket, title: '$10 = 1 ticket', body: 'Earn entries with every bill at the lounge.' },
            { icon: Target, title: 'Goals = bonus', body: 'Each goal your team scores adds bonus tickets.' },
            { icon: Trophy, title: '5 winners', body: 'Drawn fairly, weighted by your total entries.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-lg border border-cream/10 bg-white/[0.02] p-5 text-center"
              >
                <Icon className="mx-auto mb-3 h-6 w-6 text-gold/70" />
                <p className="mb-1 font-playfair text-base text-cream">{item.title}</p>
                <p className="font-playfair text-sm leading-relaxed text-cream/55">{item.body}</p>
              </div>
            );
          })}
        </motion.div>

        <p className="mt-10 text-center font-playfair text-xs tracking-wide text-cream/30">
          Figures shown are each nation&rsquo;s share of total entries.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </main>
  );
}
