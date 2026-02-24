import type { Post } from '@/lib/content';

// ApiNewsArticle type (from lib/api/types.ts)
interface ApiNewsArticle {
  id: string;
  title: string;
  slug: string;
  date: string;
  mainImageUrl?: string;
  body: string;
  isFeatured: boolean;
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
  createdAt: string;
  updatedAt: string;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function apiNewsToPost(article: ApiNewsArticle): Post {
  const imageUrl = article.imageUrls?.original || article.image?.url || article.mainImageUrl || '';

  return {
    id: typeof article.id === 'number' ? article.id : parseInt(article.id, 10) || 0,
    title: article.title,
    slug: article.slug,
    status: 'publish',
    date_created: article.date || article.createdAt,
    date_modified: article.updatedAt || article.date || article.createdAt,
    author: { id: 0, name: 'Club Mareva Beirut', login: 'admin' },
    categories: ['News'],
    content: {
      raw: article.body,
      clean: article.body,
      text: stripHtml(article.body),
    },
    featured_image: imageUrl
      ? {
          original_url: imageUrl,
          local_path: imageUrl,
          alt_text: article.image?.alt || article.title,
        }
      : undefined,
    images: (article.galleryImages ?? []).map((gi) => ({
      original_url: gi.imageUrls.original,
      local_path: gi.imageUrls.original,
      alt_text: '',
    })),
  };
}
