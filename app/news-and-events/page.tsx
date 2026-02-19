import { getAllPosts, getUpcomingEvents } from '@/lib/content';
import NewsEventsClient from './NewsEventsClient';

export const revalidate = 300;

function resolveImagePath(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

export default async function NewsAndEventsPage() {
  const posts = await getAllPosts();
  const upcomingEvents = await getUpcomingEvents();

  // Map to client-safe format
  const mappedPosts = posts.map(post => ({
    id: post.id,
    title: post.title,
    date: new Date(post.date_created).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: post.categories[0] || 'Uncategorized',
    image: resolveImagePath(post.featured_image?.local_path || post.featured_image?.original_url),
    slug: post.slug,
    excerpt: post.content.text.substring(0, 150) + '...',
    readTime: `${Math.ceil(post.content.text.split(' ').length / 200)} min`
  }));

  const mappedUpcoming = upcomingEvents.map(event => ({
    id: event.id,
    slug: event.slug || event.id,
    title: event.title,
    date: event.date,
    category: event.category,
    description: event.description,
    image: event.image,
    featured: event.featured,
    month: new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: new Date(event.date).getDate().toString(),
    displayDate: new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }),
  }));

  return <NewsEventsClient posts={mappedPosts} upcomingEvents={mappedUpcoming} />;
}
