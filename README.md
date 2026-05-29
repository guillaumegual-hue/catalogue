# Coleebri Patient Catalogue

Static patient test catalogue (React) with WordPress **embed shortcodes** for Elementor.

## Quick links

| Doc | Purpose |
|-----|---------|
| [DEPLOY.md](DEPLOY.md) | GitHub Pages → production server |
| [docs/PHASE0-ELEMENTOR.md](docs/PHASE0-ELEMENTOR.md) | Six category pages (General, Men's, Women's, …) |
| [IMPORT-README.md](IMPORT-README.md) | Package overview & shortcodes |
| [integrate/elementor/](integrate/elementor/) | Elementor template JSON files |

## Local run

```bash
python3 -m http.server 9876
open http://localhost:9876/
```

## WordPress plugin (embed only)

Build zip: `wordpress-plugin/coleebri-catalogue.zip` — upload to WP; set `COLEEBRI_CATALOGUE_BASE` in `wp-config.php`.

Do **not** use `wordpress-plugin/coleebri-health-catalogue/` on production (archived full plugin).

## GitHub Pages

Push `main` → Actions deploys static site → use URL in `COLEEBRI_CATALOGUE_BASE` for staging.
