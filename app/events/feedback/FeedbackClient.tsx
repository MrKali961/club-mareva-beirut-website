'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface EventInfo {
  visitorName: string;
  eventTitle: string;
  eventDate: string;
  status: string;
  existingFeedback: {
    rating: number;
    comment: string | null;
    submittedAt: string;
  } | null;
}

type Status = 'loading' | 'ready' | 'submitting' | 'success' | 'error' | 'invalid';

const MAX_COMMENT_LENGTH = 2000;

function formatEventDate(value: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

interface FeedbackClientProps {
  token: string;
  initialRating: number;
}

export default function FeedbackClient({ token, initialRating }: FeedbackClientProps) {
  const [status, setStatus] = useState<Status>('loading');
  const [info, setInfo] = useState<EventInfo | null>(null);
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Initial fetch — confirms the token is valid and pulls event details for display.
  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBase) {
      setErrorMessage('Feedback service is not available. Please try again later.');
      setStatus('error');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/events/feedback/${encodeURIComponent(token)}`, {
          method: 'GET',
          cache: 'no-store',
        });
        const json = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setStatus('invalid');
          setErrorMessage(json?.error?.message || json?.error || 'Feedback link is invalid or has expired.');
          return;
        }

        const data = json.data as EventInfo;
        setInfo(data);
        if (data.existingFeedback) {
          setRating(data.existingFeedback.rating);
          setComment(data.existingFeedback.comment ?? '');
        }
        setStatus('ready');
      } catch {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage('Unable to load your feedback page. Please try again.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const submit = async () => {
    if (rating < 1 || rating > 5) return;
    setStatus('submitting');
    setErrorMessage('');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const trimmed = comment.trim();
      const res = await fetch(`${apiBase}/events/feedback/${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, ...(trimmed ? { comment: trimmed } : {}) }),
      });
      const json = await res.json();

      if (!res.ok) {
        setStatus('ready');
        setErrorMessage(json?.error?.message || json?.error || 'Failed to submit feedback. Please try again.');
        return;
      }

      setStatus('success');
    } catch {
      setStatus('ready');
      setErrorMessage('Unable to submit feedback. Please try again.');
    }
  };

  const displayedRating = hover > 0 ? hover : rating;
  const ratingLabel: Record<number, string> = {
    0: 'Tap a star to rate your experience',
    1: 'Poor',
    2: 'Below expectations',
    3: 'Good',
    4: 'Great',
    5: 'Exceptional',
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <p className="font-playfair text-cream/60 text-sm tracking-wider">Loading your feedback page&hellip;</p>
      </main>
    );
  }

  if (status === 'invalid') {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 border border-red-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl text-cream mb-4 tracking-wider">Link Unavailable</h1>
          <p className="font-playfair text-cream/60 text-sm">{errorMessage}</p>
        </div>
      </main>
    );
  }

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          <div className="w-16 h-16 mx-auto mb-6 border border-gold/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl text-cream mb-3 tracking-wider">Thank You</h1>
          <p className="font-playfair text-cream/70 text-sm mb-8">
            Your feedback has been recorded. We&rsquo;re grateful for your time and for helping us improve.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-8 py-3 border border-gold/50 text-gold font-playfair text-sm uppercase tracking-[0.15em] hover:border-gold hover:bg-gold/10 transition-all duration-300"
          >
            Back to Home
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl"
      >
        <p className="font-playfair text-cream/50 text-xs uppercase tracking-[0.3em] text-center mb-4">
          How did we do?
        </p>
        <h1 className="font-playfair text-3xl md:text-4xl text-cream text-center mb-2 tracking-wider">
          {info?.eventTitle ?? 'Share Your Feedback'}
        </h1>
        {info?.eventDate && (
          <p className="font-playfair text-cream/50 text-xs tracking-wider text-center mb-10">
            {formatEventDate(info.eventDate)}
          </p>
        )}

        <p className="font-playfair text-cream/70 text-sm text-center mb-2">
          {info?.visitorName ? `Dear ${info.visitorName},` : 'Dear guest,'}
        </p>
        <p className="font-playfair text-cream/70 text-sm leading-relaxed text-center mb-10">
          Thank you for joining us. Your feedback helps us craft better experiences for every guest who walks through our doors.
        </p>

        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((value) => {
            const filled = value <= displayedRating;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
                aria-label={`${value} star${value > 1 ? 's' : ''}`}
                className="text-4xl md:text-5xl leading-none transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-gold/40"
                style={{ color: filled ? '#C6B158' : 'rgba(245,245,240,0.2)' }}
              >
                {filled ? '★' : '☆'}
              </button>
            );
          })}
        </div>

        <p className="font-playfair text-cream/50 text-xs uppercase tracking-[0.2em] text-center mb-10 min-h-[1.25rem]">
          {ratingLabel[displayedRating] ?? ''}
        </p>

        <label
          htmlFor="feedback-comment"
          className="block font-playfair text-xs uppercase tracking-[0.2em] text-cream/50 mb-2"
        >
          Comments (optional)
        </label>
        <textarea
          id="feedback-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
          rows={5}
          maxLength={MAX_COMMENT_LENGTH}
          placeholder="Tell us what you loved, or what we could do better."
          className="w-full bg-black/40 border border-gold/30 focus:border-gold/70 focus:outline-none text-cream font-playfair text-sm p-4 placeholder:text-cream/30 transition-colors"
        />
        <p className="font-playfair text-cream/30 text-[10px] tracking-wider mt-1 mb-6 text-right">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </p>

        {errorMessage && (
          <p className="font-playfair text-red-400/80 text-xs text-center mb-4">{errorMessage}</p>
        )}

        <div className="flex justify-center">
          <button
            type="button"
            disabled={rating < 1 || status === 'submitting'}
            onClick={submit}
            className="px-10 py-3 bg-gold/90 text-black font-playfair text-sm uppercase tracking-[0.2em] hover:bg-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'Submitting…' : 'Submit Feedback'}
          </button>
        </div>

        {info?.existingFeedback && (
          <p className="font-playfair text-cream/40 text-[11px] tracking-wider text-center mt-6">
            You previously submitted feedback for this event. Submitting again will update your response.
          </p>
        )}
      </motion.div>
    </main>
  );
}
