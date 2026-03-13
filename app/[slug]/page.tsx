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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Check events first: items in both tables should resolve as Events
  const event = await getUpcomingEventBySlug(slug);
  if (event) {
    const imageUrl = resolveAbsoluteImageUrl(event.image);
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
        images: imageUrl
          ? [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  }

  const post = await getPostBySlug(slug);
  if (post) {
    const imageUrl = resolveAbsoluteImageUrl(
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
        images: imageUrl
          ? [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: imageUrl ? [imageUrl] : [],
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
          }),
          category: p.categories[0] || "Events",
          image: resolveImagePath(
            p.featured_image?.local_path || p.featured_image?.original_url,
          ),
          excerpt: p.content.text.substring(0, 120) + "...",
        }));

      const galleryImages = (event.galleryImages ?? []).length > 0
        ? (event.galleryImages ?? [])
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((gi) => resolveImagePath(gi.imageUrls.original))
        : extractImagesFromHtml(event.body || '');

      // Build imageIdMap from gallery images (maps junction-table ID → URL)
      const imageIdMap: Record<string, string> = {};
      for (const gi of event.galleryImages ?? []) {
        imageIdMap[gi.id] = resolveImagePath(gi.imageUrls.original);
      }

      const postData = {
        title: event.title,
        slug: event.slug,
        date: new Date(event.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        category: event.category || "Events",
        featuredImage: resolveImagePath(event.image),
        content: event.body || "",
        images: galleryImages,
        galleryLayout: event.galleryLayout ?? null,
        imageIdMap,
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
        month: new Date(e.date)
          .toLocaleDateString("en-US", { month: "short" })
          .toUpperCase(),
        day: new Date(e.date).getDate().toString(),
        displayDate: new Date(e.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      }));

    const eventData = {
      id: event.id,
      title: event.title,
      category: event.category,
      description: event.description,
      image: event.image,
      body: event.body,
      location: event.location,
      maxVisitors: event.maxVisitors,
      month: new Date(event.date)
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase(),
      day: new Date(event.date).getDate().toString(),
      displayDate: new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      time: new Date(event.date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
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
      }),
      category: p.categories[0] || "Events",
      image: resolveImagePath(
        p.featured_image?.local_path || p.featured_image?.original_url,
      ),
      excerpt: p.content.text.substring(0, 120) + "...",
    }));

  const postData = {
    title: post.title,
    slug: post.slug,
    date: new Date(post.date_created).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    category: post.categories[0] || "Events",
    featuredImage: resolveImagePath(
      post.featured_image?.local_path || post.featured_image?.original_url,
    ),
    content: post.content.clean,
    images: post.images
      .filter((img) => img.local_path || img.original_url)
      .map((img) => resolveImagePath(img.local_path || img.original_url)),
    galleryLayout: post.galleryLayout ?? null,
    imageIdMap: post.imageIdMap ?? {},
  };

  return <PostClient post={postData} relatedPosts={relatedPosts} />;
}
