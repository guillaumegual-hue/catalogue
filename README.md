# Coleebri Health test catalogue

Static catalogue: **full browse** at [`index.html`](index.html) and **one page per category** under [`tests/`](tests/).

## Production URLs

- Full catalogue: `https://health.coleebri.com/catalogue/`
- Example category: `https://health.coleebri.com/catalogue/tests/mens-health/`

## Deploy

```bash
node scripts/build-deploy-zip.mjs
```

Upload `coleebri-catalogue-deploy.zip` to `public_html/catalogue/`. See [DEPLOY.md](DEPLOY.md).

## WordPress menus

Copy links from [`tests/urls.json`](tests/urls.json) or [docs/WP-MENUS.md](docs/WP-MENUS.md).

## Local dev

```bash
python3 -m http.server 9876
open "http://localhost:9876/"
```
