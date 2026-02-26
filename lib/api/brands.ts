import { apiGet } from './client';
import type { ApiCigarBrand } from './types';

export async function fetchCigarBrands(limit = 100): Promise<ApiCigarBrand[]> {
  return apiGet<ApiCigarBrand[]>('/cigar-brands', {
    params: { page: 1, limit },
  });
}

export async function fetchCigarBrandById(id: string): Promise<ApiCigarBrand> {
  return apiGet<ApiCigarBrand>(`/cigar-brands/${id}`);
}
