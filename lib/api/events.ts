import { apiGet, apiPost } from './client';
import type { PaginatedResponse, ApiEvent, ApiEventRegistration } from './types';

const REVALIDATE = 300;

export async function fetchAllEvents(page = 1, limit = 100): Promise<PaginatedResponse<ApiEvent>> {
  return apiGet<PaginatedResponse<ApiEvent>>('/events', {
    params: { page, limit },
    next: { revalidate: REVALIDATE },
  });
}

export async function fetchUpcomingEvents(limit = 100): Promise<PaginatedResponse<ApiEvent>> {
  return apiGet<PaginatedResponse<ApiEvent>>('/events', {
    params: { upcoming: true, page: 1, limit },
    next: { revalidate: REVALIDATE },
  });
}

export async function fetchEventBySlug(slug: string): Promise<ApiEvent> {
  return apiGet<ApiEvent>(`/events/${slug}`, {
    next: { revalidate: REVALIDATE },
  });
}

export async function registerForEvent(eventId: string, data: ApiEventRegistration): Promise<{ message: string }> {
  return apiPost<{ message: string }>(`/events/${eventId}/register`, data);
}
