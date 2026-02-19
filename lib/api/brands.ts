import { apiGet } from './client';
import type { PaginatedResponse, ApiCigarBrand } from './types';

const REVALIDATE = 3600; // 1 hour - brands change rarely

export async function fetchCigarBrands(limit = 100): Promise<PaginatedResponse<ApiCigarBrand>> {
  return apiGet<PaginatedResponse<ApiCigarBrand>>('/cigar-brands', {
    params: { page: 1, limit },
    next: { revalidate: REVALIDATE },
  });
}

export async function fetchCigarBrandById(id: string): Promise<ApiCigarBrand> {
  return apiGet<ApiCigarBrand>(`/cigar-brands/${id}`, {
    next: { revalidate: REVALIDATE },
  });
}
