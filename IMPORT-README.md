# Coleebri Patient Catalogue — import package

Deploy the contents of this folder to your web server (e.g. `https://health.coleebri.com/catalogue/`), or use **GitHub Pages** for staging — see **[DEPLOY.md](DEPLOY.md)** and **[docs/PHASE0-ELEMENTOR.md](docs/PHASE0-ELEMENTOR.md)**.

## Quick start

1. Upload the entire folder to your host (FTP, SFTP, or hosting file manager).
2. Ensure the folder is served over **HTTPS** (not `file://`).
3. Open: `Coleebri Patient Catalogue.html`
4. Integrate hub: `integrate.html` or `integrate/index.html`

## WordPress / Elementor

**Importable Elementor templates:** see `integrate/elementor/` — 17 page JSON files + `coleebri-catalogue-pages.xml` (WordPress import). Run `node scripts/generate-elementor-import.mjs` to regenerate after changing widgets.

1. Install **`wordpress-plugin/coleebri-catalogue.zip`** (embed only — not `coleebri-health-catalogue`).
2. Optional in `wp-config.php`:
   ```php
   define('COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/');
   ```
3. Shortcode examples:
   ```
   [coleebri_catalogue widget="most-ordered" height="880" branding="none"]
   [coleebri_catalogue widget="categories" height="520" branding="none"]
   [coleebri_catalogue widget="catalogue" service="women" height="900"]
   ```
4. Or paste snippets from `integrate.html` into an HTML widget (set **Base URL** to your catalogue URL).

## Embeds (every catalogue block)

Open `integrate.html` for a snippet builder, ready-made recipes per section/service, and live preview.

| Use case | Widget | Example |
|----------|--------|---------|
| Section page (e.g. profiles) | `tests` | `widget=tests&category=profiles` |
| Service page (e.g. men's health) | `tests` | `widget=tests&service=men` |
| Category navigation | `tabs` | `widget=tabs` |
| Help me choose | `quiz` | `widget=quiz` |
| Collection pricing | `collection` | `widget=collection` |
| Patient information | `patient-info` | `widget=patient-info` |
| Four featured tests | `most-ordered` | `branding=none` on Coleebri site |
| Category list | `categories` | `branding=none` on Coleebri site |
| Full catalogue (hero + search) | `catalogue` | iframe of full HTML page |

WordPress: `[coleebri_catalogue widget="tests" category="sexual" height="880"]`

## Local testing

```bash
cd /path/to/this/folder
python3 -m http.server 9876
```

Then open: `http://localhost:9876/Coleebri%20Patient%20Catalogue.html`

## Files not included in this zip

- `export/` — large offline/print export bundle
- `uploads/` — Elementor reference files
- `scripts/` — development utilities
- `excel-items.json` — source data (runtime uses `data.js`)

## Support

Enquiries: health@coleebri.com
