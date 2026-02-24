import { notFound } from 'next/navigation';
import { getPostBySlug, getLatestPosts } from '@/lib/content';
import PostClient from './PostClient';

export const revalidate = 300;

function resolveImagePath(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

export async function generateStaticParams() {
  const posts = await getLatestPosts(20);
  return posts.map(post => ({ slug: post.slug }));
}

export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
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
