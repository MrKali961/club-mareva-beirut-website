import type { Metadata } from 'next';
import FeedbackClient from './FeedbackClient';

export const metadata: Metadata = {
  title: 'Share Your Feedback — Club Mareva Beirut',
};

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; rating?: string }>;
}) {
  const { token, rating } = await searchParams;

  if (!token) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 border border-red-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl text-cream mb-4">Invalid Link</h1>
          <p className="font-playfair text-cream/60 text-sm">
            This feedback link is invalid or has expired.
          </p>
        </div>
      </main>
    );
  }

  const parsedRating = Number.parseInt(rating ?? '', 10);
  const initialRating =
    Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5
      ? parsedRating
      : 0;

  return <FeedbackClient token={token} initialRating={initialRating} />;
}
