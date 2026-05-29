# Coleebri Patient Catalogue

Single static patient test catalogue: React app + embeddable widgets for use on [health.coleebri.com](https://health.coleebri.com).

## What this repo is

- **Full catalogue** — `index.html` / `Coleebri Patient Catalogue.html`
- **Embeds** — `embed/` + `assets/coleebri-embed.js` for iframes on the website (test grids, glossary, quiz, etc.)
- **Shared UI** — `assets/coleebri-health-site.css` so cards look the same everywhere

## What this repo is not

- No WordPress plugin (use a script tag in Elementor)
- No OpnForm (form UI does not match the site — use Elementor forms or mailto)

## Docs

| Doc | Purpose |
|-----|---------|
| [DEPLOY.md](DEPLOY.md) | GitHub Pages → same server as the website |
| [docs/WEBSITE-EMBED.md](docs/WEBSITE-EMBED.md) | Elementor + iframe integration |
| [docs/OPNFORM-STYLING.md](docs/OPNFORM-STYLING.md) | Self-hosted OpnForm skin (pilot) |
| [integrate/elementor/](integrate/elementor/) | Optional Elementor template JSON |

## Local run

```bash
python3 -m http.server 9876
open http://localhost:9876/
```

## GitHub Pages

Push `main` → Actions deploys to `https://guillaumegual-hue.github.io/catalogue/`.

Later: copy the built site to `https://health.coleebri.com/catalogue/` and point embeds at that base URL.
