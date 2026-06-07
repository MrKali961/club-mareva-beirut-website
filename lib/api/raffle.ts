import { apiGet } from './client';
import type { ApiRaffleStandings } from './types';

/**
 * Public GRAND DRAW standings — per-country percentages only. The server never
 * returns absolute per-country/customer counts, so nothing sensitive can leak
 * to the website. Revalidated every 60s so new spending/bonus tickets surface
 * quickly without per-request load.
 */
export async function fetchRaffleStandings(): Promise<ApiRaffleStandings> {
  return apiGet<ApiRaffleStandings>('/raffle/public/standings', {
    next: { revalidate: 60 },
  });
}
