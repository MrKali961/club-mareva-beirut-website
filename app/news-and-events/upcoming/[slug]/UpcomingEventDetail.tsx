"use client";

import { useState } from "react";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { submitEventRegistration } from "../actions";

interface EventData {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  mediaType?: "image" | "video";
  body?: string;
  location?: string;
  maxVisitors?: number;
  confirmedGuests?: number;
  month: string;
  day: string;
  displayDate: string;
  time: string;
}

interface OtherEvent {
  id: string;
  slug?: string;
  title: string;
  category: string;
  image: string;
  mediaType?: "image" | "video";
  month: string;
  day: string;
  displayDate: string;
}

interface UpcomingEventDetailProps {
  event: EventData;
  otherEvents: OtherEvent[];
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function UpcomingEventDetail({
  event,
  otherEvents,
}: UpcomingEventDetailProps) {
  return (
    <main className="min-h-screen bg-black">
      {/* Cinema Hero - Full Viewport */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
        {/* Background Image with Ken Burns */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {event.image ? (
            event.mediaType === "video" ? (
              <video
                src={event.image}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
                quality={85}
              />
            )
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-black via-green-dark/40 to-black" />
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,0.15),transparent_70%)]" />
              </div>
            </>
          )}
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

        {/* Top Bar: Category + Date Badge */}
        <div className="absolute top-28 sm:top-32 left-0 right-0 z-20 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-start justify-between">
            {/* Category Badge - Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
            >
              <span className="inline-flex items-center px-4 py-1.5 backdrop-blur-sm bg-gold/90 text-black text-xs font-playfair font-semibold tracking-widest uppercase">
                {event.category}
              </span>
            </motion.div>

            {/* Date Badge - Top Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="bg-black/60 backdrop-blur-sm border border-gold/30 px-4 sm:px-5 py-3 sm:py-4 flex flex-col items-center"
            >
              <span className="font-playfair text-xs tracking-[0.2em] text-gold uppercase leading-none mb-1">
                {event.month}
              </span>
              <span className="font-playfair text-3xl sm:text-4xl font-bold text-cream leading-none">
                {event.day}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-8 lg:px-12 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="mb-6 sm:mb-8"
            >
              <Link
                href="/news-and-events?filter=Events"
                className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors duration-300 font-playfair text-sm tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Events</span>
              </Link>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream mb-4 sm:mb-6 max-w-4xl leading-[1.1] tracking-tight"
            >
              {event.title}
            </motion.h1>

            {/* Date + Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease }}
              className="flex items-center gap-2 mb-4 sm:mb-6"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              <span className="font-playfair text-gold text-sm sm:text-base tracking-wider">
                {event.displayDate} at {event.time}
              </span>
            </motion.div>

            {/* Description */}
            {/* <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease }}
              className="font-playfair text-cream/80 text-base sm:text-lg max-w-2xl leading-relaxed mb-8 sm:mb-10"
            >
              {event.description}
            </motion.p> */}

            {/* Reserve CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease }}
            >
              <motion.button
                onClick={() =>
                  document
                    .getElementById("reserve-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-gold text-black font-playfair font-semibold text-sm sm:text-base uppercase tracking-[0.15em] overflow-hidden group relative cursor-pointer"
              >
                <span className="relative z-10">Reserve</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {otherEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-1"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-5 h-5 text-cream/40" />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Body Content */}
      {event.body && (
        <section className="relative bg-black py-16 sm:py-20 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          <motion.article
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-[800px] mx-auto px-6 sm:px-8"
          >
            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: event.body }}
            />
          </motion.article>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        </section>
      )}

      {/* Event Registration */}
      <section id="reserve-section" className="relative bg-black py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-lg mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <p className="font-playfair text-xs tracking-[0.3em] uppercase text-gold/80 mb-3">
              Secure Your Seat
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-cream tracking-wider mb-4">
              RESERVE YOUR PLACE
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
            <p className="font-playfair text-cream/60 text-sm leading-relaxed">
              Register below to confirm your attendance. We will reach out with
              further details.
            </p>
          </motion.div>

          <RegistrationForm
            eventId={event.id}
            maxVisitors={event.maxVisitors}
            confirmedGuests={event.confirmedGuests}
          />

          {/* <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="font-playfair text-cream/40 text-xs tracking-wider">
              Prefer WhatsApp?{" "}
              <a
                href="https://wa.me/96179117997"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/70 hover:text-gold transition-colors underline underline-offset-2"
              >
                Reserve directly
              </a>
            </p>
          </motion.div> */}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      {/* More Upcoming Events */}
      {otherEvents.length > 0 && (
        <section className="relative bg-black py-16 sm:py-20 lg:py-28 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Section Header */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-playfair text-xs tracking-[0.3em] uppercase text-gold mb-10 sm:mb-14 text-center"
            >
              More Upcoming Events
            </motion.p>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {otherEvents.map((otherEvent, index) => (
                <OtherEventCard
                  key={otherEvent.id}
                  event={otherEvent}
                  index={index}
                />
              ))}
            </div>

            {/* View All Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-center mt-12 sm:mt-16"
            >
              <Link href="/news-and-events?filter=Events">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 px-8 py-4 border border-gold/50 text-gold font-playfair font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:border-gold hover:bg-gold/10"
                >
                  View All Events
                </motion.span>
              </Link>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        </section>
      )}
      <style jsx global>{`
        .prose-article {
          color: var(--color-cream);
        }

        .prose-article p {
          font-size: 1.25rem;
          line-height: 1.9;
          margin-bottom: 1.5rem;
          color: rgba(245, 245, 240, 0.9);
        }

        .prose-article h2 {
          font-family: var(--font-playfair), serif;
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--color-cream);
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .prose-article h3 {
          font-family: var(--font-playfair), serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--color-cream);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }

        .prose-article blockquote {
          font-family: var(--font-playfair), serif;
          font-size: 1.5rem;
          font-style: italic;
          line-height: 1.6;
          color: var(--color-gold);
          border-left: 4px solid var(--color-gold);
          padding-left: 2rem;
          margin: 3rem 0;
        }

        .prose-article strong {
          color: var(--color-cream);
          font-weight: 600;
        }

        .prose-article a {
          color: var(--color-gold);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .prose-article a:hover {
          color: var(--color-gold-light);
        }

        .prose-article img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1.5rem auto;
          border-radius: 0.5rem;
        }

        /* Inline image alignment */
        .prose-article img[data-align="left"] {
          margin: 1.5rem auto 1.5rem 0;
        }

        .prose-article img[data-align="center"] {
          margin: 1.5rem auto;
        }

        .prose-article img[data-align="right"] {
          margin: 1.5rem 0 1.5rem auto;
        }

        /* Image grid layouts */
        .prose-article [data-image-layout] {
          display: grid;
          gap: 0.5rem;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .prose-article [data-image-layout] img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          margin: 0;
          border-radius: 0;
        }

        .prose-article [data-image-layout="two-equal"] {
          grid-template-columns: 1fr 1fr;
        }

        .prose-article [data-image-layout="three-equal"] {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .prose-article [data-image-layout="left-large"] {
          grid-template-columns: 2fr 1fr;
        }

        .prose-article [data-image-layout="right-large"] {
          grid-template-columns: 1fr 2fr;
        }

        .prose-article [data-image-layout="four-grid"] {
          grid-template-columns: 1fr 1fr;
        }

        .prose-article [data-image-layout="top-hero"] {
          grid-template-columns: 1fr 1fr;
        }

        .prose-article [data-image-layout="top-hero"] img:first-child {
          grid-column: 1 / -1;
        }

        /* Responsive: collapse grids on mobile */
        @media (max-width: 640px) {
          .prose-article [data-image-layout] {
            grid-template-columns: 1fr !important;
          }
          .prose-article [data-image-layout="top-hero"] img:first-child {
            grid-column: 1;
          }
        }

        .prose-article ul,
        .prose-article ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
          color: rgba(245, 245, 240, 0.9);
        }

        .prose-article li {
          margin-bottom: 0.5rem;
          line-height: 1.8;
          font-size: 1.125rem;
        }
      `}</style>
    </main>
  );
}

function RegistrationForm({
  eventId,
  maxVisitors,
  confirmedGuests,
}: {
  eventId: string;
  maxVisitors?: number;
  confirmedGuests?: number;
}) {
  const [state, formAction, isPending] = useActionState(
    submitEventRegistration,
    {
      success: false,
      message: "",
    },
  );

  const isFull =
    typeof maxVisitors === "number" &&
    maxVisitors > 0 &&
    typeof confirmedGuests === "number" &&
    confirmedGuests >= maxVisitors;

  if (isFull && !state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 border border-gold/30 bg-black/60"
      >
        <p className="font-playfair text-xs tracking-[0.3em] uppercase text-gold/80 mb-3">
          Fully Booked
        </p>
        <p className="font-playfair text-cream text-lg mb-2 tracking-wider">
          This event has reached maximum capacity
        </p>
        <p className="font-playfair text-cream/60 text-sm">
          Registrations are now closed. Please explore our other upcoming events below.
        </p>
      </motion.div>
    );
  }

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 border border-gold/30 bg-black/60"
      >
        <div className="w-14 h-14 mx-auto mb-4 border border-gold/30 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <p className="font-playfair text-gold text-lg mb-2 tracking-wider">
          Registration Confirmed
        </p>
        <p className="font-playfair text-cream/70 text-sm">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      <input type="hidden" name="eventId" value={eventId} />

      {state.message && !state.success && (
        <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-playfair">
          {state.message}
        </div>
      )}

      <div>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full bg-transparent border border-gold/30 px-4 py-3 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
        />
        {state.errors?.name && (
          <p className="text-red-400 text-xs mt-1 font-playfair">
            {state.errors.name}
          </p>
        )}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          className="w-full bg-transparent border border-gold/30 px-4 py-3 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
        />
        {state.errors?.email && (
          <p className="text-red-400 text-xs mt-1 font-playfair">
            {state.errors.email}
          </p>
        )}
      </div>

      <div>
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          className="w-full bg-transparent border border-gold/30 px-4 py-3 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
        />
        {state.errors?.phone && (
          <p className="text-red-400 text-xs mt-1 font-playfair">
            {state.errors.phone}
          </p>
        )}
      </div>

      <div>
        <label className="block font-playfair text-cream/60 text-xs tracking-wider uppercase mb-2">
          Number of Guests
        </label>
        <select
          title="Number of Guests"
          name="numberOfGuests"
          defaultValue="1"
          className="w-full bg-black border border-gold/30 px-4 py-3 font-playfair text-cream text-sm focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C8A97E' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 16px center",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <option key={n} value={n} className="bg-black text-cream">
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
        {state.errors?.numberOfGuests && (
          <p className="text-red-400 text-xs mt-1 font-playfair">
            {state.errors.numberOfGuests}
          </p>
        )}
      </div>

      {maxVisitors && (
        <p className="text-cream/40 text-xs font-playfair text-center tracking-wider">
          Limited capacity event
        </p>
      )}

      <motion.button
        type="submit"
        disabled={isPending}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gold text-black py-3.5 font-playfair font-semibold tracking-wider uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {isPending ? "Registering..." : "Register for This Event"}
      </motion.button>
    </motion.form>
  );
}

function OtherEventCard({
  event,
  index,
}: {
  event: OtherEvent;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease }}
    >
      <Link href={`/${event.slug || event.id}`}>
        <div
          className="block relative h-[350px] sm:h-[400px] md:h-[450px] group overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: isHovered ? 1.12 : 1,
                filter: isHovered ? "brightness(1.1)" : "brightness(1)",
              }}
              transition={{ duration: 0.7, ease }}
              className="relative w-full h-full"
            >
              {event.image ? (
                event.mediaType === "video" ? (
                  <video
                    src={event.image}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-black-800 via-green-dark to-black" />
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_60%_40%,rgba(201,162,39,0.2),transparent_60%)]" />
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
            </motion.div>
          </div>

          {/* Date Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.15, duration: 0.5 }}
            className="absolute top-5 left-5 z-20 bg-black/60 backdrop-blur-sm border border-gold/30 px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center"
          >
            <span className="font-playfair text-[10px] sm:text-xs tracking-[0.2em] text-gold uppercase leading-none mb-0.5 sm:mb-1">
              {event.month}
            </span>
            <span className="font-playfair text-2xl sm:text-3xl font-bold text-cream leading-none">
              {event.day}
            </span>
          </motion.div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              className="flex items-center gap-2 mb-2 sm:mb-3"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
              <span className="font-playfair text-gold text-xs sm:text-sm tracking-wider">
                {event.displayDate}
              </span>
            </motion.div>

            <motion.h3
              animate={{ y: isHovered ? -8 : 0 }}
              transition={{ duration: 0.4, ease }}
              className="font-playfair text-2xl sm:text-3xl text-cream leading-tight line-clamp-2 mb-4"
            >
              {event.title}
            </motion.h3>

            {/* "VIEW EVENT" CTA — fades in on hover (desktop), always shown on mobile */}
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 6,
              }}
              transition={{ duration: 0.3, delay: isHovered ? 0.05 : 0 }}
              className="hidden sm:flex items-center gap-2 text-gold font-playfair text-xs sm:text-sm tracking-[0.2em] uppercase"
            >
              <span>View Event</span>
              <motion.span
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.span>
            </motion.div>

            {/* Mobile: always visible */}
            <div className="flex sm:hidden items-center gap-2 text-gold font-playfair text-xs tracking-[0.2em] uppercase opacity-70">
              <span>View Event</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.5, ease }}
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold origin-left"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
