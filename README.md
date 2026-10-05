# Expert Fence Website

Static, multi-page marketing site for Expert Fence — plain HTML/CSS/JS, no build step required to serve.

## Pages

| File | Purpose |
|---|---|
| `index.html` / `expert-fence-mockup.html` | Home |
| `expert-fence-about.html` | About / company story / credentials |
| `expert-fence-residential.html` | Residential services + estimate form |
| `expert-fence-commercial.html` | Commercial services + bid request form |
| `expert-fence-gallery.html` | Filterable project gallery |
| `expert-fence-booking.html` | Site-visit scheduler |
| `expert-fence-materials.html` | Materials / online store |
| `expert-fence-legal.html` | Privacy, terms, licensing disclosures |

Images live in `assets/img/` (JPEG/WebP pairs with lazy-loading, generated from source photography).

## Marketing tags

Meta Pixel, Google Analytics 4 / Google Ads and the LinkedIn Insight Tag are loaded by
`assets/js/ef-analytics.js`. Paste each ID into the `TAGS` block at the top of that file; a blank ID
keeps that tag off. Form submissions fire `Lead` / `generate_lead`; phone and email clicks fire `Contact`.

Every page carries Open Graph and Twitter Card tags with `assets/img/og-share.jpg` (1200×630) as the
share image, so links preview correctly on Facebook, Instagram, LinkedIn and X.

## Forms

Every lead form posts to `/api/contact` (`api/contact.mjs`, a Vercel Function), which emails the submission
to expertfence@expertfence.com through Resend from website@notify.expertfence.com. It needs the`n`RESEND_API_KEY` environment variable in Vercel. Booking-page photos are sent as attachments.

## Build tooling

`build/` contains the Python scripts used to generate these pages (Pillow-based image processing, HTML templating). They read from source photography that isn't part of this repo, so they're kept for reference/history rather than being directly re-runnable as-is.

## Local development

No build step — open any `expert-fence-*.html` file directly in a browser, or serve the directory:

```bash
npx serve .
```
