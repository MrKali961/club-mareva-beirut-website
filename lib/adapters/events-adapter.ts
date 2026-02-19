import { stripHtml } from './news-adapter';

interface ApiEvent {
  id: string;
  title: string;
  slug: string;
  date: string;
  location?: string;
  mainImageUrl?: string;
  body: string;
  isFeatured: boolean;
  maxVisitors?: number;
  image?: {
    url: string;
    alt: string;
  };
}

// Extended UpcomingEvent with slug for routing
export interface UpcomingEventWithSlug {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  description: string;
  image: string;
  featured: boolean;
  location?: string;
  maxVisitors?: number;
  body?: string; // raw HTML body for detail page
}

export function apiEventToUpcomingEvent(event: ApiEvent): UpcomingEventWithSlug {
  return {
    id: String(event.id),
    title: event.title,
    slug: event.slug,
    date: event.date,
    category: 'Event',
    description: stripHtml(event.body),
    image: event.image?.url || event.mainImageUrl || '',
    featured: event.isFeatured,
    location: event.location,
    maxVisitors: event.maxVisitors,
    body: event.body,
  };
}
