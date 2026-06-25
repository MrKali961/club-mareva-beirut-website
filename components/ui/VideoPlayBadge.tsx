interface VideoPlayBadgeProps {
  /** Visual size of the badge. Use "sm" for small thumbnails. */
  size?: "sm" | "md";
}

/**
 * Always-visible play indicator overlaid on video thumbnails so users can tell
 * a piece of media is a playable video rather than a still image.
 * Rendered as a centered, non-interactive overlay — clicks pass through to the
 * underlying link/button. Scales up subtly when inside a `group` on hover.
 */
export default function VideoPlayBadge({ size = "md" }: VideoPlayBadgeProps) {
  const circle =
    size === "sm" ? "w-10 h-10" : "w-14 h-14 sm:w-16 sm:h-16";
  const icon = size === "sm" ? "w-4 h-4" : "w-6 h-6 sm:w-7 sm:h-7";

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
      <div
        className={`${circle} rounded-full bg-black/50 backdrop-blur-sm border border-gold/70 flex items-center justify-center shadow-lg transition-transform duration-400 group-hover:scale-110`}
      >
        <svg
          className={`${icon} text-gold translate-x-[1px]`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}
