import { apiGet, apiPost } from './client';
import type { ApiReservationSettings, ApiAvailability, ApiReservationResult } from './types';

export async function fetchReservationSettings(): Promise<ApiReservationSettings> {
  return apiGet<ApiReservationSettings>('/reservations/settings/public', {
    next: { revalidate: 300 },
  });
}

export async function fetchAvailability(date: string): Promise<ApiAvailability> {
  return apiGet<ApiAvailability>('/reservations/availability', {
    params: { date },
  });
}

export async function submitReservation(data: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  durationMinutes?: number;
  numberOfGuests: number;
  tableId: string;
  specialRequests?: string;
  whatsappOptIn?: boolean;
}): Promise<ApiReservationResult> {
  return apiPost<ApiReservationResult>('/reservations', data);
}

export async function cancelReservationByToken(token: string): Promise<void> {
  await apiPost(`/reservations/cancel/${token}`, {});
}
