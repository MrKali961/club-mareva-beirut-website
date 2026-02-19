import { MetadataRoute } from 'next';
import { getAllPosts, getUpcomingEvents } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://clubmarevabeirut.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/cigars`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/our-signature`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/news-and-events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Dynamic post pages
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts();
    postEntries = posts.map(post => ({
      url: `${baseUrl}/news-and-events/${post.slug}`,
      lastModified: new Date(post.date_modified || post.date_created),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  // Dynamic event pages
  let eventEntries: MetadataRoute.Sitemap = [];
  try {
    const events = await getUpcomingEvents();
    eventEntries = events.map(event => ({
      url: `${baseUrl}/news-and-events/upcoming/${event.slug || event.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching events for sitemap:', error);
  }

  return [...staticPages, ...postEntries, ...eventEntries];
}
