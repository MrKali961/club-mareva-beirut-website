import { getAllPosts, getUpcomingEvents } from "@/lib/content";
import { fetchAllEvents } from "@/lib/api/events";
import { stripHtml } from "@/lib/adapters/news-adapter";
import type { Post } from "@/lib/content";
import type { ApiEvent } from "@/lib/api/types";
import NewsEventsClient from "./NewsEventsClient";

export const revalidate = 300;

function resolveImagePath(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

export default async function NewsAndEventsPage() {
  const [posts, upcomingEvents, eventsResponse] = await Promise.all([
    getAllPosts(),
    getUpcomingEvents(),
    fetchAllEvents(1, 50).catch(() => ({
      items: [] as ApiEvent[],
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
    })),
  ]);

  type SortableNews = { kind: "news"; data: Post; sortDate: number };
  type SortableEvent = { kind: "event"; data: ApiEvent; sortDate: number };

  const combined: (SortableNews | SortableEvent)[] = [
    ...posts.map((p) => ({
      kind: "news" as const,
      data: p,
      sortDate: new Date(p.date_created).getTime(),
    })),
    ...eventsResponse.items.map((e) => ({
      kind: "event" as const,
      data: e,
      sortDate: new Date(e.date).getTime(),
    })),
  ].sort((a, b) => b.sortDate - a.sortDate);

  const allPosts = combined.map((item) => {
    if (item.kind === "news") {
      const post = item.data;
      return {
        id: post.id,
        title: post.title,
        date: new Date(post.date_created).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        category: "News",
        image: resolveImagePath(
          post.featured_image?.local_path || post.featured_image?.original_url,
        ),
        slug: post.slug,
        excerpt: post.content.text.substring(0, 150) + "...",
        readTime: `${Math.ceil(post.content.text.split(" ").length / 200)} min`,
      };
    }

    const event = item.data;
    const imageUrl =
      event.imageUrls?.original || event.image?.url || event.mainImageUrl || "";
    const bodyText = stripHtml(event.body || "");
    return {
      id: 0,
      title: event.title,
      date: new Date(event.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      category: "Events",
      image: resolveImagePath(imageUrl),
      slug: event.slug,
      excerpt:
        bodyText.substring(0, 150) + (bodyText.length > 150 ? "..." : ""),
      readTime: `${Math.ceil((bodyText.split(" ").length || 1) / 200)} min`,
    };
  });

  const mappedUpcoming = upcomingEvents.map((event) => ({
    id: event.id,
    slug: event.slug || event.id,
    title: event.title,
    date: event.date,
    category: event.category,
    description: event.description,
    image: event.image,
    featured: event.featured,
    month: new Date(event.date)
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase(),
    day: new Date(event.date).getDate().toString(),
    displayDate: new Date(event.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
  }));

  return <NewsEventsClient posts={allPosts} upcomingEvents={mappedUpcoming} />;
}
