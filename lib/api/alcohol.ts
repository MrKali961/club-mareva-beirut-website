import { apiGet } from './client';
import type { PaginatedResponse, ApiAlcohol } from './types';

const REVALIDATE = 3600; // 1 hour

export async function fetchAllAlcohol(
  page = 1,
  limit = 100,
  filters: { category?: string; brand?: string; inHouse?: boolean } = {}
): Promise<PaginatedResponse<ApiAlcohol>> {
  return apiGet<PaginatedResponse<ApiAlcohol>>('/alcohol', {
    params: { page, limit, isPublished: true, ...filters },
    next: { revalidate: REVALIDATE },
  });
}

export async function fetchAlcoholBySlug(slug: string): Promise<ApiAlcohol> {
  return apiGet<ApiAlcohol>(`/alcohol/${slug}`, {
    next: { revalidate: REVALIDATE },
  });
}
