import { getAllPosts } from '@/lib/content';
import NewsEventsClient from './NewsEventsClient';

export default async function NewsAndEventsPage() {
  const posts = await getAllPosts();

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
    image: post.featured_image?.local_path
      ? `/${post.featured_image.local_path}`
      : '',
    slug: post.slug,
    excerpt: post.content.text.substring(0, 150) + '...',
    readTime: `${Math.ceil(post.content.text.split(' ').length / 200)} min`
  }));

  return <NewsEventsClient posts={mappedPosts} />;
}
