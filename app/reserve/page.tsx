import { fetchReservationSettings } from '@/lib/api/reservations';
import ReserveClient from './ReserveClient';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Reserve a Table — Club Mareva Beirut',
  description:
    'Book your table at Club Mareva Beirut. Experience premium cigars, fine spirits, and an atmosphere crafted for distinguished tastes.',
};

export default async function ReservePage() {
  let settings = null;
  try {
    settings = await fetchReservationSettings();
  } catch (error) {
    console.error('Failed to fetch reservation settings:', error);
  }

  return <ReserveClient settings={settings} />;
}
