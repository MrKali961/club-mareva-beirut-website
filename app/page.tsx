import { getLatestPosts } from "@/lib/content";
import Hero from "@/components/sections/Hero";
import Introduction from "@/components/sections/Introduction";
import BrandShowcase from "@/components/sections/BrandShowcase";
import EventsCarousel from "@/components/sections/EventsCarousel";
import Story from "@/components/sections/Story";
import Amenities from "@/components/sections/Amenities";
import AgeVerification from "@/components/AgeVerification";
import CTASection from "@/components/sections/CTASection";

export default async function Home() {
  const posts = await getLatestPosts(6);

  // Map posts to EventItem format
  const events = posts.map(post => ({
    id: post.id,
    title: post.title,
    date: new Date(post.date_created).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: post.categories[0] || 'Events',
    image: post.featured_image?.local_path
      ? `/${post.featured_image.local_path}`
      : '',
    slug: post.slug
  }));

  return (
    <main>
      <AgeVerification />
      <Hero />
      <EventsCarousel events={events} />
      <BrandShowcase />
      <Introduction />
      <Story />
      <Amenities />
      <CTASection />
    </main>
  );
}
