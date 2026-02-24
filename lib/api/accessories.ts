import { apiGet } from './client';
import type { PaginatedResponse, ApiAccessory } from './types';

const REVALIDATE = 3600; // 1 hour

export async function fetchAllAccessories(
  page = 1,
  limit = 100
): Promise<PaginatedResponse<ApiAccessory>> {
  return apiGet<PaginatedResponse<ApiAccessory>>('/accessories', {
    params: { page, limit, isPublished: true },
    next: { revalidate: REVALIDATE },
  });
}

export async function fetchAccessoryBySlug(slug: string): Promise<ApiAccessory> {
  return apiGet<ApiAccessory>(`/accessories/${slug}`, {
    next: { revalidate: REVALIDATE },
  });
}
