import { apiGet } from './client';
import type { PaginatedResponse, ApiNewsArticle } from './types';

const REVALIDATE = 300; // 5 minutes

export async function fetchAllNews(page = 1, limit = 200): Promise<PaginatedResponse<ApiNewsArticle>> {
  return apiGet<PaginatedResponse<ApiNewsArticle>>('/news', {
    params: { page, limit },
    next: { revalidate: REVALIDATE },
  });
}

export async function fetchNewsBySlug(slug: string): Promise<ApiNewsArticle> {
  return apiGet<ApiNewsArticle>(`/news/${slug}`, {
    next: { revalidate: REVALIDATE },
  });
}

export async function fetchLatestNews(limit = 6): Promise<PaginatedResponse<ApiNewsArticle>> {
  return apiGet<PaginatedResponse<ApiNewsArticle>>('/news', {
    params: { page: 1, limit },
    next: { revalidate: REVALIDATE },
  });
}
