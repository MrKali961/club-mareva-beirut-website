'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const TRACK_URL = `${API_BASE}/analytics/track`;

const STATIC_PATHS = new Set([
  '/',
  '/cigars',
  '/contact',
  '/our-signature',
  '/privacy',
  '/terms',
  '/news-and-events',
]);

type ContentType = 'news' | 'event' | 'page';

function detectContent(pathname: string): { contentType: ContentType | undefined; slug: string | undefined } {
  if (pathname.startsWith('/news-and-events/upcoming/')) {
    const slug = pathname.replace('/news-and-events/upcoming/', '').replace(/\/$/, '') || undefined;
    return { contentType: 'event', slug };
  }

  if (STATIC_PATHS.has(pathname) || pathname.startsWith('/news-and-events')) {
    return { contentType: 'page', slug: undefined };
  }

  // Single-segment paths like /[slug]
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 1) {
    return { contentType: undefined, slug: parts[0] };
  }

  return { contentType: 'page', slug: undefined };
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const stored = sessionStorage.getItem('_ma_sid');

  if (stored) {
    const [storedDate] = stored.split('-');
    if (storedDate === today.replace(/-/g, '')) {
      return stored;
    }
  }

  const random = Math.random().toString(36).slice(2, 10).padEnd(8, '0');
  const id = `${today.replace(/-/g, '')}-${random}`;
  sessionStorage.setItem('_ma_sid', id);
  return id;
}

function sendBeacon(payload: Record<string, unknown>): void {
  if (!navigator.sendBeacon) return;
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  navigator.sendBeacon(TRACK_URL, blob);
}

function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageStartRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const prevPathRef = useRef<string | null>(null);
  const utmCapturedRef = useRef(false);
  const utmRef = useRef<{ utmSource?: string; utmMedium?: string; utmCampaign?: string }>({});

  // Store page info for the current page so we can send it on exit
  const pageInfoRef = useRef<{
    path: string;
    slug: string | undefined;
    contentType: ContentType | undefined;
    referrer: string | undefined;
  } | null>(null);

  // Capture UTM params once on first load
  useEffect(() => {
    if (!utmCapturedRef.current) {
      utmCapturedRef.current = true;
      const utmSource = searchParams.get('utm_source') ?? undefined;
      const utmMedium = searchParams.get('utm_medium') ?? undefined;
      const utmCampaign = searchParams.get('utm_campaign') ?? undefined;
      utmRef.current = { utmSource, utmMedium, utmCampaign };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll depth tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);
      if (pct > maxScrollRef.current) maxScrollRef.current = pct;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Send ONE beacon per page on exit (beforeunload)
  useEffect(() => {
    const sendPageBeacon = () => {
      const info = pageInfoRef.current;
      if (!info) return;
      sendBeacon({
        path: info.path,
        slug: info.slug,
        contentType: info.contentType,
        referrer: info.referrer,
        sessionId: getSessionId(),
        scrollDepth: maxScrollRef.current,
        duration: Math.round((Date.now() - pageStartRef.current) / 1000),
        ...utmRef.current,
      });
    };

    window.addEventListener('beforeunload', sendPageBeacon);
    return () => window.removeEventListener('beforeunload', sendPageBeacon);
  }, [pathname]);

  // On route change: send beacon for PREVIOUS page, then store new page info
  useEffect(() => {
    // Send beacon for the previous page (with accumulated scroll/duration)
    if (prevPathRef.current !== null && prevPathRef.current !== pathname) {
      const info = pageInfoRef.current;
      if (info) {
        sendBeacon({
          path: info.path,
          slug: info.slug,
          contentType: info.contentType,
          referrer: info.referrer,
          sessionId: getSessionId(),
          scrollDepth: maxScrollRef.current,
          duration: Math.round((Date.now() - pageStartRef.current) / 1000),
          ...utmRef.current,
        });
      }
    }

    // Reset state for new page
    pageStartRef.current = Date.now();
    maxScrollRef.current = 0;
    prevPathRef.current = pathname;

    // Store current page info for later beacon send
    const { contentType, slug } = detectContent(pathname);
    pageInfoRef.current = {
      path: pathname,
      slug,
      contentType,
      referrer: document.referrer || undefined,
    };
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTrackerInner />
      </Suspense>
      {children}
    </>
  );
}
