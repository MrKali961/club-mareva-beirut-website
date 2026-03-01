import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { fetchAllNews, fetchNewsBySlug, fetchLatestNews } from "./api/news";
import {
  fetchAllEvents as fetchAllEventsApi,
  fetchUpcomingEvents as fetchUpcomingEventsApi,
  fetchEventBySlug,
} from "./api/events";
import { apiNewsToPost } from "./adapters/news-adapter";
import { apiEventToUpcomingEvent } from "./adapters/events-adapter";
import type { UpcomingEventWithSlug } from "./adapters/events-adapter";
import {
  apiCigarToSignatureItem,
  SIGNATURE_SLUGS,
} from "./adapters/signatures-adapter";
import { fetchAllCigars, fetchCigarBySlug } from "./api/cigars";
import { fetchCigarBrands } from "./api/brands";
import { fetchAllAlcohol, fetchAlcoholBySlug } from "./api/alcohol";
import { fetchAllAccessories, fetchAccessoryBySlug } from "./api/accessories";
import { fetchPublicMenu } from "./api/menu";
import type {
  ApiCigar,
  ApiAlcohol,
  ApiAccessory,
  ApiMenuSection,
  ApiCigarBrand,
} from "./api/types";

export type { UpcomingEventWithSlug } from "./adapters/events-adapter";

const USE_API = process.env.USE_API === "true";

const DATA_BASE = join(process.cwd(), "data");
const PAGES_DIR = join(DATA_BASE, "pages");
const METADATA_DIR = join(DATA_BASE, "metadata");

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
  seo?: {
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    metaImageAlt: string | null;
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

let pagesCache: Page[] | null = null;
let categoriesCache: Category[] | null = null;
let imageManifestCache: ImageManifest | null = null;
let upcomingEventsCache: UpcomingEvent[] | null = null;
let signaturesCache: SignatureItem[] | null = null;

async function loadJSON<T>(filePath: string): Promise<T | null> {
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

// ========================================
// Posts (News) — API-only
// ========================================

export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await fetchAllNews();
    return response.items.map(apiNewsToPost);
  } catch (error) {
    console.error("API error fetching all posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const article = await fetchNewsBySlug(slug);
    return apiNewsToPost(article);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('404')) return null;
    console.error(`API error fetching post "${slug}":`, error);
    return null;
  }
}

export async function getLatestPosts(count: number): Promise<Post[]> {
  try {
    const response = await fetchLatestNews(count);
    return response.items.map(apiNewsToPost);
  } catch (error) {
    console.error("API error fetching latest posts:", error);
    return [];
  }
}

/**
 * Returns all known post slugs from the API.
 * Used by generateStaticParams to pre-build every article page.
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const slugs = new Set<string>();

  try {
    const first = await fetchAllNews(1, 50);
    first.items.forEach((item) => slugs.add(item.slug));

    if (first.pagination.totalPages > 1) {
      const pages = await Promise.all(
        Array.from({ length: first.pagination.totalPages - 1 }, (_, i) =>
          fetchAllNews(i + 2, 50)
        )
      );
      pages.forEach((page) => page.items.forEach((item) => slugs.add(item.slug)));
    }
  } catch (error) {
    console.error("API error fetching post slugs:", error);
  }

  return Array.from(slugs);
}

/**
 * Returns all event slugs from the API (past + future), with full pagination.
 * Used by the event detail page's generateStaticParams so that past events
 * are pre-rendered and do not rely solely on on-demand ISR.
 */
export async function getAllEventSlugs(): Promise<string[]> {
  const slugs = new Set<string>();

  try {
    const first = await fetchAllEventsApi(1, 50);
    first.items.forEach((item) => slugs.add(item.slug));

    if (first.pagination.totalPages > 1) {
      const pages = await Promise.all(
        Array.from({ length: first.pagination.totalPages - 1 }, (_, i) =>
          fetchAllEventsApi(i + 2, 50)
        )
      );
      pages.forEach((page) => page.items.forEach((item) => slugs.add(item.slug)));
    }
  } catch {
    // API unavailable at build time — dynamic rendering (dynamicParams=true) handles the rest
  }

  return Array.from(slugs);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) =>
    p.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()),
  );
}

// ========================================
// Events — API-backed with filesystem fallback
// ========================================

async function getUpcomingEventsFromFilesystem(): Promise<UpcomingEvent[]> {
  if (upcomingEventsCache) return upcomingEventsCache;

  const filePath = join(DATA_BASE, "upcoming-events.json");
  const events = await loadJSON<UpcomingEvent[]>(filePath);

  if (!events) return [];

  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date) > now)
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
      console.error(
        "API error fetching upcoming events, falling back to filesystem:",
        error,
      );
    }
  }
  return getUpcomingEventsFromFilesystem();
}

export async function getUpcomingEventBySlug(
  slug: string,
): Promise<UpcomingEventWithSlug | null> {
  if (USE_API) {
    try {
      const event = await fetchEventBySlug(slug);
      return apiEventToUpcomingEvent(event);
    } catch (error) {
      console.error(
        `API error fetching event "${slug}", falling back to filesystem:`,
        error,
      );
    }
  }
  const events = await getUpcomingEventsFromFilesystem();
  return (events.find((e) => e.slug === slug || e.id === slug) || null) as UpcomingEventWithSlug | null;
}

/** @deprecated Use getUpcomingEventBySlug instead */
export async function getUpcomingEventById(
  id: string,
): Promise<UpcomingEvent | null> {
  if (USE_API) {
    return getUpcomingEventBySlug(id);
  }
  const events = await getUpcomingEventsFromFilesystem();
  return events.find((e) => e.id === id) || null;
}

export async function getAllUpcomingEventSlugs(): Promise<string[]> {
  if (USE_API) {
    try {
      const response = await fetchUpcomingEventsApi();
      return response.items.map((e) => e.slug);
    } catch (error) {
      console.error(
        "API error fetching event slugs, falling back to filesystem:",
        error,
      );
    }
  }
  const events = await getUpcomingEventsFromFilesystem();
  return events.map((e) => e.slug || e.id);
}

/** @deprecated Use getAllUpcomingEventSlugs instead */
export async function getAllUpcomingEventIds(): Promise<string[]> {
  if (USE_API) {
    return getAllUpcomingEventSlugs();
  }
  const events = await getUpcomingEventsFromFilesystem();
  return events.map((e) => e.id);
}

// ========================================
// Pages (filesystem only — no API endpoint)
// ========================================

export async function getAllPages(): Promise<Page[]> {
  if (pagesCache) return pagesCache;

  try {
    const files = await readdir(PAGES_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    const pages: Page[] = [];

    for (const file of jsonFiles) {
      const filePath = join(PAGES_DIR, file);
      const page = await loadJSON<Page>(filePath);
      if (page && page.status === "publish") {
        pages.push(page);
      }
    }

    pagesCache = pages;
    return pages;
  } catch (error) {
    console.error("Error loading pages:", error);
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const pages = await getAllPages();
  return pages.find((p) => p.slug === slug) || null;
}

// ========================================
// Images
// ========================================

async function getImageManifest(): Promise<ImageManifest> {
  if (imageManifestCache) return imageManifestCache;

  const manifestPath = join(METADATA_DIR, "image-manifest.json");
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

  const categoriesPath = join(METADATA_DIR, "categories.json");
  const data = await loadJSON<{ categories: Category[] }>(categoriesPath);

  if (data && data.categories) {
    categoriesCache = data.categories;
    return data.categories;
  }

  return [];
}

export async function getAuthors(): Promise<Author[]> {
  const authorsPath = join(METADATA_DIR, "authors.json");
  const data = await loadJSON<{ authors: Author[] }>(authorsPath);
  return data?.authors || [];
}

// ========================================
// Signatures (filesystem only — no API endpoint)
// ========================================

export async function getSignatures(): Promise<SignatureItem[]> {
  if (signaturesCache) return signaturesCache;

  const filePath = join(DATA_BASE, "signatures.json");
  const items = await loadJSON<SignatureItem[]>(filePath);
  signaturesCache = (items || []).sort((a, b) => a.order - b.order);
  return signaturesCache;
}

// ========================================
// Cigar Brands — API-backed (no filesystem fallback)
// ========================================

export async function getBrands(): Promise<ApiCigarBrand[]> {
  if (USE_API) {
    try {
      return await fetchCigarBrands();
    } catch (err) {
      console.error("getBrands API error:", err);
      return [];
    }
  }
  return [];
}

// ========================================
// Cache management
// ========================================

export function clearCache(): void {
  pagesCache = null;
  categoriesCache = null;
  imageManifestCache = null;
  upcomingEventsCache = null;
  signaturesCache = null;
}

// ========================================
// Cigars
// ========================================

export async function getCigars(
  filters: { brandId?: string; strength?: string; origin?: string } = {},
): Promise<ApiCigar[]> {
  if (USE_API) {
    try {
      const result = await fetchAllCigars(1, 200, filters);
      return result.cigars;
    } catch (err) {
      console.error("getCigars API error:", err);
      return [];
    }
  }
  return [];
}

export async function getCigarBySlug(slug: string): Promise<ApiCigar | null> {
  if (USE_API) {
    try {
      return await fetchCigarBySlug(slug);
    } catch (err) {
      console.error("getCigarBySlug API error:", err);
      return null;
    }
  }
  return null;
}

// ========================================
// Alcohol
// ========================================

export async function getAlcohol(
  filters: { category?: string; brand?: string; inHouse?: boolean } = {},
): Promise<ApiAlcohol[]> {
  if (USE_API) {
    try {
      const result = await fetchAllAlcohol(1, 200, filters);
      return result.items;
    } catch (err) {
      console.error("getAlcohol API error:", err);
      return [];
    }
  }
  return [];
}

export async function getAlcoholBySlug(
  slug: string,
): Promise<ApiAlcohol | null> {
  if (USE_API) {
    try {
      return await fetchAlcoholBySlug(slug);
    } catch (err) {
      console.error("getAlcoholBySlug API error:", err);
      return null;
    }
  }
  return null;
}

// ========================================
// Accessories
// ========================================

export async function getAccessories(): Promise<ApiAccessory[]> {
  if (USE_API) {
    try {
      const result = await fetchAllAccessories(1, 200);
      return result.items;
    } catch (err) {
      console.error("getAccessories API error:", err);
      return [];
    }
  }
  return [];
}

export async function getAccessoryBySlug(
  slug: string,
): Promise<ApiAccessory | null> {
  if (USE_API) {
    try {
      return await fetchAccessoryBySlug(slug);
    } catch (err) {
      console.error("getAccessoryBySlug API error:", err);
      return null;
    }
  }
  return null;
}

// ========================================
// Menu
// ========================================

export async function getMenuSections(): Promise<ApiMenuSection[]> {
  if (USE_API) {
    try {
      return await fetchPublicMenu();
    } catch (err) {
      console.error("getMenuSections API error:", err);
      return [];
    }
  }
  return [];
}
