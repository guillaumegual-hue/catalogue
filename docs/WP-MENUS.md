# WordPress menus → catalogue category pages

After `/catalogue/` is on Infomaniak, point navigation at **one URL per category** under `/catalogue/tests/{slug}/` (not hash links on the main HTML file — hashes are unreliable in menus and iframes).

Regenerate static pages when `data.js` changes:

```bash
node scripts/generate-category-pages.mjs
```

**GitHub Pages testing:** see [WP-MENUS-GITHUB-STAGING.md](./WP-MENUS-GITHUB-STAGING.md).

Production base:

```text
https://health.coleebri.com/catalogue/
```

## Recommended menu structure

| Menu label | URL |
|------------|-----|
| All tests | https://health.coleebri.com/catalogue/tests/all-tests/ |
| General health | https://health.coleebri.com/catalogue/tests/general-health/ |
| Women's health | https://health.coleebri.com/catalogue/tests/womens-health/ |
| Men's health | https://health.coleebri.com/catalogue/tests/mens-health/ |
| Sexual health | https://health.coleebri.com/catalogue/tests/sexual-health/ |
| Fitness & wellbeing | https://health.coleebri.com/catalogue/tests/fitness-wellbeing/ |
| Allergies | https://health.coleebri.com/catalogue/tests/allergies/ |
| Paternity & DNA | https://health.coleebri.com/catalogue/tests/dna/ |
| Phlebotomy & collection | https://health.coleebri.com/catalogue/tests/phlebotomy-collection/ |
| Full catalogue (quiz & compare) | https://health.coleebri.com/catalogue/ |
| Biomarker glossary | https://health.coleebri.com/catalogue/tests/glossary/ |
| Glossaire | https://health.coleebri.com/catalogue/tests/glossaire/ |
| Check a marker | https://health.coleebri.com/catalogue/tests/marker-check/ |

## Optional thin WP pages (`/en/tests/…`)

Keep Elementor pages for SEO copy only — buttons from regenerated templates should link to the matching `/catalogue/tests/…/` URL (see `integrate/elementor/coleebri-service-*.json`; re-run `generate-elementor-import.mjs` when CTAs are updated).

Re-generate after `data.js` changes:

```bash
node scripts/generate-elementor-import.mjs
```

## Homepage

Use [`homepage-embed-snippet.html`](../integrate/elementor/homepage-embed-snippet.html) — not catalogue URLs in the menu for “most ordered”; that block is an iframe on the home page only.
