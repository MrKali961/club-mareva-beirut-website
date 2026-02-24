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
  imageUrls?: {
    original: string | null;
    medium: string | null;
    thumb: string | null;
  };
  galleryImages?: Array<{
    id: string;
    mediaAssetId: string;
    displayOrder: number;
    createdAt: string;
    imageUrls: {
      original: string;
      medium: string;
      thumb: string;
    };
  }>;
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
  galleryImages?: Array<{
    id: string;
    mediaAssetId: string;
    displayOrder: number;
    createdAt: string;
    imageUrls: {
      original: string;
      medium: string;
      thumb: string;
    };
  }>;
}

export function apiEventToUpcomingEvent(event: ApiEvent): UpcomingEventWithSlug {
  return {
    id: String(event.id),
    title: event.title,
    slug: event.slug,
    date: event.date,
    category: 'Event',
    description: (() => {
      const text = stripHtml(event.body);
      return text.length > 200 ? text.substring(0, 197).trimEnd() + '...' : text;
    })(),
    image: event.imageUrls?.original || event.image?.url || event.mainImageUrl || '',
    featured: event.isFeatured,
    location: event.location,
    maxVisitors: event.maxVisitors,
    body: event.body,
    galleryImages: event.galleryImages,
  };
}
