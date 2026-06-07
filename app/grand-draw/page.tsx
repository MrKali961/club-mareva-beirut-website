import type { Metadata } from 'next';
import { fetchRaffleStandings } from '@/lib/api/raffle';
import type { ApiRaffleStandings } from '@/lib/api/types';
import GrandDrawClient from './GrandDrawClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'GRAND DRAW — World Cup 2026',
  description:
    "Club Mareva Beirut's GRAND DRAW for the 2026 FIFA World Cup. Earn raffle tickets with every visit, back your nation, and win one of five grand prizes.",
  alternates: { canonical: '/grand-draw' },
  openGraph: {
    title: 'GRAND DRAW — World Cup 2026 | Club Mareva Beirut',
    description:
      'Earn raffle tickets with every visit, back your nation, and win one of five grand prizes in the Club Mareva Beirut GRAND DRAW.',
    url: '/grand-draw',
    type: 'website',
  },
};

export default async function GrandDrawPage() {
  let standings: ApiRaffleStandings | null = null;
  try {
    standings = await fetchRaffleStandings();
  } catch (error) {
    console.error('Failed to fetch GRAND DRAW standings:', error);
  }

  return <GrandDrawClient standings={standings} />;
}
