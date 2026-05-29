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
  data-display-only="1"
  data-category="fitness"
  data-height="900"
></div>
<script
  src="https://guillaumegual-hue.github.io/catalogue/assets/coleebri-embed.js?v=20260531a"
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

- **`data-display-only="1"`** — Enquire, compare, and add-to-list post to the parent; [`coleebri-wp-bridge.js`](../assets/coleebri-wp-bridge.js) opens **OpnForm** and the compare drawer.
- **`data-integrated="1"`** — no redirect to GitHub catalogue HTML.
- **`data-transparent="1"`** — iframe background is transparent so your theme background shows through.
- Titles/blurbs inside the iframe are hidden in integrated mode; write them in Elementor instead.

Install plugin **v1.3+** and see [OPNFORM-INTEGRATION.md](OPNFORM-INTEGRATION.md).

## Plugin shortcodes

```text
[coleebri_catalogue widget="tests" category="fitness" height="900" branding="none" display_only="1" integrated="1" transparent="1"]
[coleebri_opnform slug="test-enquiry" height="720"]
```

```php
define( 'COLEEBRI_CATALOGUE_BASE', 'https://guillaumegual-hue.github.io/catalogue/' );
define( 'COLEEBRI_OPNFORM_PUBLIC_BASE', 'https://app.coleebri.eu' );
define( 'COLEEBRI_OPNFORM_ENQUIRY_SLUG', 'test-enquiry' );
// Token only for server-side scripts — never in the browser:
// define( 'COLEEBRI_OPNFORM_TOKEN', '...' );
```

When the catalogue moves to `https://health.coleebri.com/catalogue/`, change that constant only.
