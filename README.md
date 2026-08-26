# Expert Fence Website

Comprehensive, SEO-structured marketing site for Expert Fence — built with Next.js 14 (App Router), Tailwind CSS, and Supabase (for storing quote-request leads).

## Before this goes live to real customers

Everything below is a clearly-labeled **placeholder** so the site can deploy today. Replace before sharing the link publicly:

- `lib/site-config.ts` — real phone number, email, address, license number, business hours
- `app/testimonials/page.tsx` — real, permissioned customer reviews (or embed your Google Business Profile)
- All `PlaceholderTile` image placeholders across Home, Services, About, and Gallery — swap in real project photos
- Connect a custom domain in Vercel once you have one

## Local development

```bash
npm install
cp .env.example .env.local   # fill in Supabase values
npm run dev
```

## Environment variables

| Variable | Where it's used | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (`/api/leads`) | Supabase → Project Settings → API (keep secret, do not prefix with `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_SITE_URL` | Sitemap/robots/metadata | Your production URL, e.g. `https://expert-fence-website.vercel.app` |

## Supabase setup

Create a `leads` table with this SQL in the Supabase SQL editor:

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  service text,
  zip text,
  message text,
  source text
);

alter table public.leads enable row level security;

-- No public read/write policies are created on purpose: the contact form
-- writes through the server-side /api/leads route using the service role
-- key, which bypasses RLS. Do not expose this table to the anon key.
```

## Deploy

1. Push this repo to GitHub.
2. Import the repo in Vercel (vercel.com/new).
3. Add the environment variables above in Vercel → Project → Settings → Environment Variables.
4. Deploy. Framework preset: Next.js (auto-detected).

## Structure

- `app/` — routes (App Router). Services and service-area pages are generated from `lib/site-config.ts`.
- `components/` — shared UI (header, footer, forms, cards).
- `lib/site-config.ts` — single source of truth for business info, services, service areas, and FAQs.
- `app/api/leads/route.ts` — server route that writes contact-form submissions to Supabase.
- `app/sitemap.ts` / `app/robots.ts` — auto-generated for SEO.
