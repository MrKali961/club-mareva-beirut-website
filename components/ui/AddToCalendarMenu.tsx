"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown } from "lucide-react";

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
  icon: string;
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close on outside click + escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
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

  const start = new Date(startIso);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const safeLocation = (location || "Club Mareva Beirut").trim();
  const safeDescription = description ? stripHtml(description).slice(0, 1000) : title;

  const startCompact = toCompactUtc(start);
  const endCompact = toCompactUtc(end);
  const startIsoOut = toIsoUtc(start);
  const endIsoOut = toIsoUtc(end);
  const enc = encodeURIComponent;

  // The .ics URL lives on the API. The website's public-side env points at the API.
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
    { href: google, label: "Google Calendar", icon: "/images/calendar/google.png" },
    { href: icsUrl, label: "Apple Calendar", icon: "/images/calendar/apple.png" },
    { href: outlookOffice, label: "Outlook", icon: "/images/calendar/outlook.png" },
    { href: outlookLive, label: "Outlook.com", icon: "/images/calendar/outlook-com.png" },
    { href: yahoo, label: "Yahoo Calendar", icon: "/images/calendar/yahoo.png" },
  ];

  const triggerBase =
    "inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 font-playfair font-semibold text-sm sm:text-base uppercase tracking-[0.15em] cursor-pointer transition-colors";
  const triggerStyle =
    variant === "solid"
      ? "bg-gold text-black hover:bg-gold-light"
      : "border border-gold/40 text-gold hover:border-gold hover:bg-gold/5";

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className={`${triggerBase} ${triggerStyle}`}
      >
        <Calendar className="w-4 h-4 sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
        <span>Add to Calendar</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
          aria-hidden="true"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-3 z-30 w-[280px] sm:w-[300px] rounded-sm bg-black/95 backdrop-blur-md border border-gold/25 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="px-4 pt-4 pb-2">
              <p className="font-playfair text-[10px] tracking-[0.25em] uppercase text-gold/70">
                Save the date
              </p>
              <p className="font-playfair text-xs text-cream/60 mt-1">
                Choose your preferred calendar
              </p>
            </div>
            <ul className="py-1">
              {providers.map((p) => (
                <li key={p.label}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    role="menuitem"
                    className="group flex items-center gap-3 px-4 py-3 text-cream hover:bg-gold/10 transition-colors"
                  >
                    <img
                      src={p.icon}
                      alt=""
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-sm flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                    />
                    <span className="font-playfair text-sm tracking-wide flex-1">
                      {p.label}
                    </span>
                    <span className="font-playfair text-[10px] uppercase tracking-[0.15em] text-gold/0 group-hover:text-gold/80 transition-colors">
                      Add
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
