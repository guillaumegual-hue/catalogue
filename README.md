# Coleebri Patient Catalogue

Single static patient test catalogue: React app for browse/compare/enquire, plus WordPress integration for search and SEO.

## Architecture (hybrid)

| Layer | Role |
|-------|------|
| **This repo** (`data.js`) | Source of truth; full patient UX |
| **`/catalogue/` on site** | Hosted copy of this repo (primary browse) |
| **WordPress plugin** | `coleebri_test` posts for search + landing pages |
| **Elementor** | Marketing pages + CTAs into catalogue |

See **[docs/PATIENT-JOURNEY.md](docs/PATIENT-JOURNEY.md)**.

## What this repo contains

- **Full catalogue** — `index.html` / `Coleebri Patient Catalogue.html`
- **Embeds** — `embed/` + `assets/coleebri-embed.js` (hub/quiz/glossary; not primary for service pages)
- **WordPress plugin** — `wordpress-plugin/coleebri-health-catalogue/`
- **Sync** — `scripts/sync-wp-tests.mjs`

## Docs

| Doc | Purpose |
|-----|---------|
| [docs/PATIENT-JOURNEY.md](docs/PATIENT-JOURNEY.md) | Approved browse/search/enquire flows |
| [docs/INFOMANIAK-OPS-CHECKLIST.md](docs/INFOMANIAK-OPS-CHECKLIST.md) | Deploy `/catalogue/`, homepage embeds, WC exit |
| [docs/WOOCOMMERCE-SUNSET.md](docs/WOOCOMMERCE-SUNSET.md) | Replace WC product grids for patient tests |
| [docs/WP-PLUGIN.md](docs/WP-PLUGIN.md) | Install plugin + sync tests |
| [docs/WP-SEARCH-POPUP.md](docs/WP-SEARCH-POPUP.md) | Header search popup #2949 |
| [DEPLOY.md](DEPLOY.md) | GitHub Pages + production `/catalogue/` |
| [docs/WEBSITE-EMBED.md](docs/WEBSITE-EMBED.md) | Legacy iframe widgets |
| [docs/PHASE0-ELEMENTOR.md](docs/PHASE0-ELEMENTOR.md) | Category page import |
| [integrate/elementor/](integrate/elementor/) | Elementor template JSON |

## Local run

```bash
python3 -m http.server 9876
open http://localhost:9876/
```

## GitHub Pages (staging)

Push `main` → `https://guillaumegual-hue.github.io/catalogue/`

Production: copy to `https://health.coleebri.com/catalogue/` and set `COLEEBRI_CATALOGUE_BASE` in `wp-config.php`.
