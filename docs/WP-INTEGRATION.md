# WordPress integration (native feel)

Category pages are built in **Elementor**: you own the title, subtitle, body copy, and **Nav Menu** for “Browse by category”. The catalogue supplies **test cards only** in a transparent iframe.

## Recommended page layout

1. **Hub** (`/en/tests/`) — hero + Elementor **Nav Menu** (or `integrate/elementor/category-nav-snippet.html`) linking to each category.
2. **Each category page** — your H1, intro paragraphs (e.g. sports, wellbeing, sample collection), then one HTML widget with the embed below.
3. **No** iframe tab strip and **no** “Coleebri Health / Open full catalogue” bar on category pages.

## Embed snippet (tests only)

```html
<div
  data-coleebri-embed="tests"
  data-coleebri-base="https://guillaumegual-hue.github.io/catalogue/"
  data-branding="none"
  data-site="https://health.coleebri.com/en"
  data-integrated="1"
  data-transparent="1"
  data-category="fitness"
  data-height="900"
></div>
<script
  src="https://guillaumegual-hue.github.io/catalogue/assets/coleebri-embed.js?v=20260530b"
  data-base="https://guillaumegual-hue.github.io/catalogue/"
></script>
```

Use `data-service="men"` (etc.) for track-based categories, or `data-category="fitness"` / `data-category="allergies"` for section-based pages.

| Category | WP slug (suggested) | Embed filter |
|----------|---------------------|--------------|
| Hub | `/en/tests/` | Nav menu only |
| General | `general-health` | `data-service="general"` |
| Women's | `womens-health` | `data-service="women"` |
| Men's | `mens-health` | `data-service="men"` |
| Sexual | `sexual-health` | `data-service="sexual"` |
| Fitness & wellbeing | `fitness-wellbeing` | `data-category="fitness"` |
| Allergies | `allergies` | `data-category="allergies"` |
| DNA | `dna` | `data-service="dna"` |

Replace `/fitness-allergies/` with the two pages above when you publish.

## Elementor templates

Run `node scripts/generate-elementor-import.mjs`, then import JSON from `integrate/elementor/`:

- **`coleebri-service-*.json`** — embed-only (no heading); add your copy in Elementor.
- **`coleebri-tests-hub.json`** — starter hub with intro note.
- **`category-nav-snippet.html`** — pill nav if you are not using Nav Menu yet.

## Behaviour

- **`data-integrated="1"`** — Enquire uses `mailto:` on the parent site; no redirect to GitHub.
- **`data-transparent="1"`** — iframe background is transparent so your theme background shows through.
- Titles/blurbs inside the iframe are hidden in integrated mode; write them in Elementor instead.

## Plugin shortcode

```text
[coleebri_catalogue widget="tests" category="fitness" height="900" branding="none"]
```

```php
define( 'COLEEBRI_CATALOGUE_BASE', 'https://guillaumegual-hue.github.io/catalogue/' );
```

When the catalogue moves to `https://health.coleebri.com/catalogue/`, change that constant only.
