# Coleebri Health test catalogue — import package

Deploy this folder to your web server (e.g. `https://health.coleebri.com/catalogue/`), or use **GitHub Pages** for staging — see **[DEPLOY.md](DEPLOY.md)**.

## Quick start

1. Upload the entire folder to your host (FTP, SFTP, or hosting file manager).
2. Serve over **HTTPS** (not `file://`).
3. Open: `index.html`
4. Integration hub: `integrate.html` or `integrate/index.html`

## WordPress / Elementor

See **[docs/WEBSITE-EMBED.md](docs/WEBSITE-EMBED.md)** and **`integrate/elementor/`** (page JSON + optional WXR).

1. Paste the HTML widget snippet from a service template (e.g. `coleebri-service-men.json`) into Elementor.
2. Set `data-coleebri-base` to your catalogue URL (GitHub Pages staging or `/catalogue/` on your domain).
3. Build navigation and enquiry forms in Elementor (not OpnForm — form UI will not match the theme).

Regenerate templates:

```bash
node scripts/generate-elementor-import.mjs
```

## Embeds

| Use case | Widget | Filter |
|----------|--------|--------|
| Service page | `tests` | `data-service="men"` |
| Section page | `tests` | `data-category="profiles"` |
| Help me choose | `quiz` | — |
| Full catalogue | `catalogue` | full page iframe |

Snippet builder: `integrate.html`

## Local testing

```bash
python3 -m http.server 9876
open http://localhost:9876/
```
