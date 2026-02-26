import { redirect } from 'next/navigation';
import { getAllEventSlugs } from '@/lib/content';

export const revalidate = 300;

// Allow slugs not in generateStaticParams to be rendered on-demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function UpcomingEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Canonical URL is /{slug} — redirect so old links resolve correctly.
  redirect(`/${slug}`);
}
