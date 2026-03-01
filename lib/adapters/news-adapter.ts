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
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  metaImageAlt?: string | null;
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

export function normalizeWordPressHtml(html: string): string {
  if (!html) return '';

  // No block-level tags at all → plain text, wrap every paragraph in <p>.
  if (!/<(p|h[1-6]|ul|ol|li|blockquote|div|section|article|table|figure|hr)\b/i.test(html)) {
    return wrapBareText(html);
  }

  // Mixed content: block-level tags AND bare text between them.
  // Walk through, keep block elements intact, wrap bare text in <p>.
  const blockElementRegex =
    /<(p|h[1-6]|blockquote|ul|ol|div|table|figure)(\s[^>]*)?>[\s\S]*?<\/\1>|<hr\s*\/?>/gi;
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockElementRegex.exec(html)) !== null) {
    const bare = html.slice(lastIndex, match.index);
    if (bare.trim()) parts.push(wrapBareText(bare));
    parts.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  const trailing = html.slice(lastIndex);
  if (trailing.trim()) parts.push(wrapBareText(trailing));

  return parts.join('\n');
}

function wrapBareText(text: string): string {
  return text
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\r?\n/g, '<br />')}</p>`)
    .join('\n');
}

export function extractImagesFromHtml(html: string): string[] {
  if (!html) return [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = imgRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
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
      clean: normalizeWordPressHtml(article.body),
      text: stripHtml(article.body),
    },
    featured_image: imageUrl
      ? {
          original_url: imageUrl,
          local_path: imageUrl,
          alt_text: article.image?.alt || article.title,
        }
      : undefined,
    images: (article.galleryImages ?? []).length > 0
      ? article.galleryImages!.map((gi) => ({
          original_url: gi.imageUrls.original,
          local_path: gi.imageUrls.original,
          alt_text: '',
        }))
      : extractImagesFromHtml(article.body).map((url) => ({
          original_url: url,
          local_path: url,
          alt_text: '',
        })),
    seo: {
      metaTitle: article.metaTitle || null,
      metaDescription: article.metaDescription || null,
      metaKeywords: article.metaKeywords || null,
      metaImageAlt: article.metaImageAlt || null,
    },
  };
}
