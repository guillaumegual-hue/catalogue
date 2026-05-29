# Embedding the catalogue on health.coleebri.com

One static catalogue (this repo), hosted on GitHub Pages today and on the same server as the website later. The website adds **your** titles, navigation, and forms in Elementor; the catalogue supplies **matching** test cards via a small iframe.

## Enquiries: mailto now, OpnForm optional later

- **Now:** integrated **Enquire** uses `mailto:health@coleebri.com` with test details prefilled.
- **Optional (phase 2):** self-hosted OpnForm at **app.coleebri.eu** with Coleebri workspace CSS — see **[OPNFORM-STYLING.md](OPNFORM-STYLING.md)** and [`assets/opnform-coleebri-theme.css`](../assets/opnform-coleebri-theme.css). Wire catalogue → OpnForm modal only after the styled form passes visual QA there.
- **Elementor forms** remain the simplest on-brand option if you skip OpnForm.
- No **WordPress plugin** — use an HTML widget + `coleebri-embed.js` for test cards only.

## Recommended layout

| Layer | You build in Elementor | Catalogue provides |
|--------|-------------------------|-------------------|
| Header / footer | Theme | — |
| H1, intro, compliance copy | Text widgets | — |
| Browse by category | Nav Menu → `/en/tests/…` pages | `widget=tabs` (no logo / catalogue link) |
| Test list | HTML widget + script below | `widget=tests` iframe (cards only — no embed header or track title) |
| Enquire | Elementor form, styled OpnForm (phase 2), or mailto | Pre-filled mailto when integrated (default) |

## Embed snippet (category page)

Replace `BASE` with your catalogue URL (`https://guillaumegual-hue.github.io/catalogue/` now, `https://health.coleebri.com/catalogue/` later).

```html
<div
  data-coleebri-embed="tests"
  data-coleebri-base="BASE"
  data-branding="none"
  data-site="https://health.coleebri.com/en"
  data-integrated="1"
  data-transparent="1"
  data-service="men"
  data-height="900"
></div>
<script src="BASEassets/coleebri-embed.js?v=20260531a" data-base="BASE"></script>
```

Filters: `data-service="men"` or `data-category="fitness"` / `data-category="allergies"`.

Integrated mode:

- No embed header bar
- Transparent iframe background (site background shows through)
- **Enquire** opens `mailto:health@coleebri.com` with test details (default until OpnForm pilot passes QA — see [OPNFORM-STYLING.md](OPNFORM-STYLING.md))

## Full catalogue

Link to `BASE` + `Coleebri Patient Catalogue.html`, or host the whole repo under `/catalogue/` on your domain.

## Elementor templates (optional)

Reference JSON in [`integrate/elementor/`](../integrate/elementor/) — import or copy the HTML widget only. Regenerate with:

```bash
node scripts/generate-elementor-import.mjs
```

## Deploy path

See [DEPLOY.md](../DEPLOY.md): GitHub Pages for staging → copy static files to `health.coleebri.com/catalogue/` for production.
