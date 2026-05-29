# WordPress plugin — Coleebri Health Catalogue

Path: [`wordpress-plugin/coleebri-health-catalogue/`](../wordpress-plugin/coleebri-health-catalogue/)

## Install

1. Build zip (optional):

   ```bash
   node scripts/build-wp-plugin-zip.mjs
   ```

2. WordPress → **Plugins → Add New → Upload** → `coleebri-health-catalogue.zip` → **Activate**.

3. `wp-config.php`:

   ```php
   define( 'COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/' );
   ```

4. **Settings → Permalinks → Save** (flush rewrite rules).

## Sync tests from data.js

```bash
set -a && source .env && set +a
node scripts/export-catalogue-json.mjs
node scripts/sync-wp-tests.mjs --dry-run
node scripts/sync-wp-tests.mjs
```

### `.env` keys

```bash
COLEEBRI_WP_URL=https://health.coleebri.com
COLEEBRI_WP_USER=your@email.com
COLEEBRI_WP_APP_PASSWORD='xxxx xxxx xxxx xxxx xxxx xxxx'
COLEEBRI_CATALOGUE_BASE=https://health.coleebri.com/catalogue/
```

Create an **Application Password** under Users → Profile.

## Post type: `coleebri_test`

| Item | Value |
|------|--------|
| Public URLs | `/blood-test/{slug}/` (plus WPML `/en/` prefix if configured) |
| Search | Included in front-end search (title, content, code, markers meta) |
| Single template | Plugin `templates/single-coleebri_test.php` → CTA into catalogue |

### Meta fields (REST + sync)

- `clbr_id`, `clbr_code`, `clbr_section`, `clbr_tracks`, `clbr_samples`
- `clbr_turnaround`, `clbr_price`, `clbr_price_upper`, `clbr_components`
- `clbr_catalogue_hash` — deep-link fragment for catalogue app

## Shortcode (legacy)

`[coleebri_catalogue widget="tests" service="men" height="900"]`

Prefer **catalogue CTAs** on service pages (see regenerated Elementor templates). Use shortcode only for hub widgets (quiz, glossary).

## PHP helpers

```php
coleebri_catalogue_base();
coleebri_catalogue_deep_link( [ 'test' => 'NP059', 'service' => 'men' ] );
```

## Elementor

- Import updated service templates from `integrate/elementor/coleebri-service-*.json` (no test iframes).
- Theme Builder optional: override `coleebri_test` single if you need full Elementor layout; keep catalogue CTA.

See [WP-SEARCH-POPUP.md](WP-SEARCH-POPUP.md) and [PATIENT-JOURNEY.md](PATIENT-JOURNEY.md).
