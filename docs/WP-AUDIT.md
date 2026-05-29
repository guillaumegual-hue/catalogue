# WordPress audit — 2026-05-29 (updated)

Site: **Coleebri Health** — https://health.coleebri.com/en/

## Target architecture

See [PATIENT-JOURNEY.md](PATIENT-JOURNEY.md). Summary:

- Catalogue static files at `/catalogue/`
- Plugin **Coleebri Health Catalogue** (`coleebri_test` CPT + search)
- Service pages: Elementor CTAs, not test iframes

## Plugins (relevant)

| Plugin | Status | Notes |
|--------|--------|--------|
| **Coleebri Health Catalogue** | **Install from repo zip** | [`wordpress-plugin/coleebri-health-catalogue.zip`](../wordpress-plugin/coleebri-health-catalogue.zip) |
| Elementor (free) | Activate | Templates + popups |
| Elementor Pro | Active | Theme builder |
| WooCommerce | Active | Legacy product grids — not patient catalogue |
| WordPress MCP | Optional | REST sync via `scripts/sync-wp-tests.mjs` |

## Configuration

```php
define( 'COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/' );
```

Staging until cutover:

```php
define( 'COLEEBRI_CATALOGUE_BASE', 'https://guillaumegual-hue.github.io/catalogue/' );
```

## Actions required

1. Build/upload plugin: `node scripts/build-wp-plugin-zip.mjs` → activate.
2. Set `COLEEBRI_CATALOGUE_BASE` in `wp-config.php`.
3. `node scripts/sync-wp-tests.mjs` (see `.env` in [WP-PLUGIN.md](WP-PLUGIN.md)).
4. Re-import `coleebri-service-*.json` Elementor templates (CTA layout).
5. Update search popup #2949 — [WP-SEARCH-POPUP.md](WP-SEARCH-POPUP.md).
6. Deploy static catalogue to `/catalogue/` — [DEPLOY.md](../DEPLOY.md).

## Hosted catalogue

- Staging: https://guillaumegual-hue.github.io/catalogue/
- Production: https://health.coleebri.com/catalogue/
