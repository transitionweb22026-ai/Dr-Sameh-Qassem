# Dr. Sameh Qassem — Medical Website

Production Next.js (App Router) site for a neurosurgery & spine surgery practice, built with TypeScript, Tailwind CSS v4, Framer Motion, next-intl (Arabic/English, RTL/LTR), and Supabase.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript**, strict mode
- **Tailwind CSS v4** — design tokens (colors, fonts, shadows) live in `src/app/globals.css` under `@theme`
- **next-intl** — locale routing at `/ar` and `/en`, translations in `src/locales/{ar,en}.json`
- **Framer Motion** — scroll-reveal, staggered grids, animated counters
- **Supabase** — optional storage for consultation/booking form submissions

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase keys if you want form submissions stored
npm run dev
```

Visit `http://localhost:3000` (redirects to `/ar` by default).

## Project Structure

- `src/app/[locale]/` — the 7 pages (home, about, services, reviews, videos, articles, contact) plus the locale-aware root layout
- `src/components/layout/` — Navbar, Footer, standardized PageHero, FinalCta, ContactPanel, LanguageSwitch
- `src/components/sections/` — page-specific sections (home, about, services, reviews, videos, articles, contact)
- `src/components/ui/` — shared primitives: GlassCard, AnimatedCounter, Accordion, StatsGrid, WideVideoPlayer, StarRating, SocialIcons
- `src/components/forms/BookingForm.tsx` — consultation form that posts to `/api/contact` and opens a pre-filled WhatsApp chat
- `src/lib/site-config.ts` — clinic addresses, phone/WhatsApp numbers, social links, working hours (**update with real data before launch**)
- `src/locales/{ar,en}.json` — all copy for both languages
- `supabase/schema.sql` — the `consultation_requests` table + RLS policy for the booking form

## Before going live

1. **Replace placeholder content**: phone numbers, email, clinic addresses, Google Maps embed URLs, and social links in `src/lib/site-config.ts`.
2. **Replace stock imagery**: hero/about/article images currently point to Unsplash URLs inside `src/locales/{ar,en}.json`. Swap in real photos (add the image host to `next.config.ts` → `images.remotePatterns` if not using Unsplash).
3. **Supabase (optional)**: run `supabase/schema.sql` against your project, then set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your deployment environment. Without these, the booking form still works (it opens WhatsApp directly) — submissions just won't be persisted to a database.
4. **Domain**: update `siteConfig.domain` in `src/lib/site-config.ts` (used for canonical URLs, sitemap, Open Graph).

## Build & Deploy

```bash
npm run build
npm run start
```

Deploys cleanly to Vercel (or any Node host). Set the same environment variables from `.env.local` in your hosting provider's dashboard.
