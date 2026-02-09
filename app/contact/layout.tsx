import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Club Mareva Beirut - Premium Cigar Lounge in Jal El Dib, Beirut, Lebanon. Reservations and directions.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
