'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

/**
 * Slim announcement bar pinned to the very top of the site, above the nav.
 * Shown only while the GRAND DRAW public display is live (toggled in admin
 * settings). It sets the `--gd-banner-h` CSS variable so the nav shifts down
 * and page content offsets by exactly the bar's height; when not live nothing
 * renders and the variable stays 0.
 */
const BANNER_HEIGHT = '2.5rem'; // keep in sync with the `h-10` class below

export default function GrandDrawBanner() {
  const [live, setLive] = useState(false);

  // Client-side check of the public standings (a server fetch would require the
  // SEO-managed root layout). The endpoint never exposes absolute counts.
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return;
    let active = true;
    fetch(`${base}/raffle/public/standings`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (active && j?.data?.isLive) setLive(true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (live) root.style.setProperty('--gd-banner-h', BANNER_HEIGHT);
    return () => {
      root.style.removeProperty('--gd-banner-h');
    };
  }, [live]);

  if (!live) return null;

  return (
    <Link
      href="/grand-draw"
      aria-label="View the GRAND DRAW standings"
      className="group fixed left-0 right-0 top-0 z-[60] flex h-10 items-center justify-center gap-2.5 border-b border-gold/25 bg-gradient-to-r from-[#15140f] via-black to-[#15140f] px-4 text-center"
    >
      <Trophy className="h-3.5 w-3.5 flex-shrink-0 text-gold" />
      <span className="font-playfair text-[11px] uppercase tracking-[0.18em] text-cream/90 sm:text-xs">
        The Grand Draw &middot; World Cup 2026
      </span>
      <span className="font-playfair text-[11px] uppercase tracking-[0.15em] text-gold underline-offset-4 group-hover:underline">
        Enter now &rarr;
      </span>
    </Link>
  );
}
