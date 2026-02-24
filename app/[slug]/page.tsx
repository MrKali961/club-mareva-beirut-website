import { notFound } from 'next/navigation';
import { getPostBySlug, getLatestPosts, getAllPostSlugs, getUpcomingEventBySlug, getUpcomingEvents } from '@/lib/content';
import PostClient from './PostClient';
import UpcomingEventDetail from '../news-and-events/upcoming/[slug]/UpcomingEventDetail';

export const revalidate = 300;

// Allow slugs not returned by generateStaticParams to be rendered on-demand
// (ISR fallback). This ensures articles published after the last build are
// accessible immediately without requiring a full rebuild.
export const dynamicParams = true;

function resolveImagePath(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    // The slug may belong to an event. Render it directly here so the
    // canonical URL stays at /{slug} rather than /news-and-events/upcoming/{slug}.
    const event = await getUpcomingEventBySlug(slug);
    if (event) {
      const allUpcoming = await getUpcomingEvents();
      const otherEvents = allUpcoming
        .filter(e => e.id !== event.id)
        .slice(0, 3)
        .map(e => ({
          id: e.id,
          slug: e.slug,
          title: e.title,
          category: e.category,
          image: e.image,
          month: new Date(e.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
          day: new Date(e.date).getDate().toString(),
          displayDate: new Date(e.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
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
        month: new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        day: new Date(event.date).getDate().toString(),
        displayDate: new Date(event.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }),
        time: new Date(event.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      };

      return <UpcomingEventDetail event={eventData} otherEvents={otherEvents} />;
    }
    return notFound();
  }

  // Get related posts (latest 3, excluding current post)
  const latestPosts = await getLatestPosts(4);
  const relatedPosts = latestPosts
    .filter(p => p.slug !== post.slug)
    .slice(0, 3)
    .map(p => ({
      title: p.title,
      slug: p.slug,
      date: new Date(p.date_created).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      category: p.categories[0] || 'Events',
      image: resolveImagePath(p.featured_image?.local_path || p.featured_image?.original_url),
      excerpt: p.content.text.substring(0, 120) + '...'
    }));

  // Map post to client-safe format
  const postData = {
    title: post.title,
    slug: post.slug,
    date: new Date(post.date_created).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: post.categories[0] || 'Events',
    featuredImage: resolveImagePath(post.featured_image?.local_path || post.featured_image?.original_url),
    content: post.content.clean,
    images: post.images
      .filter(img => img.local_path || img.original_url)
      .map(img => resolveImagePath(img.local_path || img.original_url))
  };

  return <PostClient post={postData} relatedPosts={relatedPosts} />;
}
