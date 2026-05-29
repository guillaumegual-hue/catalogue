# Patient journey — catalogue + WordPress (hybrid)

This is the **approved** integration model. The React catalogue owns browse/compare/enquire UX; WordPress owns marketing pages, SEO, and search.

## Primary flows

| Step | Where | What happens |
|------|--------|----------------|
| Homepage teasers | Elementor home | Iframes: **most-ordered** + **categories** → links open full catalogue |
| Discover a service | `/en/tests/mens-health/` etc. | Elementor: hero, compliance copy, **CTA → full catalogue** filtered by service |
| Browse all tests | `/catalogue/` (same Infomaniak host) | Full app: search, tabs, quiz, compare, list, **Request modal** |
| Find one test | Header search popup | WordPress search → `coleebri_test` posts + pages; each result links to catalogue with `#test={id}` |
| Enquire | Catalogue only | **Request modal** in [`app.jsx`](../app.jsx) (mailto fallback in embeds is legacy) |
| Deep link | Any | `…/Coleebri%20Patient%20Catalogue.html#service=men&test=NP059` |

## URL conventions

Production catalogue base (set in `wp-config.php`):

```php
define( 'COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/' );
```

| Intent | Catalogue URL |
|--------|----------------|
| Full browse | `{BASE}Coleebri%20Patient%20Catalogue.html` or `{BASE}` |
| Men's tests | `{BASE}Coleebri%20Patient%20Catalogue.html#service=men` |
| Fitness section | `{BASE}Coleebri%20Patient%20Catalogue.html#service=fitness` |
| Single test | `{BASE}Coleebri%20Patient%20Catalogue.html#test={CLBR_ID}` |
| Patient info | `{BASE}Coleebri%20Patient%20Catalogue.html#patient-information` |

Staging base until cutover: `https://guillaumegual-hue.github.io/catalogue/`

## WordPress vs catalogue responsibilities

**WordPress (Elementor)**

- Site header/footer, menus, legal pages
- Service category pages (`/en/tests/…`) — **marketing shell + CTA**, not test iframes
- Custom post type `coleebri_test` — search/SEO landing (synced from `data.js`)
- Elementor single template for tests → buttons into catalogue
- Enquiry forms on static pages if needed (optional; catalogue modal is preferred for tests)

**Catalogue repo**

- `data.js` — single source of truth (Excel export)
- Full patient UI
- GitHub Pages staging → copy to `/catalogue/` on production

## Enquire path (one choice)

**Use the catalogue Request modal** for test-specific enquiries (markers, price context, quiz answers).

Do **not** maintain a parallel OpnForm/embed enquire flow for the main site.

## Editor checklist

1. Service page: H1 + blurb in Elementor; **no** `widget=tests` iframe (use CTA from regenerated templates).
2. Hub page: nav menu to services + link “Search all tests” → `/catalogue/`.
3. After Excel update: run `node scripts/export-catalogue-json.mjs` then `node scripts/sync-wp-tests.mjs`.
4. Deploy static files to `/catalogue/` (see [DEPLOY.md](../DEPLOY.md)).

## Related docs

- [DEPLOY.md](../DEPLOY.md) — Infomaniak `/catalogue/` upload
- [homepage-embed-snippet.html](../integrate/elementor/homepage-embed-snippet.html) — homepage iframes only
- [WP-MENUS.md](WP-MENUS.md) — menu URLs to catalogue hashes
- [WOOCOMMERCE-SUNSET.md](WOOCOMMERCE-SUNSET.md) — decommission WC product grids
- [WEBSITE-EMBED.md](WEBSITE-EMBED.md) — embed reference (homepage + hub widgets)
- [WP-SEARCH-POPUP.md](WP-SEARCH-POPUP.md) — header search popup #2949
- [PHASE0-ELEMENTOR.md](PHASE0-ELEMENTOR.md) — category page import
- [WP-AUDIT.md](WP-AUDIT.md) — plugin + config audit
