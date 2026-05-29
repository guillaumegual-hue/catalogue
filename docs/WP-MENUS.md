# WordPress menus → catalogue deep links

After `/catalogue/` is on Infomaniak, point navigation at the **catalogue app** (not WooCommerce shop, not test iframes).

Base:

```text
https://health.coleebri.com/catalogue/Coleebri%20Patient%20Catalogue.html
```

## Recommended menu structure

| Menu label | Link type | URL |
|------------|-----------|-----|
| All tests | Custom URL | `…Catalogue.html` |
| General health | Custom URL | `…Catalogue.html#service=general` |
| Women's health | Custom URL | `…Catalogue.html#service=women` |
| Men's health | Custom URL | `…Catalogue.html#service=men` |
| Sexual health | Custom URL | `…Catalogue.html#service=sexual` |
| Fitness & wellbeing | Custom URL | `…Catalogue.html#service=fitness` |
| Allergies | Custom URL | `…Catalogue.html#category=allergies` |
| DNA tests | Custom URL | `…Catalogue.html#service=dna` |
| Help me choose | Custom URL | `…Catalogue.html` (scroll to quiz) or hub page with quiz embed |

## Optional thin WP pages (`/en/tests/…`)

Keep Elementor pages for SEO copy only — buttons from regenerated templates link to the same hashes (see `integrate/elementor/coleebri-service-*.json`).

Re-generate after `data.js` changes:

```bash
node scripts/generate-elementor-import.mjs
```

## Homepage

Use [`homepage-embed-snippet.html`](../integrate/elementor/homepage-embed-snippet.html) — not catalogue URLs in the menu for “most ordered”; that block is an iframe on the home page only.
