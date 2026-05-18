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
  mediaType?: 'image' | 'video';
  mediaAsset?: { id: string; url: string; mediaType?: 'image' | 'video' } | null;
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

/** Stem of an S3 migration filename: drop dir, extension, and trailing -<12hex> migration hash. */
function s3StemKey(url: string): string {
  const file = (url.split("/").pop() ?? "").split("?")[0];
  return file
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/-[0-9a-f]{12}$/i, "")
    .toLowerCase();
}

/** Stem of a legacy WordPress filename: drop extension, WP size suffix, and -scaled. */
function wpStemKey(file: string): string {
  return file
    .split("?")[0]
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/-\d{2,4}x\d{2,4}$/i, "")
    .replace(/-scaled$/i, "")
    .toLowerCase();
}

const LEGACY_WP_IMG_RE =
  /https?:\/\/(?:www\.)?clubmarevabeirut\.com\/wp-content\/uploads\/[^\s"'<>)]+?\.(?:jpe?g|png|gif|webp)/gi;

/**
 * Rewrite inline image URLs that point at the decommissioned WordPress domain
 * (clubmarevabeirut.com/wp-content) to the migrated S3 asset, matched by
 * filename stem against the record's gallery images. URLs with no gallery
 * match are left unchanged (no regression vs. prior behaviour).
 */
export function rewriteMigratedImageUrls(
  html: string,
  galleryImages?: Array<{ imageUrls: { original: string } }>,
): string {
  if (!html || !galleryImages || galleryImages.length === 0) return html;
  const stemToS3 = new Map<string, string>();
  for (const gi of galleryImages) {
    const orig = gi.imageUrls?.original;
    if (orig) stemToS3.set(s3StemKey(orig), orig);
  }
  return html.replace(LEGACY_WP_IMG_RE, (full) => {
    const file = full.split("/").pop() ?? "";
    return stemToS3.get(wpStemKey(file)) ?? full;
  });
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
  const featuredMediaType: 'image' | 'video' =
    article.mediaType ?? article.mediaAsset?.mediaType ?? 'image';

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
      clean: normalizeWordPressHtml(rewriteMigratedImageUrls(article.body, article.galleryImages)),
      text: stripHtml(article.body),
    },
    featured_image: imageUrl
      ? {
          original_url: imageUrl,
          local_path: imageUrl,
          alt_text: article.image?.alt || article.title,
          mediaType: featuredMediaType,
        }
      : undefined,
    featuredMediaType,
    images: (article.galleryImages ?? []).length > 0
      ? article.galleryImages!.map((gi) => ({
          original_url: gi.imageUrls.original,
          local_path: gi.imageUrls.original,
          alt_text: '',
          mediaType: gi.mediaType ?? 'image',
        }))
      : extractImagesFromHtml(article.body).map((url) => ({
          original_url: url,
          local_path: url,
          alt_text: '',
          mediaType: 'image' as const,
        })),
    seo: {
      metaTitle: article.metaTitle || null,
      metaDescription: article.metaDescription || null,
      metaKeywords: article.metaKeywords || null,
      metaImageAlt: article.metaImageAlt || null,
    },
    galleryLayout: article.galleryLayout ?? null,
    imageIdMap: (article.galleryImages ?? []).reduce((acc, gi) => {
      acc[gi.id] = gi.imageUrls.original;
      return acc;
    }, {} as Record<string, string>),
    mediaTypeIdMap: (article.galleryImages ?? []).reduce((acc, gi) => {
      acc[gi.id] = gi.mediaType ?? 'image';
      return acc;
    }, {} as Record<string, 'image' | 'video'>),
  };
}
