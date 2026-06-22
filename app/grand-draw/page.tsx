import type { Metadata } from 'next';
import { fetchRaffleStandings } from '@/lib/api/raffle';
import type { ApiRaffleStandings } from '@/lib/api/types';
import { absoluteUrl } from '@/lib/seo';
import GrandDrawClient from './GrandDrawClient';

export const revalidate = 60;

const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten',
];

/** Spell out small winner counts ("five"); fall back to digits beyond ten. */
function winnerWord(count: number): string {
  return NUMBER_WORDS[count] ?? String(count);
}

export async function generateMetadata(): Promise<Metadata> {
  let winnerCount = 5;
  try {
    winnerCount = (await fetchRaffleStandings()).winnerCount ?? 5;
  } catch {
    // Fall back to the default copy if standings are unavailable.
  }
  const word = winnerWord(winnerCount);

  return {
    title: 'GRAND DRAW — World Cup 2026',
    description: `Club Mareva Beirut's GRAND DRAW for the 2026 FIFA World Cup. Earn raffle tickets with every visit, back your nation, and win one of ${word} grand prizes.`,
    alternates: { canonical: '/grand-draw' },
    openGraph: {
      title: 'GRAND DRAW — World Cup 2026 | Club Mareva Beirut',
      description: `Earn raffle tickets with every visit, back your nation, and win one of ${word} grand prizes in the Club Mareva Beirut GRAND DRAW.`,
      url: '/grand-draw',
      type: 'website',
      images: [{ url: absoluteUrl('/opengraph-image'), width: 1200, height: 630 }],
    },
  };
}

export default async function GrandDrawPage() {
  let standings: ApiRaffleStandings | null = null;
  try {
    standings = await fetchRaffleStandings();
  } catch (error) {
    console.error('Failed to fetch GRAND DRAW standings:', error);
  }

  return <GrandDrawClient standings={standings} />;
}
