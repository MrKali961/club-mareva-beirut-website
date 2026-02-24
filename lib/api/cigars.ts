import { apiGet } from './client';
import type { CigarListResponse, ApiCigar } from './types';

const REVALIDATE = 3600; // 1 hour

export async function fetchAllCigars(
  page = 1,
  limit = 100,
  filters: { brandId?: string; strength?: string; origin?: string; isPublished?: boolean } = {}
): Promise<CigarListResponse> {
  return apiGet<CigarListResponse>('/cigars', {
    params: { page, limit, ...filters },
    next: { revalidate: REVALIDATE },
  });
}

export async function fetchCigarBySlug(slug: string): Promise<ApiCigar> {
  return apiGet<ApiCigar>(`/cigars/${slug}`, {
    next: { revalidate: REVALIDATE },
  });
}
