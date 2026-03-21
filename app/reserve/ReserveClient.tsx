"use client";

import { useActionState, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Timer,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Loader2,
  Armchair,
} from "lucide-react";
import Link from "next/link";
import { submitReserveForm } from "./actions";
import type {
  ApiReservationSettings,
  ApiAvailability,
  ApiTableAvailability,
} from "@/lib/api/types";

interface Props {
  settings: ApiReservationSettings | null;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: EASE },
  }),
};

export default function ReserveClient({ settings }: Props) {
  // If settings failed to load or reservations are disabled
  if (!settings) {
    return (
      <DisabledState message="Reservations are currently unavailable. Please contact us directly." />
    );
  }

  if (!settings.isEnabled) {
    return (
      <DisabledState message="Online reservations are not available at this time. Please contact us to book your table." />
    );
  }

  return (
    <main className="relative z-20 w-full overflow-hidden">
      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-6">
        {/* Decorative radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,162,39,0.12)_0%,transparent_60%)]" />

        {/* Corner accents */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute top-24 left-6 w-20 h-20 border-t-2 border-l-2 border-gold/30"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute top-24 right-6 w-20 h-20 border-t-2 border-r-2 border-gold/30"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-playfair text-xs tracking-[0.3em] uppercase text-gold/80 mb-4"
          >
            {settings.sectionSubtitle}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-cream tracking-wider mb-6"
          >
            {settings.sectionTitle}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6 origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="font-playfair text-cream/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto"
          >
            {settings.sectionDescription}
          </motion.p>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="relative z-10 pb-24 md:pb-32 px-6">
        <ReservationForm settings={settings} />
      </section>
    </main>
  );
}

// ─── Reservation Form ────────────────────────────────────────────

function ReservationForm({ settings }: { settings: ApiReservationSettings }) {
  const [state, formAction, isPending] = useActionState(submitReserveForm, {
    success: false,
    message: "",
  });

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [selectedTableCapacity, setSelectedTableCapacity] = useState<number>(0);
  const [guestCount, setGuestCount] = useState(2);
  const [durationMinutes, setDurationMinutes] = useState(
    settings.slotDurationMinutes,
  );
  const [availability, setAvailability] = useState<ApiAvailability | null>(
    null,
  );
  const [tableAvailability, setTableAvailability] =
    useState<ApiTableAvailability | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const timeSectionRef = useRef<HTMLDivElement>(null);
  const durationSectionRef = useRef<HTMLDivElement>(null);
  const tableSectionRef = useRef<HTMLDivElement>(null);
  const guestSectionRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  // Derive closed days from operating hours (days not present = closed)
  const closedDays = settings.operatingHours
    ? [0, 1, 2, 3, 4, 5, 6].filter(
        (d) => !(String(d) in settings.operatingHours!),
      )
    : settings.closedDays;

  // Fetch table availability when time is selected
  const fetchTableAvailability = useCallback(
    async (date: string, time: string, duration: number) => {
      setLoadingTables(true);
      setTableAvailability(null);
      setSelectedTableId("");
      setSelectedTableCapacity(0);
      setGuestCount(2);

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(
          `${apiBase}/reservations/availability/tables?date=${date}&time=${time}&durationMinutes=${duration}`,
        );
        const json = await res.json();

        if (json.success) {
          setTableAvailability(json.data);
        } else {
          setTableAvailability({
            available: false,
            tables: [],
            message: json.error?.message || "Could not load tables.",
          });
        }
      } catch {
        setTableAvailability({
          available: false,
          tables: [],
          message: "Could not load table availability.",
        });
      } finally {
        setLoadingTables(false);
      }
    },
    [],
  );

  const handleTimeSelect = useCallback(
    (time: string) => {
      setSelectedTime(time);
      setDurationMinutes(settings.slotDurationMinutes);
      // Reset downstream selections
      setSelectedTableId("");
      setSelectedTableCapacity(0);
      setTableAvailability(null);
      setGuestCount(2);
    },
    [settings.slotDurationMinutes],
  );

  const handleDurationSelect = useCallback(
    (duration: number) => {
      setDurationMinutes(duration);
      if (selectedDate && selectedTime) {
        fetchTableAvailability(selectedDate, selectedTime, duration);
      }
    },
    [selectedDate, selectedTime, fetchTableAvailability],
  );

  const handleTableSelect = useCallback((tableId: string, capacity: number) => {
    setSelectedTableId(tableId);
    setSelectedTableCapacity(capacity);
    // Reset guest count if it exceeds new table capacity
    setGuestCount((prev) => Math.min(prev, capacity));
  }, []);

  // Fetch availability when date changes
  const fetchAvailabilityForDate = useCallback(async (date: string) => {
    setLoadingAvailability(true);
    setAvailability(null);
    setSelectedTime("");
    setDurationMinutes(settings.slotDurationMinutes);
    setSelectedTableId("");
    setSelectedTableCapacity(0);
    setTableAvailability(null);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(
        `${apiBase}/reservations/availability?date=${date}`,
      );
      const json = await res.json();

      if (json.success) {
        setAvailability(json.data);
      } else {
        setAvailability({
          available: false,
          message: json.error?.message || "Could not load availability.",
        });
      }
    } catch {
      setAvailability({
        available: false,
        message: "Could not load availability. Please try again.",
      });
    } finally {
      setLoadingAvailability(false);
    }
  }, []);

  const handleDateSelect = useCallback(
    (date: string) => {
      setSelectedDate(date);
      fetchAvailabilityForDate(date);
    },
    [fetchAvailabilityForDate],
  );

  // Auto-scroll to next section on mobile after selection
  const scrollToSection = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>) => {
      if (typeof window === "undefined" || window.innerWidth > 768) return;
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    },
    [],
  );

  useEffect(() => {
    if (selectedDate) scrollToSection(timeSectionRef);
  }, [selectedDate, scrollToSection]);

  useEffect(() => {
    if (selectedTime) scrollToSection(durationSectionRef);
  }, [selectedTime, scrollToSection]);

  useEffect(() => {
    if (tableAvailability && !loadingTables)
      scrollToSection(tableSectionRef);
  }, [tableAvailability, loadingTables, scrollToSection]);

  useEffect(() => {
    if (selectedTableId) scrollToSection(guestSectionRef);
  }, [selectedTableId, scrollToSection]);

  // Scroll to top on success
  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.success]);

  // Success state
  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="max-w-lg mx-auto text-center py-16 px-8 border border-gold/30 bg-black-800 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3 pointer-events-none" />
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="w-20 h-20 mx-auto mb-6 border border-gold/40 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-gold" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-playfair text-2xl md:text-3xl text-cream mb-4 tracking-wider"
          >
            Reservation Received
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6 origin-center"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-playfair text-cream/70 text-sm md:text-base mb-8 leading-relaxed"
          >
            {state.message}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 border border-gold/50 text-gold font-playfair text-sm uppercase tracking-[0.15em] hover:border-gold hover:bg-gold/10 transition-all duration-300"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-gold/15" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-gold/15" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
      className="max-w-2xl mx-auto"
    >
      {/* Form card */}
      <div className="relative border border-gold/25 bg-black-800 p-6 md:p-10 shadow-[0_0_60px_rgba(201,162,39,0.08)]">
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] via-transparent to-gold/[0.02] pointer-events-none" />

        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-gold/15" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-gold/15" />

        <div className="relative z-10">
          {/* Top-level error */}
          {state.message && !state.success && !state.errors && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-playfair"
            >
              {state.message}
            </motion.div>
          )}

          <form ref={formRef} action={formAction} className="space-y-8">
            {/* Hidden fields for selected values */}
            <input type="hidden" name="date" value={selectedDate} />
            <input type="hidden" name="time" value={selectedTime} />
            <input type="hidden" name="tableId" value={selectedTableId} />
            <input type="hidden" name="numberOfGuests" value={guestCount} />
            <input
              type="hidden"
              name="durationMinutes"
              value={durationMinutes}
            />

            {/* Step 1: Date Selection */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <SectionLabel icon={Calendar} label="Select Date" />
              <DatePicker
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
                closedDays={closedDays}
                advanceBookingDays={settings.advanceBookingDays}
              />
              {state.errors?.date && <FieldError message={state.errors.date} />}
            </motion.div>

            {/* Step 2: Time Slot Selection */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  ref={timeSectionRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="scroll-mt-24"
                >
                  <SectionLabel icon={Clock} label="Select Time" />
                  <TimeSlotGrid
                    availability={availability}
                    loading={loadingAvailability}
                    selectedTime={selectedTime}
                    selectedDate={selectedDate}
                    onSelect={handleTimeSelect}
                  />
                  {state.errors?.time && (
                    <FieldError message={state.errors.time} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 2.5: Duration Selection */}
            <AnimatePresence>
              {selectedTime && (
                <motion.div
                  ref={durationSectionRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="scroll-mt-24"
                >
                  <SectionLabel icon={Timer} label="Select Duration" />
                  <DurationSelector
                    selectedDuration={durationMinutes}
                    onSelect={handleDurationSelect}
                    minDuration={settings.slotDurationMinutes}
                    maxDuration={settings.maxDurationMinutes}
                    selectedTime={selectedTime}
                    operatingHours={settings.operatingHours}
                    selectedDate={selectedDate}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Table Selection */}
            <AnimatePresence>
              {selectedTime && (
                <motion.div
                  ref={tableSectionRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="scroll-mt-24"
                >
                  <SectionLabel icon={Armchair} label="Select Your Table" />
                  <TableSelector
                    availability={tableAvailability}
                    loading={loadingTables}
                    selectedTableId={selectedTableId}
                    onSelect={handleTableSelect}
                  />
                  {state.errors?.tableId && (
                    <FieldError message={state.errors.tableId} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 4: Guest Count */}
            <AnimatePresence>
              {selectedTableId && (
                <motion.div
                  ref={guestSectionRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="scroll-mt-24"
                >
                  <SectionLabel icon={Users} label="Number of Guests" />
                  <GuestCounter
                    count={guestCount}
                    onChange={setGuestCount}
                    max={selectedTableCapacity || settings.maxGuestsPerBooking}
                  />
                  {state.errors?.numberOfGuests && (
                    <FieldError message={state.errors.numberOfGuests} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 5: Personal Info */}
            <AnimatePresence>
              {selectedTableId && (
                <motion.div
                  ref={detailsSectionRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="space-y-5 scroll-mt-24"
                >
                  {/* Gold divider */}
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

                  <SectionLabel icon={User} label="Your Details" />

                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        required
                        className="w-full bg-transparent border border-gold/30 px-4 py-3.5 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    {state.errors?.name && (
                      <FieldError message={state.errors.name} />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          required
                          className="w-full bg-transparent border border-gold/30 pl-11 pr-4 py-3.5 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      {state.errors?.email && (
                        <FieldError message={state.errors.email} />
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="Phone"
                          className="w-full bg-transparent border border-gold/30 pl-11 pr-4 py-3.5 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gold/40" />
                      <textarea
                        name="specialRequests"
                        placeholder="Special requests (optional)"
                        rows={3}
                        className="w-full bg-transparent border border-gold/30 pl-11 pr-4 py-3.5 font-playfair text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={
                      isPending ||
                      !selectedDate ||
                      !selectedTime ||
                      !selectedTableId
                    }
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="group relative w-full bg-gold text-black py-4 font-playfair font-semibold tracking-[0.15em] uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_20px_rgba(201,162,39,0.2)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(201,162,39,0.35)]"
                  >
                    {/* Shimmer */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    <span className="relative z-10">
                      {isPending ? "Reserving..." : "Reserve Your Table"}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 border border-gold/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gold" />
      </div>
      <span className="font-playfair text-xs tracking-[0.2em] uppercase text-gold/80">
        {label}
      </span>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="text-red-400 text-xs mt-1.5 font-playfair">{message}</p>;
}

// ─── Date Picker ─────────────────────────────────────────────────

function DatePicker({
  selectedDate,
  onSelect,
  closedDays,
  advanceBookingDays,
}: {
  selectedDate: string;
  onSelect: (date: string) => void;
  closedDays: number[];
  advanceBookingDays: number;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + advanceBookingDays);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sunday

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());
  const canGoNext = new Date(viewYear, viewMonth + 1, 1) <= maxDate;

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const isDisabled = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    date.setHours(0, 0, 0, 0);
    if (date < today) return true;
    if (date > maxDate) return true;
    if (closedDays.includes(date.getDay())) return true;
    return false;
  };

  const formatDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  };

  return (
    <div className="border border-gold/20 bg-black/40 p-4 md:p-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          title="View"
          type="button"
          onClick={() => {
            if (viewMonth === 0) {
              setViewMonth(11);
              setViewYear(viewYear - 1);
            } else {
              setViewMonth(viewMonth - 1);
            }
          }}
          disabled={!canGoPrev}
          className="p-2 text-gold/60 hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-playfair text-sm tracking-wider text-cream/90">
          {monthName}
        </span>
        <button
          title="View"
          type="button"
          onClick={() => {
            if (viewMonth === 11) {
              setViewMonth(0);
              setViewYear(viewYear + 1);
            } else {
              setViewMonth(viewMonth + 1);
            }
          }}
          disabled={!canGoNext}
          className="p-2 text-gold/60 hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center font-playfair text-[10px] tracking-wider text-cream/40 uppercase py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }

          const dateStr = formatDate(day);
          const disabled = isDisabled(day);
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === formatTodayStr(today);

          return (
            <button
              key={dateStr}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className={`
                relative py-2.5 text-center font-playfair text-sm transition-all duration-200
                ${
                  disabled
                    ? "text-cream/15 cursor-not-allowed"
                    : isSelected
                      ? "bg-gold text-black font-semibold shadow-[0_0_12px_rgba(201,162,39,0.3)]"
                      : "text-cream/80 hover:bg-gold/15 hover:text-gold"
                }
                ${isToday && !isSelected ? "ring-1 ring-gold/40" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatTodayStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ─── Time Slot Grid ──────────────────────────────────────────────

function TimeSlotGrid({
  availability,
  loading,
  selectedTime,
  selectedDate,
  onSelect,
}: {
  availability: ApiAvailability | null;
  loading: boolean;
  selectedTime: string;
  selectedDate: string;
  onSelect: (time: string) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 border border-gold/15 bg-black/30">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
        <span className="ml-3 font-playfair text-sm text-cream/50">
          Checking availability...
        </span>
      </div>
    );
  }

  if (availability && !availability.available) {
    return (
      <div className="py-8 text-center border border-gold/15 bg-black/30">
        <p className="font-playfair text-cream/50 text-sm">
          {availability.message || "No availability for this date."}
        </p>
      </div>
    );
  }

  if (!availability) {
    return null;
  }

  const slots = availability.timeSlots || [];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {slots.map((info, index) => {
        const slot = info.time;
        const isAvailable = info.available;
        const isSelected = selectedTime === slot;

        return (
          <motion.button
            key={slot}
            type="button"
            disabled={!isAvailable || isTimeSlotPast(selectedDate, slot)}
            onClick={() => onSelect(slot)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            whileHover={isAvailable ? { scale: 1.05 } : undefined}
            whileTap={isAvailable ? { scale: 0.95 } : undefined}
            className={`
              relative py-3 px-2 font-playfair text-sm tracking-wider text-center transition-all duration-200 border
              ${
                !isAvailable
                  ? "border-cream/10 text-cream/20 cursor-not-allowed bg-black/20"
                  : isSelected
                    ? "border-gold bg-gold text-black font-semibold shadow-[0_0_15px_rgba(201,162,39,0.25)]"
                    : "border-gold/30 text-cream/80 hover:border-gold hover:text-gold hover:bg-gold/5"
              }
            `}
          >
            {formatTimeDisplay(slot)}
          </motion.button>
        );
      })}
    </div>
  );
}

function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')}${period}`;
}

function isTimeSlotPast(selectedDate: string, time: string): boolean {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  if (selectedDate !== todayStr) return false;
  const [h, m] = time.split(':').map(Number);
  const slotMinutes = h * 60 + m;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return slotMinutes <= nowMinutes;
}

// ─── Duration Selector ──────────────────────────────────────────

function DurationSelector({
  selectedDuration,
  onSelect,
  minDuration,
  maxDuration,
  selectedTime,
  operatingHours,
  selectedDate,
}: {
  selectedDuration: number;
  onSelect: (duration: number) => void;
  minDuration: number;
  maxDuration: number;
  selectedTime: string;
  operatingHours: Record<string, { open: string; close: string }> | null;
  selectedDate: string;
}) {
  // Calculate max available duration based on closing time
  let maxAvailable = maxDuration;

  if (operatingHours && selectedDate) {
    const date = new Date(selectedDate + "T00:00:00");
    const dayOfWeek = date.getDay();
    const dayKey = String(dayOfWeek);
    const dayHours = operatingHours[dayKey];

    if (dayHours) {
      const [closeH, closeM] = dayHours.close.split(":").map(Number);
      const closeMinutes = closeH * 60 + closeM;
      const [startH, startM] = selectedTime.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const timeUntilClose = closeMinutes - startMinutes;

      if (timeUntilClose > 0) {
        maxAvailable = Math.min(maxDuration, timeUntilClose);
      }
    }
  }

  // Generate duration options in 30-minute increments
  const options: number[] = [];
  for (let d = minDuration; d <= maxAvailable; d += 30) {
    options.push(d);
  }

  // Auto-select when only one duration option available
  const singleOption = options.length <= 1;
  useEffect(() => {
    if (singleOption) {
      onSelect(minDuration);
    }
  }, [singleOption, minDuration, onSelect]);

  if (singleOption) {
    return (
      <div className="py-4 text-center border border-gold/15 bg-black/30">
        <p className="font-playfair text-cream/60 text-sm">
          {formatDurationDisplay(minDuration)} reservation
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {options.map((duration, index) => {
        const isSelected = selectedDuration === duration;

        return (
          <motion.button
            key={duration}
            type="button"
            onClick={() => onSelect(duration)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative py-3 px-2 font-playfair text-sm tracking-wider text-center transition-all duration-200 border
              ${
                isSelected
                  ? "border-gold bg-gold text-black font-semibold shadow-[0_0_15px_rgba(201,162,39,0.25)]"
                  : "border-gold/30 text-cream/80 hover:border-gold hover:text-gold hover:bg-gold/5"
              }
            `}
          >
            {formatDurationDisplay(duration)}
          </motion.button>
        );
      })}
    </div>
  );
}

function formatDurationDisplay(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}M`;
  if (mins === 0) return `${hours}H`;
  return `${hours}H ${mins}M`;
}

// ─── Table Selector ─────────────────────────────────────────────

function TableSelector({
  availability,
  loading,
  selectedTableId,
  onSelect,
}: {
  availability: ApiTableAvailability | null;
  loading: boolean;
  selectedTableId: string;
  onSelect: (tableId: string, capacity: number) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 border border-gold/15 bg-black/30">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
        <span className="ml-3 font-playfair text-sm text-cream/50">
          Loading tables...
        </span>
      </div>
    );
  }

  if (availability && !availability.available) {
    return (
      <div className="py-8 text-center border border-gold/15 bg-black/30">
        <p className="font-playfair text-cream/50 text-sm">
          {availability.message || "No tables available for this time."}
        </p>
      </div>
    );
  }

  if (!availability) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {availability.tables.map((table, index) => {
        const isSelected = selectedTableId === table.id;
        const isAvailable = table.available;

        return (
          <motion.button
            key={table.id}
            type="button"
            disabled={!isAvailable}
            onClick={() => onSelect(table.id, table.capacity)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={isAvailable ? { scale: 1.02 } : undefined}
            whileTap={isAvailable ? { scale: 0.98 } : undefined}
            className={`
              relative p-4 text-left transition-all duration-200 border
              ${
                !isAvailable
                  ? "border-cream/10 bg-black/20 cursor-not-allowed"
                  : isSelected
                    ? "border-gold bg-gold/10 shadow-[0_0_20px_rgba(201,162,39,0.15)]"
                    : "border-gold/25 hover:border-gold/60 hover:bg-gold/5"
              }
            `}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className={`font-playfair text-sm tracking-wider ${
                    !isAvailable
                      ? "text-cream/20"
                      : isSelected
                        ? "text-gold font-semibold"
                        : "text-cream/90"
                  }`}
                >
                  {table.name}
                </p>
                {table.label && (
                  <p
                    className={`font-playfair text-xs mt-0.5 ${
                      !isAvailable ? "text-cream/10" : "text-gold/60"
                    }`}
                  >
                    {table.label}
                  </p>
                )}
              </div>
              <div
                className={`flex items-center gap-1 ${
                  !isAvailable
                    ? "text-cream/15"
                    : isSelected
                      ? "text-gold"
                      : "text-cream/50"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="font-playfair text-xs">{table.capacity}</span>
              </div>
            </div>

            {!isAvailable && (
              <p className="font-playfair text-[10px] text-cream/20 mt-2 uppercase tracking-wider">
                Reserved
              </p>
            )}

            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2"
              >
                <Check className="w-4 h-4 text-gold" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Guest Counter ───────────────────────────────────────────────

function GuestCounter({
  count,
  onChange,
  max,
}: {
  count: number;
  onChange: (n: number) => void;
  max: number;
}) {
  return (
    <div className="flex items-center justify-center gap-6">
      <motion.button
        type="button"
        onClick={() => onChange(Math.max(1, count - 1))}
        disabled={count <= 1}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 border border-gold/30 flex items-center justify-center text-gold disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:bg-gold/10 transition-all duration-200"
      >
        <Minus className="w-5 h-5" />
      </motion.button>

      <div className="text-center min-w-[80px]">
        <span className="font-playfair text-4xl text-cream font-light">
          {count}
        </span>
        <p className="font-playfair text-xs text-cream/40 uppercase tracking-wider mt-1">
          {count === 1 ? "Guest" : "Guests"}
        </p>
      </div>

      <motion.button
        type="button"
        onClick={() => onChange(Math.min(max, count + 1))}
        disabled={count >= max}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 border border-gold/30 flex items-center justify-center text-gold disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:bg-gold/10 transition-all duration-200"
      >
        <Plus className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// ─── Disabled State ──────────────────────────────────────────────

function DisabledState({ message }: { message: string }) {
  return (
    <main className="relative z-20 min-h-screen flex items-center justify-center px-6 pt-24">
      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative text-center max-w-md"
      >
        <div className="w-16 h-16 mx-auto mb-6 border border-gold/30 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-gold/60" />
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl text-cream mb-4 tracking-wider">
          Reservations
        </h1>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />

        <p className="font-playfair text-cream/60 text-sm md:text-base mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-gold text-black font-playfair text-sm font-semibold tracking-[0.15em] uppercase hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] transition-shadow duration-300"
          >
            Contact Us
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 border border-gold/50 text-gold font-playfair text-sm uppercase tracking-[0.15em] hover:border-gold hover:bg-gold/10 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
