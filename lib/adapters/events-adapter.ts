import { stripHtml, normalizeWordPressHtml } from './news-adapter';

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
  confirmedGuests?: number;
  mediaType?: 'image' | 'video';
  mediaAsset?: { id: string; url: string; mediaType?: 'image' | 'video' } | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  metaImageAlt?: string | null;
  image?: {
    url: string;
    alt: string;
  };
  imageUrls?: {
    original: string | null;
    medium: string | null;
    thumb: string | null;
  };
  galleryLayout?: Array<{
    id: string;
    type: string;
    imageIds: string[];
  }> | null;
  galleryImages?: Array<{
    id: string;
    mediaAssetId: string;
    displayOrder: number;
    createdAt: string;
    mediaType?: 'image' | 'video';
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
  mediaType?: 'image' | 'video';
  featured: boolean;
  location?: string;
  maxVisitors?: number;
  confirmedGuests?: number;
  body?: string; // raw HTML body for detail page
  galleryImages?: Array<{
    id: string;
    mediaAssetId: string;
    displayOrder: number;
    createdAt: string;
    mediaType?: 'image' | 'video';
    imageUrls: {
      original: string;
      medium: string;
      thumb: string;
    };
  }>;
  galleryLayout?: Array<{
    id: string;
    type: string;
    imageIds: string[];
  }> | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  metaImageAlt?: string | null;
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
    mediaType: event.mediaType ?? event.mediaAsset?.mediaType ?? 'image',
    featured: event.isFeatured,
    location: event.location,
    maxVisitors: event.maxVisitors,
    confirmedGuests: event.confirmedGuests,
    body: normalizeWordPressHtml(event.body ?? ''),
    galleryImages: event.galleryImages,
    galleryLayout: event.galleryLayout ?? null,
    metaTitle: event.metaTitle || null,
    metaDescription: event.metaDescription || null,
    metaKeywords: event.metaKeywords || null,
    metaImageAlt: event.metaImageAlt || null,
  };
}
