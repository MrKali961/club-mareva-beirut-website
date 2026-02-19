import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fetchAllNews, fetchNewsBySlug, fetchLatestNews } from './api/news';
import {
  fetchUpcomingEvents as fetchUpcomingEventsApi,
  fetchEventBySlug,
} from './api/events';
import { apiNewsToPost } from './adapters/news-adapter';
import { apiEventToUpcomingEvent } from './adapters/events-adapter';

export type { UpcomingEventWithSlug } from './adapters/events-adapter';

const USE_API = process.env.USE_API === 'true';

const DATA_BASE = join(process.cwd(), 'data');
const POSTS_DIR = join(DATA_BASE, 'posts');
const PAGES_DIR = join(DATA_BASE, 'pages');
const METADATA_DIR = join(DATA_BASE, 'metadata');

// ========================================
// Interfaces
// ========================================

export interface Author {
  id: number;
  name: string;
  login: string;
}

export interface PostImage {
  original_url: string;
  local_path: string;
  alt_text?: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  status: string;
  date_created: string;
  date_modified: string;
  author: Author;
  categories: string[];
  content: {
    raw: string;
    clean: string;
    text: string;
  };
  featured_image?: PostImage;
  images: PostImage[];
  embeds?: {
    youtube: string[];
    instagram: string[];
  };
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  status: string;
  date_created: string;
  date_modified: string;
  author: Author;
  content: {
    raw: string;
    clean: string;
    text: string;
  };
  featured_image?: PostImage;
  images: PostImage[];
  embeds?: {
    youtube: string[];
    instagram: string[];
  };
}

export interface UpcomingEvent {
  id: string;
  title: string;
  slug?: string;
  date: string;
  category: string;
  description: string;
  image: string;
  featured: boolean;
  location?: string;
  maxVisitors?: number;
  body?: string;
}

export interface SignatureContentSection {
  heading?: string;
  text: string;
  image?: string;
  imageAlt?: string;
}

export interface SignatureItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  gallery: string[];
  contentSections?: SignatureContentSection[];
  specs: { label: string; value: string }[];
  collaborators: string;
  postSlug: string;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: string | null;
}

export interface ImageManifest {
  [key: string]: string;
}

// ========================================
// Caches (filesystem mode)
// ========================================

let postsCache: Post[] | null = null;
let pagesCache: Page[] | null = null;
let categoriesCache: Category[] | null = null;
let imageManifestCache: ImageManifest | null = null;
let upcomingEventsCache: UpcomingEvent[] | null = null;
let signaturesCache: SignatureItem[] | null = null;

async function loadJSON<T>(filePath: string): Promise<T | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

// ========================================
// Posts (News) — API-backed with filesystem fallback
// ========================================

async function getAllPostsFromFilesystem(): Promise<Post[]> {
  if (postsCache) return postsCache;

  try {
    const files = await readdir(POSTS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    const posts: Post[] = [];

    for (const file of jsonFiles) {
      const filePath = join(POSTS_DIR, file);
      const post = await loadJSON<Post>(filePath);
      if (post && post.status === 'publish') {
        posts.push(post);
      }
    }

    posts.sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
    );

    postsCache = posts;
    return posts;
  } catch (error) {
    console.error('Error loading posts from filesystem:', error);
    return [];
  }
}

export async function getAllPosts(): Promise<Post[]> {
  if (USE_API) {
    try {
      const response = await fetchAllNews();
      return response.items.map(apiNewsToPost);
    } catch (error) {
      console.error('API error fetching all posts, falling back to filesystem:', error);
    }
  }
  return getAllPostsFromFilesystem();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (USE_API) {
    try {
      const article = await fetchNewsBySlug(slug);
      return apiNewsToPost(article);
    } catch (error) {
      console.error(`API error fetching post "${slug}", falling back to filesystem:`, error);
    }
  }
  const posts = await getAllPostsFromFilesystem();
  return posts.find(p => p.slug === slug) || null;
}

export async function getLatestPosts(count: number): Promise<Post[]> {
  if (USE_API) {
    try {
      const response = await fetchLatestNews(count);
      return response.items.map(apiNewsToPost);
    } catch (error) {
      console.error('API error fetching latest posts, falling back to filesystem:', error);
    }
  }
  const posts = await getAllPostsFromFilesystem();
  return posts.slice(0, count);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(p =>
    p.categories.some(cat => cat.toLowerCase() === category.toLowerCase()),
  );
}

// ========================================
// Events — API-backed with filesystem fallback
// ========================================

async function getUpcomingEventsFromFilesystem(): Promise<UpcomingEvent[]> {
  if (upcomingEventsCache) return upcomingEventsCache;

  const filePath = join(DATA_BASE, 'upcoming-events.json');
  const events = await loadJSON<UpcomingEvent[]>(filePath);

  if (!events) return [];

  const now = new Date();
  const upcoming = events
    .filter(e => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  upcomingEventsCache = upcoming;
  return upcoming;
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  if (USE_API) {
    try {
      const response = await fetchUpcomingEventsApi();
      return response.items.map(apiEventToUpcomingEvent);
    } catch (error) {
      console.error('API error fetching upcoming events, falling back to filesystem:', error);
    }
  }
  return getUpcomingEventsFromFilesystem();
}

export async function getUpcomingEventBySlug(slug: string): Promise<UpcomingEvent | null> {
  if (USE_API) {
    try {
      const event = await fetchEventBySlug(slug);
      return apiEventToUpcomingEvent(event);
    } catch (error) {
      console.error(`API error fetching event "${slug}", falling back to filesystem:`, error);
    }
  }
  const events = await getUpcomingEventsFromFilesystem();
  return events.find(e => e.slug === slug || e.id === slug) || null;
}

/** @deprecated Use getUpcomingEventBySlug instead */
export async function getUpcomingEventById(id: string): Promise<UpcomingEvent | null> {
  if (USE_API) {
    return getUpcomingEventBySlug(id);
  }
  const events = await getUpcomingEventsFromFilesystem();
  return events.find(e => e.id === id) || null;
}

export async function getAllUpcomingEventSlugs(): Promise<string[]> {
  if (USE_API) {
    try {
      const response = await fetchUpcomingEventsApi();
      return response.items.map(e => e.slug);
    } catch (error) {
      console.error('API error fetching event slugs, falling back to filesystem:', error);
    }
  }
  const events = await getUpcomingEventsFromFilesystem();
  return events.map(e => e.slug || e.id);
}

/** @deprecated Use getAllUpcomingEventSlugs instead */
export async function getAllUpcomingEventIds(): Promise<string[]> {
  if (USE_API) {
    return getAllUpcomingEventSlugs();
  }
  const events = await getUpcomingEventsFromFilesystem();
  return events.map(e => e.id);
}

// ========================================
// Pages (filesystem only — no API endpoint)
// ========================================

export async function getAllPages(): Promise<Page[]> {
  if (pagesCache) return pagesCache;

  try {
    const files = await readdir(PAGES_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    const pages: Page[] = [];

    for (const file of jsonFiles) {
      const filePath = join(PAGES_DIR, file);
      const page = await loadJSON<Page>(filePath);
      if (page && page.status === 'publish') {
        pages.push(page);
      }
    }

    pagesCache = pages;
    return pages;
  } catch (error) {
    console.error('Error loading pages:', error);
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const pages = await getAllPages();
  return pages.find(p => p.slug === slug) || null;
}

// ========================================
// Images
// ========================================

async function getImageManifest(): Promise<ImageManifest> {
  if (imageManifestCache) return imageManifestCache;

  const manifestPath = join(METADATA_DIR, 'image-manifest.json');
  const manifest = await loadJSON<ImageManifest>(manifestPath);

  imageManifestCache = manifest || {};
  return imageManifestCache;
}

export async function getImagePath(originalUrl: string): Promise<string> {
  if (USE_API) {
    // API returns full ImageKit URLs — no manifest lookup needed
    return originalUrl;
  }

  const manifest = await getImageManifest();
  const localPath = manifest[originalUrl];
  if (localPath) {
    return `/${localPath}`;
  }
  return originalUrl;
}

// ========================================
// Metadata (filesystem only — no API endpoint)
// ========================================

export async function getCategories(): Promise<Category[]> {
  if (categoriesCache) return categoriesCache;

  const categoriesPath = join(METADATA_DIR, 'categories.json');
  const data = await loadJSON<{ categories: Category[] }>(categoriesPath);

  if (data && data.categories) {
    categoriesCache = data.categories;
    return data.categories;
  }

  return [];
}

export async function getAuthors(): Promise<Author[]> {
  const authorsPath = join(METADATA_DIR, 'authors.json');
  const data = await loadJSON<{ authors: Author[] }>(authorsPath);
  return data?.authors || [];
}

// ========================================
// Signatures (filesystem only — no API endpoint)
// ========================================

export async function getSignatures(): Promise<SignatureItem[]> {
  if (signaturesCache) return signaturesCache;
  const filePath = join(DATA_BASE, 'signatures.json');
  const items = await loadJSON<SignatureItem[]>(filePath);
  signaturesCache = (items || []).sort((a, b) => a.order - b.order);
  return signaturesCache;
}

// ========================================
// Cache management
// ========================================

export function clearCache(): void {
  postsCache = null;
  pagesCache = null;
  categoriesCache = null;
  imageManifestCache = null;
  upcomingEventsCache = null;
  signaturesCache = null;
}
