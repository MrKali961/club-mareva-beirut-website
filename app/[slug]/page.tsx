import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getLatestPosts,
  getAllPostSlugs,
  getAllEventSlugs,
  getUpcomingEventBySlug,
  getUpcomingEvents,
} from "@/lib/content";
import { extractImagesFromHtml } from "@/lib/adapters";
import PostClient from "./PostClient";
import UpcomingEventDetail from "../news-and-events/upcoming/[slug]/UpcomingEventDetail";

export const revalidate = 300;

// Allow slugs not returned by generateStaticParams to be rendered on-demand
// (ISR fallback). This ensures articles published after the last build are
// accessible immediately without requiring a full rebuild.
export const dynamicParams = true;

const SITE_URL = "https://www.clubmarevabeirut.com";

function resolveImagePath(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

function resolveAbsoluteImageUrl(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? `${SITE_URL}${path}` : `${SITE_URL}/${path}`;
}

/**
 * Build an OG-friendly image URL. For S3-hosted images, use the medium
 * variant (~800px, <200KB) instead of the full-size original (often 2-3MB).
 * WhatsApp and Messenger struggle with large images in link previews.
 */
function resolveOgImageUrl(path: string | undefined): string {
  const url = resolveAbsoluteImageUrl(path);
  if (!url) return "";
  // S3 images have -medium.webp variants generated on upload
  if (url.includes("club-mareva.s3.")) {
    return url.replace(/\.[^.]+$/, "-medium.webp");
  }
  return url;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Check events first: items in both tables should resolve as Events
  const event = await getUpcomingEventBySlug(slug);
  if (event) {
    const ogImage = resolveOgImageUrl(event.image);
    const metaTitle = event.metaTitle || event.title;
    const metaDescription = event.metaDescription || event.description || "";
    const imageAlt = event.metaImageAlt || event.title;
    return {
      title: metaTitle,
      description: metaDescription,
      ...(event.metaKeywords && {
        keywords: event.metaKeywords.split(",").map((k: string) => k.trim()),
      }),
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: `${SITE_URL}/${slug}`,
        siteName: "Club Mareva Beirut",
        type: "article",
        images: ogImage
          ? [{ url: ogImage, width: 800, height: 420, alt: imageAlt }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: ogImage ? [ogImage] : [],
      },
    };
  }

  const post = await getPostBySlug(slug);
  if (post) {
    const ogImage = resolveOgImageUrl(
      post.featured_image?.local_path || post.featured_image?.original_url,
    );
    const metaTitle = post.seo?.metaTitle || post.title;
    const metaDescription =
      post.seo?.metaDescription || post.content.text.substring(0, 155);
    const imageAlt = post.seo?.metaImageAlt || post.title;
    return {
      title: metaTitle,
      description: metaDescription,
      ...(post.seo?.metaKeywords && {
        keywords: post.seo.metaKeywords.split(",").map((k: string) => k.trim()),
      }),
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: `${SITE_URL}/${slug}`,
        siteName: "Club Mareva Beirut",
        type: "article",
        images: ogImage
          ? [{ url: ogImage, width: 800, height: 420, alt: imageAlt }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: ogImage ? [ogImage] : [],
      },
    };
  }

  return { title: "Club Mareva Beirut" };
}

export async function generateStaticParams() {
  const [newsSlugs, eventSlugs] = await Promise.all([
    getAllPostSlugs(),
    getAllEventSlugs(),
  ]);
  const allSlugs = [...new Set([...newsSlugs, ...eventSlugs])];
  return allSlugs.map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Check events first: items in both tables should resolve as Events
  // (matches original WordPress categories and listing page behaviour)
  const event = await getUpcomingEventBySlug(slug);
  if (event) {
    const isPastEvent = new Date(event.date) < new Date();

    if (isPastEvent) {
      const latestPosts = await getLatestPosts(4);
      const relatedPosts = latestPosts
        .filter((p) => p.slug !== event.slug)
        .slice(0, 3)
        .map((p) => ({
          title: p.title,
          slug: p.slug,
          date: new Date(p.date_created).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          }),
          category: p.categories[0] || "Events",
          image: resolveImagePath(
            p.featured_image?.local_path || p.featured_image?.original_url,
          ),
          mediaType:
            p.featuredMediaType ?? p.featured_image?.mediaType ?? "image",
          excerpt: p.content.text.substring(0, 120) + "...",
        }));

      const sortedGallery = (event.galleryImages ?? [])
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder);
      const galleryImages = sortedGallery.length > 0
        ? sortedGallery.map((gi) => resolveImagePath(gi.imageUrls.original))
        : extractImagesFromHtml(event.body || '');
      const galleryMediaTypes: ('image' | 'video')[] = sortedGallery.length > 0
        ? sortedGallery.map((gi) => gi.mediaType ?? 'image')
        : galleryImages.map(() => 'image' as const);

      // Build imageIdMap from gallery images (maps junction-table ID → URL)
      const imageIdMap: Record<string, string> = {};
      const mediaTypeIdMap: Record<string, 'image' | 'video'> = {};
      for (const gi of event.galleryImages ?? []) {
        imageIdMap[gi.id] = resolveImagePath(gi.imageUrls.original);
        mediaTypeIdMap[gi.id] = gi.mediaType ?? 'image';
      }

      const postData = {
        title: event.title,
        slug: event.slug,
        date: new Date(event.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        }),
        category: event.category || "Events",
        featuredImage: resolveImagePath(event.image),
        featuredMediaType: event.mediaType ?? "image",
        content: event.body || "",
        images: galleryImages,
        imageMediaTypes: galleryMediaTypes,
        galleryLayout: event.galleryLayout ?? null,
        imageIdMap,
        mediaTypeIdMap,
      };

      return <PostClient post={postData} relatedPosts={relatedPosts} />;
    }

    // Future event → UpcomingEventDetail
    const allUpcoming = await getUpcomingEvents();
    const otherEvents = allUpcoming
      .filter((e) => e.id !== event.id)
      .slice(0, 3)
      .map((e) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        category: e.category,
        image: e.image,
        mediaType: e.mediaType ?? ("image" as const),
        month: new Date(e.date)
          .toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
          .toUpperCase(),
        day: new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "UTC" }).format(new Date(e.date)),
        displayDate: new Date(e.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        }),
      }));

    const eventData = {
      id: event.id,
      title: event.title,
      category: event.category,
      description: event.description,
      image: event.image,
      mediaType: event.mediaType ?? ("image" as const),
      body: event.body,
      location: event.location,
      maxVisitors: event.maxVisitors,
      month: new Date(event.date)
        .toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
        .toUpperCase(),
      day: new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "UTC" }).format(new Date(event.date)),
      displayDate: new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }),
      time: new Date(event.date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      }),
    };

    return (
      <UpcomingEventDetail event={eventData} otherEvents={otherEvents} />
    );
  }

  // Fallback: news-only items (not in events table)
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const latestPosts = await getLatestPosts(4);
  const relatedPosts = latestPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      date: new Date(p.date_created).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }),
      category: p.categories[0] || "Events",
      image: resolveImagePath(
        p.featured_image?.local_path || p.featured_image?.original_url,
      ),
      mediaType:
        p.featuredMediaType ?? p.featured_image?.mediaType ?? "image",
      excerpt: p.content.text.substring(0, 120) + "...",
    }));

  const galleryImgs = post.images.filter((img) => img.local_path || img.original_url);
  const postData = {
    title: post.title,
    slug: post.slug,
    date: new Date(post.date_created).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }),
    category: post.categories[0] || "Events",
    featuredImage: resolveImagePath(
      post.featured_image?.local_path || post.featured_image?.original_url,
    ),
    featuredMediaType:
      post.featuredMediaType ?? post.featured_image?.mediaType ?? "image",
    content: post.content.clean,
    images: galleryImgs.map((img) =>
      resolveImagePath(img.local_path || img.original_url),
    ),
    imageMediaTypes: galleryImgs.map((img) => img.mediaType ?? "image"),
    galleryLayout: post.galleryLayout ?? null,
    imageIdMap: post.imageIdMap ?? {},
    mediaTypeIdMap: post.mediaTypeIdMap ?? {},
  };

  return <PostClient post={postData} relatedPosts={relatedPosts} />;
}
