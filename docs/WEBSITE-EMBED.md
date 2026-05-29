# Embedding the catalogue on health.coleebri.com

> **Preferred integration:** [PATIENT-JOURNEY.md](PATIENT-JOURNEY.md) — service pages use **catalogue CTAs**; full app at `/catalogue/`.  
> Iframe test grids (`widget=tests`) are **legacy**; do not add them to new pages.

## Current model

| Surface | Use |
|---------|-----|
| `/catalogue/` | Primary browse, search, quiz, compare, **Request modal** |
| Elementor service pages | Marketing copy + buttons → catalogue deep links |
| `coleebri_test` (WP plugin) | Header search + SEO landing pages |
| Iframes | Hub only: quiz, glossary, marker-check |

Install and sync: [WP-PLUGIN.md](WP-PLUGIN.md). Search popup: [WP-SEARCH-POPUP.md](WP-SEARCH-POPUP.md).

## Service page CTAs (recommended)

Regenerate Elementor JSON:

```bash
node scripts/generate-elementor-import.mjs
```

Import `integrate/elementor/coleebri-service-*.json` — each page has **View all tests in the catalogue** (no test iframe).

Example deep link (men's health):

```text
https://health.coleebri.com/catalogue/Coleebri%20Patient%20Catalogue.html#service=men
```

## Legacy: test card iframe

Only if you cannot link out to `/catalogue/` yet:

```html
<div
  data-coleebri-embed="tests"
  data-coleebri-base="https://health.coleebri.com/catalogue/"
  data-site="https://health.coleebri.com/en"
  data-integrated="1"
  data-transparent="1"
  data-service="men"
  data-height="900"
></div>
<script src="https://health.coleebri.com/catalogue/assets/coleebri-embed.js?v=20260606d" data-base="https://health.coleebri.com/catalogue/"></script>
```

Embed **Enquire** uses `mailto:` — not the full catalogue Request modal. Prefer catalogue deep links for enquiries.

## Hub widgets (still valid)

| Widget | Use |
|--------|-----|
| `widget=quiz` | Help me choose |
| `widget=glossary` / `marker-check` | Biomarkers |
| `widget=most-ordered` / `categories` | Home page panels |
| `widget=tabs` | Optional category nav (prefer Elementor menu) |

## Deploy

[DEPLOY.md](../DEPLOY.md) — GitHub Pages staging → `health.coleebri.com/catalogue/`.
