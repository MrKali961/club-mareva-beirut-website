"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

/** Resolve a possibly-relative media path to an absolute, shareable URL. */
function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (typeof window === "undefined") return url;
  return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

interface ShareMediaButtonProps {
  /** Media URL to share (image or video). May be relative or absolute. */
  url: string;
  /** Title passed to the native share sheet. */
  title?: string;
  /** Button classes — lets each placement style its own affordance. */
  className?: string;
  /** Accessible label / tooltip. */
  ariaLabel?: string;
  /** Optional visible text rendered next to the icon. */
  label?: string;
  /** Lucide icon size in px. */
  iconSize?: number;
}

/**
 * Shares a single media item. Prefers the native Web Share API (the OS share
 * sheet on mobile — WhatsApp, Instagram, Messages, etc.), and falls back to
 * copying the link to the clipboard with brief visual confirmation.
 * Non-interactive parents (e.g. the lightbox backdrop) are protected via
 * stopPropagation so sharing never triggers their click handlers.
 */
export default function ShareMediaButton({
  url,
  title,
  className = "",
  ariaLabel = "Share this media",
  label,
  iconSize = 20,
}: ShareMediaButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = toAbsoluteUrl(url);
    const shareData = title ? { title, url: shareUrl } : { url: shareUrl };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User dismissed the share sheet — nothing more to do.
        if (err instanceof Error && err.name === "AbortError") return;
        // Any other failure falls through to the clipboard path below.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context) — open the media directly.
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={ariaLabel}
      title={copied ? "Link copied" : ariaLabel}
      className={className}
    >
      {copied ? <Check size={iconSize} /> : <Share2 size={iconSize} />}
      {label && <span>{copied ? "Link copied" : label}</span>}
    </button>
  );
}
