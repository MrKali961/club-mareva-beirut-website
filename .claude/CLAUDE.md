# Club Mareva Beirut - Website Project Handoff

## Project Overview

Club Mareva Beirut is a premium cigar lounge website built with **Next.js 16.1.6**, **React 19**, and **Tailwind CSS 4**. The site has been migrated from static JSON files to a dual-mode data layer that can fetch from a **Fastify + PostgreSQL + Prisma + ImageKit backend API** or fall back to local filesystem JSON.

**Repository:** https://github.com/Scotopia1/club-mareva-beirut.git
**Branch:** `main`

---

## Architecture

### Tech Stack
- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **React:** 19.2.3 (uses `useActionState` for forms, NOT deprecated `useFormState`)
- **Styling:** Tailwind CSS 4 (PostCSS plugin, NOT `@tailwindcss/vite`)
- **Animations:** GSAP + Framer Motion + Lenis smooth scroll
- **Carousel:** Embla Carousel
- **Icons:** Lucide React
- **Deployment:** Vercel

### Design System
- **Color palette:** Black (`#000`), cream/warm whites, gold (`#C8A97E` / `#D4AF37`), forest green (`#27533e`)
- **Typography:** Cinzel (headings), Cormorant Garamond (body), Inter (UI)
- **Aesthetic:** Luxury, dark, editorial — think high-end cigar lounge
- **NO generic UI kits** — all components are custom-built to match the brand

### Data Flow Architecture

```
Pages (app/) ──> lib/content.ts (USE_API gate)
                       │
               USE_API === 'true'?
                 /            \
          lib/api/*.ts     data/*.json
          (HTTP fetch)     (filesystem)
                │
          lib/adapters/*.ts
          (shape transform)
```

### Key Env Variables
```
API_BASE_URL=https://api.clubmarevabeirut.com/api/v1    # Server-side
NEXT_PUBLIC_API_BASE_URL=https://api.clubmarevabeirut.com/api/v1  # Client-side
USE_API=false   # Set to 'true' when backend is live
```

---

## File Structure (Key Directories)

```
website/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage (ISR 5m)
│   ├── cigars/
│   │   ├── page.tsx              # Server component - fetches brands (ISR 1h)
│   │   └── CigarsClient.tsx      # Client component - UI/animations
│   ├── news-and-events/
│   │   ├── page.tsx              # News listing (ISR 5m)
│   │   ├── [slug]/page.tsx       # Post detail (ISR 5m)
│   │   └── upcoming/
│   │       ├── [slug]/page.tsx   # Event detail (ISR 5m)
│   │       ├── [slug]/UpcomingEventDetail.tsx
│   │       └── actions.ts        # Event registration Server Action
│   ├── contact/
│   │   ├── page.tsx              # Contact page with form
│   │   └── actions.ts            # Contact form Server Action
│   ├── our-signature/page.tsx    # Static - reads from filesystem only
│   └── sitemap.ts                # Dynamic sitemap (ISR 5m)
├── components/
│   ├── layout/                   # Navigation, Footer
│   ├── sections/                 # Hero, Story, BrandShowcase, UpcomingEvents
│   └── ui/                       # Emblem, ScrollIndicator, etc.
├── lib/
│   ├── content.ts                # CENTRAL DATA LAYER (dual-mode)
│   ├── api/
│   │   ├── client.ts             # apiGet/apiPost with envelope unwrapping
│   │   ├── types.ts              # API response interfaces
│   │   ├── news.ts               # GET /news, GET /news/{slug}
│   │   ├── events.ts             # GET /events, GET /events/{slug}, POST /events/{id}/register
│   │   ├── brands.ts             # GET /cigar-brands
│   │   └── contact.ts            # POST /contact-submissions
│   └── adapters/
│       ├── news-adapter.ts       # ApiNewsArticle → Post
│       ├── events-adapter.ts     # ApiEvent → UpcomingEvent
│       └── brands-adapter.ts     # ApiCigarBrand → Brand (with BRAND_ENRICHMENT map)
├── data/                         # Filesystem JSON (fallback data)
│   ├── posts/*.json              # 49 blog posts
│   ├── upcoming-events.json      # 4 events
│   ├── signatures.json           # Signature cigars (no API endpoint)
│   └── metadata/                 # categories, authors, image manifest
└── public/images/                # All static images
    ├── clubmarevabeirut/         # Post/event images by year
    ├── external/                 # Brand logos (10 partners)
    └── *.svg                     # Site logos
```

---

## API Integration Details

### Envelope Format
All API responses use: `{ success: boolean, data: T }` with pagination: `{ items: T[], pagination: {...} }`

### API Endpoints Used
| Endpoint | Method | Used By | ISR |
|---|---|---|---|
| `/news` | GET | Homepage, News listing, Sitemap | 5m |
| `/news/{slug}` | GET | Post detail page | 5m |
| `/news?limit=N` | GET | Latest N posts | 5m |
| `/events?upcoming=true` | GET | Homepage, Events listing, Sitemap | 5m |
| `/events/{slug}` | GET | Event detail page | 5m |
| `/cigar-brands` | GET | Homepage BrandShowcase, Cigars page | 1h |
| `/contact-submissions` | POST | Contact form (Server Action) | — |
| `/events/{id}/register` | POST | Event registration (Server Action) | — |

### Adapter Pattern
API responses have different shapes than the UI expects. Adapters in `lib/adapters/` transform them:
- `apiNewsToPost()` — strips HTML, maps fields, handles missing images
- `apiEventToUpcomingEvent()` — maps date/image/location fields
- `apiBrandToLocalBrand()` — enriches API brand with static `BRAND_ENRICHMENT` map (origin, established, hashtags, testimonials, website)
- `apiBrandToShowcaseBrand()` — simpler mapping for homepage logo grid

### Brand Enrichment
The API only stores title/description/logo for cigar brands. The full brand data (origin country, year established, hashtags, testimonials, website URL) is in a static `BRAND_ENRICHMENT` map in `lib/adapters/brands-adapter.ts`. This was a deliberate decision because this metadata rarely changes.

The cigars page also has a `FALLBACK_BRANDS` array (10 brands hardcoded) in `app/cigars/page.tsx` that serves as fallback when the API is unavailable.

### Image Path Resolution
The `resolveImagePath()` helper (defined in each page that needs it) handles:
- Absolute URLs (ImageKit `https://ik.imagekit.io/...`) → returned as-is
- Paths starting with `/` → returned as-is
- Bare relative paths (`images/clubmarevabeirut/...`) → prepended with `/`

This is critical because the API returns ImageKit URLs while filesystem mode uses local paths.

---

## What's NOT API-Connected

| Page/Feature | Reason |
|---|---|
| `/our-signature` | No backend endpoint exists for signatures. Reads from `data/signatures.json` always. |
| `getAllPages()` | Utility function, not called by any live page |
| `getCategories()` / `getAuthors()` | Metadata functions, not called by any live page |
| Philosophy pillars on Cigars page | Hardcoded static content in `CigarsClient.tsx` |
| Contact info (address, phone, hours) | Hardcoded in `contact/page.tsx` |

---

## Coding Conventions

### Style Rules
- **No emojis** in code or comments unless user explicitly requests
- **Minimal comments** — only where logic isn't self-evident
- **No over-engineering** — no premature abstractions, no feature flags for hypothetical features
- **Server components by default** — only use `'use client'` when React hooks or interactivity is needed
- **ISR over SSR** — use `export const revalidate = N` for data freshness without rebuild

### Patterns Used
- **Server Actions** for form submissions (avoids CORS, no API routes needed)
- **`useActionState`** from React 19 (NOT `useFormState` which is deprecated)
- **Try/catch with fallback** — every API call is wrapped, filesystem is always available as backup
- **`resolveImagePath()`** in every page that renders dynamic images
- **Barrel exports** (`index.ts`) in `lib/api/` and `lib/adapters/`

### Component Patterns
- Pages that need both server data and client interactivity are split: `page.tsx` (server) + `*Client.tsx` (client)
- Example: `cigars/page.tsx` fetches data → passes to `CigarsClient.tsx` which handles animations

### Git Commit Style
Follow the existing pattern:
```
<Verb> <what changed> [with context]

Multi-line description of why/what.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```
Examples from history:
- `Connect website to backend API with dual-mode data layer`
- `Update brand logos with cleaner versions and fix all references`
- `Add Our Signature vault page, upcoming events, and Odyssey enrichment`

---

## Known Issues / Edge Cases

1. **5 images with empty `local_path`** in posts `005-delamain-sig-cigar-xo-at-club-mareva-beirut.json` and `049-we-hired-a-new-chef.json`. These fall back to WordPress CDN URLs (`clubmarevabeirut.com/wp-content/...`). The domain is whitelisted in `next.config.ts`.

2. **USE_API flag is string-sensitive** — must be exactly `'true'` (not `True`, `TRUE`, `1`, `yes`). Set in `.env.local` for dev, Vercel dashboard for production.

3. **Next.js port conflict** — Next.js dev server runs on `:3000`. If the backend also runs on `:3000`, change one of them. The `.env.example` defaults to `localhost:3000` but `.env.local` already points to the production API domain.

4. **Turbopack root warning** — harmless warning about multiple lockfiles. Can silence by setting `turbopack.root` in `next.config.ts` or removing the parent `package-lock.json`.

---

## Vercel Deployment

### Dashboard Env Vars Required
| Variable | Value |
|---|---|
| `API_BASE_URL` | `https://api.clubmarevabeirut.com/api/v1` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.clubmarevabeirut.com/api/v1` |
| `USE_API` | `true` (once backend is live) |

### Remote Image Domains Configured
- `ik.imagekit.io` — ImageKit CDN (API-served images)
- `clubmarevabeirut.com` — WordPress fallback images

### Static Asset Caching
`vercel.json` sets 1-year immutable cache for `/images/*`.

---

## Quick Start for New Session

```bash
cd website
npm install
npm run dev        # Starts on localhost:3000
```

To test with API: set `USE_API=true` in `.env.local` (requires backend running).
To test filesystem only: set `USE_API=false` in `.env.local` (default).

Build check: `npx tsc --noEmit && npm run build`
