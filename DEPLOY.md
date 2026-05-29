# Deploy Coleebri catalogue (static)

Upload to **`/catalogue/`** on your host (e.g. `https://health.coleebri.com/catalogue/`).

## What to upload

| URL | File |
|-----|------|
| Full catalogue | `/catalogue/` → `index.html` |
| Category (for WP menus) | `/catalogue/tests/{slug}/` |

Build a zip:

```bash
node scripts/build-deploy-zip.mjs
```

→ `coleebri-catalogue-deploy.zip` (extract into `public_html/catalogue/`).

## Verify

- `https://health.coleebri.com/catalogue/`
- `https://health.coleebri.com/catalogue/tests/mens-health/`

## WordPress

In `wp-config.php`:

```php
define( 'COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/' );
```

Menu URLs: [`tests/urls.json`](tests/urls.json) and [`docs/WP-MENUS.md`](docs/WP-MENUS.md).

Legacy `Coleebri Patient Catalogue.html` redirects to `index.html`.

## Regenerate category pages

After editing `data.js` or heroes:

```bash
node scripts/generate-category-pages.mjs
```
