import { apiGet } from './client';
import type { ApiMenuSection, ApiPublicMenuSettings } from './types';

const REVALIDATE = 3600; // 1 hour

export async function fetchPublicMenu(): Promise<ApiMenuSection[]> {
  return apiGet<ApiMenuSection[]>('/menu/public', {
    next: { revalidate: REVALIDATE },
  });
}

export async function fetchPublicMenuSettings(): Promise<ApiPublicMenuSettings> {
  return apiGet<ApiPublicMenuSettings>('/menu/settings/public', {
    next: { revalidate: 60 },
  });
}
