"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronRight, X } from "lucide-react";

interface AddToCalendarMenuProps {
  /** Event title shown in the calendar entry. */
  title: string;
  /** ISO 8601 start datetime (UTC). */
  startIso: string;
  /** Event duration in minutes. Defaults to 120. */
  durationMinutes?: number;
  /** Plain-text location. Falls back to "Club Mareva Beirut". */
  location?: string | null;
  /** Plain-text description. HTML is stripped before assembly. */
  description?: string | null;
  /** Event slug — used to build the public .ics endpoint URL. */
  slug: string;
  /** Optional visual variant. `solid` matches the primary CTA; `outline` is a secondary action. */
  variant?: "solid" | "outline";
  /** Optional className extension for the trigger button. */
  className?: string;
}

interface ProviderEntry {
  href: string;
  label: string;
  hint: string;
  icon: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** YYYYMMDDTHHMMSSZ — matches what Google/Yahoo deeplinks expect. */
function toCompactUtc(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function toIsoUtc(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

/** Track viewport so the popover (desktop) and bottom sheet (mobile)
 *  swap render strategies cleanly across breakpoints. */
function useIsMobile(breakpointPx = 640): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [breakpointPx]);
  return isMobile;
}

/** Lock body scroll while the mobile sheet is open. */
function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarW =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) {
      // Avoid layout shift from the disappearing scrollbar on desktop.
      document.body.style.paddingRight = `${scrollbarW}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [active]);
}

interface AnchorRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
}

/** Track the trigger's bounding box so the desktop popover can position
 *  itself in a fixed-position portal — never clipped by ancestor overflow. */
function useAnchorRect(ref: React.RefObject<HTMLElement | null>, active: boolean): AnchorRect | null {
  const [rect, setRect] = useState<AnchorRect | null>(null);
  useLayoutEffect(() => {
    if (!active || !ref.current) {
      setRect(null);
      return;
    }
    const el = ref.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top,
        right: r.right,
        bottom: r.bottom,
        left: r.left,
        width: r.width,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [ref, active]);
  return rect;
}

export default function AddToCalendarMenu({
  title,
  startIso,
  durationMinutes = 120,
  location,
  description,
  slug,
  variant = "outline",
  className = "",
}: AddToCalendarMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const isMobile = useIsMobile();
  const anchorRect = useAnchorRect(triggerRef, open && !isMobile);

  useEffect(() => setMounted(true), []);
  useBodyScrollLock(open && isMobile);

  // Close on outside click + escape. Trigger is excluded so its click
  // handler can toggle without race.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // ── URL building ─────────────────────────────────────────────────────────
  const start = new Date(startIso);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const safeLocation = (location || "Club Mareva Beirut").trim();
  const safeDescription = description ? stripHtml(description).slice(0, 1000) : title;

  const startCompact = toCompactUtc(start);
  const endCompact = toCompactUtc(end);
  const startIsoOut = toIsoUtc(start);
  const endIsoOut = toIsoUtc(end);
  const enc = encodeURIComponent;

  const apiBase = (
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.clubmarevabeirut.com/api/v1"
  ).replace(/\/$/, "");
  const icsUrl = `${apiBase}/events/${slug}/calendar.ics`;

  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${enc(title)}` +
    `&dates=${startCompact}/${endCompact}` +
    `&details=${enc(safeDescription)}` +
    `&location=${enc(safeLocation)}`;

  const yahoo =
    "https://calendar.yahoo.com/?v=60" +
    `&title=${enc(title)}` +
    `&st=${startCompact}` +
    `&et=${endCompact}` +
    `&desc=${enc(safeDescription)}` +
    `&in_loc=${enc(safeLocation)}`;

  const outlookQuery =
    "?path=/calendar/action/compose&rru=addevent" +
    `&subject=${enc(title)}` +
    `&startdt=${enc(startIsoOut)}` +
    `&enddt=${enc(endIsoOut)}` +
    `&body=${enc(safeDescription)}` +
    `&location=${enc(safeLocation)}`;
  const outlookLive = `https://outlook.live.com/calendar/0/deeplink/compose${outlookQuery}`;
  const outlookOffice = `https://outlook.office.com/calendar/0/deeplink/compose${outlookQuery}`;

  const providers: ProviderEntry[] = [
    {
      href: google,
      label: "Google Calendar",
      hint: "Opens in browser",
      icon: "/images/calendar/google.png",
    },
    {
      href: icsUrl,
      label: "Apple Calendar",
      hint: "Downloads .ics file",
      icon: "/images/calendar/apple.png",
    },
    {
      href: outlookOffice,
      label: "Outlook",
      hint: "Microsoft 365",
      icon: "/images/calendar/outlook.png",
    },
    {
      href: outlookLive,
      label: "Outlook.com",
      hint: "Personal Outlook",
      icon: "/images/calendar/outlook-com.png",
    },
    {
      href: yahoo,
      label: "Yahoo Calendar",
      hint: "Opens in browser",
      icon: "/images/calendar/yahoo.png",
    },
  ];

  // ── Trigger ──────────────────────────────────────────────────────────────
  const triggerBase =
    "inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 font-playfair font-semibold text-sm sm:text-base uppercase tracking-[0.15em] cursor-pointer transition-colors select-none";
  const triggerStyle =
    variant === "solid"
      ? "bg-gold text-black hover:bg-gold-light"
      : "border border-gold/40 text-gold hover:border-gold hover:bg-gold/5";

  // ── Menu rows (shared) ───────────────────────────────────────────────────
  const renderRows = (size: "mobile" | "desktop") => (
    <ul className={size === "mobile" ? "py-1" : "py-2"} role="menu">
      {providers.map((p) => (
        <li key={p.label}>
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            role="menuitem"
            className={
              size === "mobile"
                ? "group flex items-center gap-4 px-5 py-4 text-cream active:bg-gold/15 transition-colors"
                : "group flex items-center gap-4 px-5 py-3.5 text-cream hover:bg-gold/10 transition-colors"
            }
          >
            <span
              className={
                size === "mobile"
                  ? "flex-shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-black/40 shadow-[0_2px_8px_rgba(0,0,0,0.4)] ring-1 ring-white/5"
                  : "flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-black/40 shadow-[0_1px_4px_rgba(0,0,0,0.3)] ring-1 ring-white/5"
              }
            >
              <img
                src={p.icon}
                alt=""
                width={size === "mobile" ? 44 : 36}
                height={size === "mobile" ? 44 : 36}
                className="w-full h-full object-cover"
              />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-playfair text-[15px] sm:text-sm tracking-wide text-cream">
                {p.label}
              </span>
              <span className="block font-playfair text-[11px] text-cream/45 mt-0.5 truncate">
                {p.hint}
              </span>
            </span>
            <ChevronRight
              className={
                size === "mobile"
                  ? "w-4 h-4 text-gold/50 flex-shrink-0"
                  : "w-3.5 h-3.5 text-gold/0 group-hover:text-gold/70 transition-colors flex-shrink-0"
              }
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  );

  // ── Desktop popover (fixed-positioned via portal, anchored to trigger) ──
  const desktopPopover = anchorRect && (
    <motion.div
      ref={menuRef}
      id={menuId}
      role="menu"
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: EASE }}
      style={{
        position: "fixed",
        top: anchorRect.bottom + 12,
        // Right-align the popover with the trigger; clamp to the viewport.
        right: Math.max(16, window.innerWidth - anchorRect.right),
        width: 360,
        maxWidth: "calc(100vw - 32px)",
        transformOrigin: "top right",
        zIndex: 60,
      }}
      className="rounded-md bg-[#0a0a0a]/97 backdrop-blur-xl border border-gold/25 shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden"
    >
      <div className="px-5 pt-5 pb-3 border-b border-gold/10">
        <p className="font-playfair text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-1">
          Save the Date
        </p>
        <p className="font-playfair text-[13px] text-cream/65 leading-snug">
          Add this event to your preferred calendar
        </p>
      </div>
      {renderRows("desktop")}
    </motion.div>
  );

  // ── Mobile bottom sheet (fixed bottom, backdrop, larger touch targets) ──
  const mobileSheet = (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        style={{ zIndex: 55 }}
        aria-hidden="true"
      />
      <motion.div
        ref={menuRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Add to Calendar"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.28, ease: EASE }}
        style={{ zIndex: 60 }}
        className="fixed inset-x-0 bottom-0 rounded-t-2xl bg-[#0a0a0a] border-t border-x border-gold/25 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] overflow-hidden pb-[env(safe-area-inset-bottom)]"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <span className="w-10 h-1 rounded-full bg-cream/15" aria-hidden="true" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-3 pb-4 border-b border-gold/10">
          <div className="flex-1 min-w-0 pr-3">
            <p className="font-playfair text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-1">
              Save the Date
            </p>
            <p className="font-playfair text-[15px] text-cream leading-snug">
              Add to Calendar
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="flex-shrink-0 w-10 h-10 -mt-1 -mr-1 flex items-center justify-center rounded-full text-cream/60 hover:text-cream active:bg-cream/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content (long lists stay in-view on short phones) */}
        <div className="max-h-[60vh] overflow-y-auto">
          {renderRows("mobile")}
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <div className={`relative inline-block ${className}`}>
        <motion.button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={menuId}
          className={`${triggerBase} ${triggerStyle}`}
        >
          <Calendar className="w-4 h-4 sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
          <span>Add to Calendar</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="inline-flex"
            aria-hidden="true"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </motion.button>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (isMobile ? mobileSheet : desktopPopover)}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
