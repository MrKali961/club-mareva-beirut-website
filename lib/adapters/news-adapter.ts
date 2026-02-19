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
  const imageUrl = article.image?.url || article.mainImageUrl || '';

  return {
    id: typeof article.id === 'number' ? article.id : parseInt(article.id, 10) || 0,
    title: article.title,
    slug: article.slug,
    status: 'publish',
    date_created: article.date || article.createdAt,
    date_modified: article.updatedAt || article.date || article.createdAt,
    author: { id: 0, name: 'Club Mareva Beirut', login: 'admin' },
    categories: article.isFeatured ? ['Events'] : ['News'],
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
    images: [],
  };
}
