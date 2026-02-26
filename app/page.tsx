import { getLatestPosts, getUpcomingEvents, getBrands } from "@/lib/content";
import { fetchAllEvents } from "@/lib/api/events";
import type { ApiEvent } from "@/lib/api/types";
import { apiBrandToShowcaseBrand } from "@/lib/adapters/brands-adapter";
import Hero from "@/components/sections/Hero";
import Introduction from "@/components/sections/Introduction";
import BrandShowcase from "@/components/sections/BrandShowcase";
import EventsCarousel from "@/components/sections/EventsCarousel";
import Story from "@/components/sections/Story";
import Amenities from "@/components/sections/Amenities";
import CTASection from "@/components/sections/CTASection";

export const revalidate = 300;

function resolveImagePath(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

export default async function Home() {
  const [posts, upcomingEvents, eventsResponse] = await Promise.all([
    getLatestPosts(10),
    getUpcomingEvents(),
    fetchAllEvents(1, 50).catch(() => ({
      items: [] as ApiEvent[],
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
    })),
  ]);

  // Fetch cigar brands for BrandShowcase
  let brandItems: { name: string; logo: string }[] = [];
  try {
    const apiBrands = await getBrands();
    brandItems = apiBrands.map(apiBrandToShowcaseBrand);
  } catch (error) {
    console.error('Error fetching brands for showcase:', error);
  }

  // Combine news + upcoming events + past events, deduplicate, sort by date
  const seenSlugs = new Set<string>();
  const upcomingSlugs = new Set(upcomingEvents.map(e => e.slug));

  type CarouselEntry = {
    id: number | string;
    title: string;
    rawDate: number;
    category: string;
    image: string;
    slug: string;
    type: 'upcoming' | 'event' | 'news';
  };

  const allItems: CarouselEntry[] = [];

  // Upcoming events
  for (const event of upcomingEvents) {
    const slug = event.slug || '';
    if (!slug || seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);
    allItems.push({
      id: event.id,
      title: event.title,
      rawDate: new Date(event.date).getTime(),
      category: event.category,
      image: resolveImagePath(event.image),
      slug,
      type: 'upcoming',
    });
  }

  // Past events (exclude upcoming + duplicates)
  for (const event of eventsResponse.items) {
    if (upcomingSlugs.has(event.slug) || seenSlugs.has(event.slug)) continue;
    seenSlugs.add(event.slug);
    const imageUrl = event.imageUrls?.original || event.image?.url || event.mainImageUrl || '';
    allItems.push({
      id: event.id,
      title: event.title,
      rawDate: new Date(event.date).getTime(),
      category: 'Events',
      image: resolveImagePath(imageUrl),
      slug: event.slug,
      type: 'event',
    });
  }

  // News posts (exclude duplicates)
  for (const post of posts) {
    if (seenSlugs.has(post.slug)) continue;
    seenSlugs.add(post.slug);
    allItems.push({
      id: post.id,
      title: post.title,
      rawDate: new Date(post.date_created).getTime(),
      category: post.categories[0] || 'News',
      image: resolveImagePath(post.featured_image?.local_path),
      slug: post.slug,
      type: 'news',
    });
  }

  // Sort by date (newest first), take top 8
  allItems.sort((a, b) => b.rawDate - a.rawDate);
  const events = allItems.slice(0, 8).map(({ rawDate, ...rest }) => ({
    ...rest,
    date: new Date(rawDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }));

  return (
    <main>
      <Hero />
      <EventsCarousel events={events} />
      <BrandShowcase brands={brandItems} />
      <Introduction />
      <Story />
      <Amenities />
      <CTASection />
    </main>
  );
}
