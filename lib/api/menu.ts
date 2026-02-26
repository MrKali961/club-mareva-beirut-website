import { apiGet } from './client';
import type { ApiMenuSection } from './types';

const REVALIDATE = 3600; // 1 hour

export async function fetchPublicMenu(): Promise<ApiMenuSection[]> {
  return apiGet<ApiMenuSection[]>('/menu/public', {
    next: { revalidate: REVALIDATE },
  });
}
