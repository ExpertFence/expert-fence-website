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
| `expert-fence-proposal.html` | Internal client proposal / e-sign page (not for public nav) |

Images live in `assets/img/` (JPEG/WebP pairs with lazy-loading, generated from source photography).

## Before this goes live to real customers

Everything below is a placeholder so the site can deploy today — replace before sharing the link publicly:

- License numbers on `expert-fence-legal.html` (`AW-XXXXXXX`, `G-XXXXXXX` style placeholders)
- `YOUR_PIXEL_ID` / `YOUR_META_PIXEL_ID` analytics placeholders
- Form submission target (`formsubmit.co`) currently posts to a personal Gmail — point it at the real business inbox
- Accreditation badge art on the About page (BBB/Angi/Checkbook marks are placeholders pending licensing)
- Legal page content — reviewed by AI, needs sign-off from a licensed attorney before publishing

## Build tooling

`build/` contains the Python scripts used to generate these pages (Pillow-based image processing, HTML templating). They read from source photography that isn't part of this repo, so they're kept for reference/history rather than being directly re-runnable as-is.

## Local development

No build step — open any `expert-fence-*.html` file directly in a browser, or serve the directory:

```bash
npx serve .
```
