# Deployment guide

Host the catalogue on **GitHub Pages** for testing, then copy the same files to your WordPress server (e.g. `https://health.coleebri.com/catalogue/`).

## 1. GitHub (staging)

**Public repository required** on a free GitHub plan (private repos need GitHub Pro for Pages). Enable **Settings → Pages → Build and deployment → Source: GitHub Actions** before the first workflow run.

Live staging URL for this repo:

```text
https://guillaumegual-hue.github.io/catalogue/
```

```bash
cd "/path/to/Catalogue 2"
git init
git add .
git commit -m "Initial catalogue for GitHub Pages"
git branch -M main
git remote add origin git@github.com:YOUR_ORG/coleebri-patient-catalogue.git
git push -u origin main
```

In the repo on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (workflow included) or **Deploy from branch `main` / root**.

After deploy, your base URL is:

```text
https://YOUR_ORG.github.io/coleebri-patient-catalogue/
```

Test:

- `.../embed/?widget=tests&service=men&branding=none`
- `.../Coleebri%20Patient%20Catalogue.html`

## 2. WordPress embed (Elementor HTML widget)

No plugin. Paste the snippet from [docs/WEBSITE-EMBED.md](docs/WEBSITE-EMBED.md) or `integrate/elementor/coleebri-service-general.json`, with `data-coleebri-base` set to your GitHub Pages or production catalogue URL.

## 3. Phase 0 — category pages (Elementor)

See **[docs/PHASE0-ELEMENTOR.md](docs/PHASE0-ELEMENTOR.md)**.

Import each `integrate/elementor/coleebri-service-*.json` template, publish under e.g. `/en/tests/mens-health/`, add menu links.

## 4. Production cutover (same server as WordPress)

1. Upload this repo root (excluding `export/`, `.git`) to:

```text
public_html/catalogue/
```

2. Update `wp-config.php`:

```php
define( 'COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/' );
```

3. Settings → Permalinks → Save.

Optional: use `.github/workflows/deploy-production.yml` with SFTP secrets (configure host/path first).

## 5. Site recovery (if old full plugin broke the site)

1. Deactivate or remove `coleebri-health-catalogue` via FTP.
2. Trash bad import products (SKU `-`).
3. WooCommerce → Status → Tools → regenerate tables.
4. Use **coleebri-catalogue** embed plugin only.

## Local dev

```bash
python3 -m http.server 9876
open "http://localhost:9876/"
```
