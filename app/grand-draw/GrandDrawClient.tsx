'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Trophy, Ticket, Target, Sparkles, Crown, Medal, Gift } from 'lucide-react';
import type { ApiRaffleStandings, ApiRaffleWinner, ApiRafflePrize } from '@/lib/api/types';
import GoldConfetti from '@/components/sections/GoldConfetti';

interface Props {
  standings: ApiRaffleStandings | null;
}

/* ------------------------------------------------------------------ helpers */

function useCountUp(target: number, run: boolean, decimals = 0): string {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    const controls = animate(0, target, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [run, target]);
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
}

function Flag({ url, className }: { url: string | null; className: string }) {
  if (!url) return <span className={`${className} bg-white/5`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={`${className} object-cover`} />;
}

/** Drifting gold motes — a quiet, premium ambient layer. */
function Motes() {
  const motes = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {motes.map((_, i) => {
        const left = (i * 53) % 100;
        const size = 1.5 + ((i * 7) % 4);
        const dur = 14 + ((i * 5) % 12);
        const delay = (i * 1.3) % 9;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-gold/40"
            style={{ left: `${left}%`, width: size, height: size, bottom: -10 }}
            animate={{ y: [-0, -700], opacity: [0, 0.7, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------- winners reveal */

const MEDAL = {
  ring: ['ring-gold/60', 'ring-cream/40', 'ring-[#CD7F32]/60'],
  text: ['text-gold', 'text-cream/80', 'text-[#CD7F32]'],
};

function ChampionCard({ winner }: { winner: ApiRaffleWinner }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.2 }}
      className="relative mx-auto max-w-sm"
    >
      {/* Halo */}
      <motion.div
        className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(198,177,88,0.28)_0%,transparent_70%)] blur-xl"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative flex flex-col items-center rounded-2xl border border-gold/35 bg-gradient-to-b from-gold/[0.10] to-black/40 px-8 pb-8 pt-10">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6"
        >
          <Crown className="h-11 w-11 text-gold drop-shadow-[0_2px_10px_rgba(198,177,88,0.6)]" />
        </motion.div>

        <Flag url={winner.countryFlagUrl} className="h-12 w-[72px] rounded-[3px] ring-2 ring-gold/50" />
        <p className="mt-5 font-playfair text-4xl leading-tight text-cream md:text-5xl">
          {winner.name}
        </p>
        <p className="mt-1 font-playfair text-sm uppercase tracking-[0.2em] text-cream/55">
          {winner.countryName}
        </p>
        <span className="mt-5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 font-playfair text-[11px] uppercase tracking-[0.25em] text-gold">
          Grand Champion
        </span>
      </div>
    </motion.div>
  );
}

function RunnerCard({ winner, index }: { winner: ApiRaffleWinner; index: number }) {
  const m = winner.position <= 3 ? winner.position - 1 : -1;
  const ring = m >= 0 ? MEDAL.ring[m] : 'ring-cream/15';
  const text = m >= 0 ? MEDAL.text[m] : 'text-cream/60';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.12 }}
      className="flex flex-col items-center rounded-xl border border-cream/10 bg-white/[0.025] px-5 py-6 text-center"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/50 ring-2 ${ring}`}>
        {winner.position <= 3 ? (
          <Medal className={`h-5 w-5 ${text}`} />
        ) : (
          <span className={`font-playfair text-base ${text}`}>{winner.position}</span>
        )}
      </div>
      <Flag url={winner.countryFlagUrl} className="mt-4 h-7 w-10 rounded-[2px] ring-1 ring-white/10" />
      <p className="mt-3 font-playfair text-lg text-cream">{winner.name}</p>
      <p className="font-playfair text-xs uppercase tracking-[0.15em] text-cream/45">
        {winner.countryName}
      </p>
    </motion.div>
  );
}

function WinnersReveal({ winners }: { winners: ApiRaffleWinner[] }) {
  const [champion, ...rest] = winners;
  return (
    <section className="relative overflow-hidden">
      <GoldConfetti active />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(198,177,88,0.18)_0%,transparent_60%)]" />

      <div className="relative z-10 px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="mb-4 font-playfair text-xs uppercase tracking-[0.35em] text-gold">
            The final whistle has blown
          </p>
          <div className="relative inline-block">
            <h1 className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text font-playfair text-5xl leading-none text-transparent md:text-7xl">
              The Winners
            </h1>
            {/* shine sweep */}
            <motion.span
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{ WebkitMaskImage: 'linear-gradient(#000,#000)' }}
              initial={{ x: '-120%' }}
              animate={{ x: '120%' }}
              transition={{ duration: 1.6, delay: 0.6, ease: 'easeInOut' }}
            />
          </div>
          <p className="mx-auto mt-6 max-w-xl font-playfair text-base leading-relaxed text-cream/70 md:text-lg">
            Drawn fairly and transparently, weighted by every entry earned. Congratulations to the
            champions of the Club Mareva GRAND DRAW.
          </p>
        </motion.div>

        {champion && (
          <div className="mt-16">
            <ChampionCard winner={champion} />
          </div>
        )}

        {rest.length > 0 && (
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {rest.map((w, i) => (
              <RunnerCard key={w.position} winner={w} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- standings */

function PodiumCard({
  country,
  place,
  run,
}: {
  country: { code: string; name: string; flagUrl: string | null; percentage: number };
  place: number; // 1,2,3
  run: boolean;
}) {
  const pct = useCountUp(country.percentage, run, 1);
  const heights = ['h-40 md:h-48', 'h-32 md:h-36', 'h-28 md:h-32'];
  const order = ['order-2', 'order-1', 'order-3'];
  const accent =
    place === 1
      ? 'border-gold/50 bg-gradient-to-b from-gold/[0.12] to-transparent'
      : 'border-cream/15 bg-white/[0.03]';
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={run ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: place === 1 ? 0.1 : place === 2 ? 0.25 : 0.35 }}
      className={`flex flex-col items-center ${order[place - 1]}`}
    >
      <Flag
        url={country.flagUrl}
        className={`mb-3 rounded-[3px] ring-1 ring-white/15 ${place === 1 ? 'h-9 w-[54px]' : 'h-7 w-10'}`}
      />
      <p
        className={`mb-2 max-w-[8rem] truncate text-center font-playfair ${
          place === 1 ? 'text-base text-cream' : 'text-sm text-cream/80'
        }`}
      >
        {country.name}
      </p>
      <div
        className={`flex w-full flex-col items-center justify-end rounded-t-lg border-x border-t px-3 pb-3 pt-4 ${heights[place - 1]} ${accent}`}
      >
        <span
          className={`font-playfair tabular-nums ${
            place === 1 ? 'text-3xl text-gold md:text-4xl' : 'text-2xl text-cream/80'
          }`}
        >
          {pct}%
        </span>
        <span
          className={`mt-1 font-playfair text-xs ${place === 1 ? 'text-gold/80' : 'text-cream/40'}`}
        >
          {place === 1 ? 'Leading' : place === 2 ? '2nd' : '3rd'}
        </span>
      </div>
    </motion.div>
  );
}

function CountryRow({
  rank,
  country,
  barWidth,
  run,
  index,
}: {
  rank: number;
  country: { code: string; name: string; flagUrl: string | null; percentage: number };
  barWidth: number;
  run: boolean;
  index: number;
}) {
  const pct = useCountUp(country.percentage, run, 1);
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={run ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.5) }}
      className="flex items-center gap-4 rounded-lg border border-cream/10 bg-white/[0.02] px-4 py-3"
    >
      <span className="w-5 text-center font-playfair text-sm text-cream/40">{rank}</span>
      <Flag url={country.flagUrl} className="h-6 w-9 flex-shrink-0 rounded-[2px] ring-1 ring-white/10" />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="truncate font-playfair text-base text-cream/80">{country.name}</span>
          <span className="font-playfair text-base tabular-nums text-cream/70">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
          <motion.div
            initial={{ width: 0 }}
            animate={run ? { width: `${barWidth}%` } : {}}
            transition={{ duration: 0.9, delay: 0.2 + Math.min(index * 0.05, 0.5), ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-cream/20 to-cream/45"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------- page */

/* --------------------------------------------------------------- prizes */

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** The prize lineup, grouped by winner position. Shown only when the admin has
 *  enabled it (the server returns an empty array otherwise). */
function PrizesShowcase({ prizes }: { prizes: ApiRafflePrize[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  // Preserve the server ordering (position, then displayOrder) while grouping.
  const groups: { position: number; items: ApiRafflePrize[] }[] = [];
  for (const p of prizes) {
    let g = groups.find((x) => x.position === p.position);
    if (!g) {
      g = { position: p.position, items: [] };
      groups.push(g);
    }
    g.items.push(p);
  }

  return (
    <div ref={ref} className="mt-16">
      <div className="mb-10 flex items-center justify-center gap-3">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
        <Gift className="h-5 w-5 text-gold/60" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
      </div>
      <h2 className="mb-10 text-center font-playfair text-xs uppercase tracking-[0.3em] text-cream/50">
        The prizes
      </h2>

      <div className="space-y-10">
        {groups.map((group, gi) => (
          <motion.div
            key={group.position}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: gi * 0.08 }}
          >
            <p className="mb-4 text-center font-playfair text-base italic text-gold">
              {ordinal(group.position)} Prize
            </p>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
              {group.items.map((prize) => (
                <div
                  key={`${prize.position}-${prize.title}`}
                  className="overflow-hidden rounded-xl border border-gold/15 bg-white/[0.02]"
                >
                  {prize.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={prize.imageUrl}
                      alt={prize.title}
                      className="aspect-video w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="font-playfair text-lg text-cream">{prize.title}</h3>
                    {prize.description && (
                      <p className="mt-1.5 font-playfair text-sm leading-relaxed text-cream/55">
                        {prize.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function GrandDrawClient({ standings }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const countries = standings?.countries ?? [];
  // Only surface nations that have earned at least one entry (percentage > 0).
  const activeCountries = countries.filter((c) => c.percentage > 0);
  const winners = standings?.winners ?? [];
  // Prize lineup — empty unless the admin enabled public display in settings.
  const prizes = standings?.prizes ?? [];
  // Number of grand prizes is configured in the dashboard; fall back to 5.
  const winnerCount = standings?.winnerCount ?? 5;
  const drawn = (standings?.drawCompleted ?? false) && winners.length > 0;
  const maxPct = Math.max(1, ...activeCountries.map((c) => c.percentage));
  const hasEntries = activeCountries.length > 0;
  const top3 = hasEntries ? activeCountries.slice(0, 3) : [];
  const rest = hasEntries ? activeCountries.slice(3) : [];

  const totalEntries = useCountUp(standings?.totalTicketsIssued ?? 0, inView);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,rgba(198,177,88,0.10)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_80%,rgba(39,83,62,0.16)_0%,transparent_55%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <Motes />

      <div className="relative z-10">
        {/* Winners take the stage when the draw is done */}
        {drawn && <WinnersReveal winners={winners} />}

        <div ref={ref} className="mx-auto max-w-4xl px-6 pb-24 pt-16 md:pb-32">
          {/* Campaign hero — only the lead when not yet drawn */}
          {!drawn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="pt-8 text-center"
            >
              <p className="mb-5 font-playfair text-xs uppercase tracking-[0.35em] text-gold">
                FIFA World Cup 2026 &middot; Club Mareva Beirut
              </p>
              <h1 className="mb-6 font-playfair text-5xl leading-none text-cream md:text-7xl">
                {(standings?.campaignName ?? 'GRAND DRAW').split(' ').map((wd, i, a) =>
                  i === a.length - 1 ? (
                    <span key={i} className="italic text-gold">
                      {wd}
                    </span>
                  ) : (
                    <span key={i}>{wd} </span>
                  ),
                )}
              </h1>
              <p className="mx-auto max-w-xl font-playfair text-base leading-relaxed text-cream/70 md:text-lg">
                Every $10 you spend earns a raffle ticket. Every goal your nation scores earns you
                more. {winnerCount} winners crowned at the final whistle.
              </p>

              {standings?.totalTicketsIssued != null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-gold/[0.05] px-5 py-2"
                >
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span className="font-playfair text-sm tracking-wide text-cream/80">
                    {totalEntries} entries and counting
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Divider */}
          <div className="my-12 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
            <Trophy className="h-5 w-5 text-gold/60" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          {/* Standings */}
          {countries.length === 0 ? (
            <p className="text-center font-playfair text-cream/50">
              Standings will appear here once the campaign begins.
            </p>
          ) : (
            <>
              <h2 className="mb-8 text-center font-playfair text-xs uppercase tracking-[0.3em] text-cream/50">
                {drawn ? 'Final standings' : hasEntries ? 'The nations race' : 'The race begins soon'}
              </h2>

              {top3.length === 3 && (
                <div className="mx-auto mb-4 grid max-w-2xl grid-cols-3 items-end gap-3">
                  {top3.map((c, i) => (
                    <PodiumCard key={c.code} country={c} place={i + 1} run={inView} />
                  ))}
                </div>
              )}

              {rest.length > 0 && (
                <div className="mt-6 space-y-2.5">
                  {rest.map((c, i) => (
                    <CountryRow
                      key={c.code}
                      rank={(top3.length ? 3 : 0) + i + 1}
                      country={c}
                      barWidth={(c.percentage / maxPct) * 100}
                      run={inView}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              { icon: Ticket, title: '$10 = 1 ticket', body: 'Earn entries with every bill at the lounge.' },
              { icon: Target, title: 'Goals = bonus', body: 'Each goal your team scores adds bonus tickets.' },
              { icon: Trophy, title: `${winnerCount} winners`, body: 'Drawn fairly, weighted by your total entries.' },
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

          {/* Prize lineup — only when the admin has enabled public display */}
          {prizes.length > 0 && <PrizesShowcase prizes={prizes} />}

          <p className="mt-10 text-center font-playfair text-xs tracking-wide text-cream/30">
            Figures shown are each nation&rsquo;s share of total entries. Winner names are shown with
            initials for privacy.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </main>
  );
}
