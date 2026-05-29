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
- `.../` (index.html — full catalogue)

## 2. WordPress plugin + sync

Install [`wordpress-plugin/coleebri-health-catalogue.zip`](wordpress-plugin/coleebri-health-catalogue.zip) (build with `node scripts/build-wp-plugin-zip.mjs`).

See **[docs/WP-PLUGIN.md](docs/WP-PLUGIN.md)** and **[docs/PATIENT-JOURNEY.md](docs/PATIENT-JOURNEY.md)**.

```bash
node scripts/export-catalogue-json.mjs
node scripts/sync-wp-tests.mjs
```

## 3. Phase 0 — category pages (Elementor)

See **[docs/PHASE0-ELEMENTOR.md](docs/PHASE0-ELEMENTOR.md)**.

Import each `integrate/elementor/coleebri-service-*.json` template, publish under e.g. `/en/tests/mens-health/`, add menu links.

## 4. Infomaniak production (`/catalogue/` on same server as WordPress)

Host the catalogue as **static files** beside WordPress (not inside WP). WordPress links and homepage iframes use the same origin.

### Upload

**Option A — rsync** (from your machine):

```bash
export COLEEBRI_DEPLOY_HOST='you@ssh.infomaniak.com'
export COLEEBRI_DEPLOY_PATH='/path/to/public_html/catalogue'
chmod +x scripts/deploy-infomaniak.sh
./scripts/deploy-infomaniak.sh
```

**Option B — FTP / Infomaniak File Manager:** copy repo root into `catalogue/` (exclude `.git`, `.env`, `wordpress-plugin/`, `export/`).

### Homepage iframe policy

Use iframes **only on the Elementor homepage** for:

- `widget=most-ordered` — featured tests
- `widget=categories` — browse by section

Snippets: [`integrate/elementor/homepage-embed-snippet.html`](integrate/elementor/homepage-embed-snippet.html).  
Service pages (`/en/tests/…`) link to catalogue deep URLs — **no** `widget=tests` iframes.

### Production cutover checklist

1. Upload this repo root (excluding `export/`, `.git`, `wordpress-plugin/`) to:

   ```text
   public_html/catalogue/
   ```

2. Verify:

   - `https://health.coleebri.com/catalogue/`
   - `https://health.coleebri.com/catalogue/embed/?widget=quiz&branding=none`

3. `wp-config.php`:

   ```php
   define( 'COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/' );
   ```

4. WordPress → **Settings → Permalinks → Save**.

5. Re-import Elementor service templates (`node scripts/generate-elementor-import.mjs`) — CTAs point at production catalogue, no test iframes.

6. Update header search popup — [docs/WP-SEARCH-POPUP.md](docs/WP-SEARCH-POPUP.md).

7. Run `node scripts/sync-wp-tests.mjs` after each `data.js` update.

Optional: `.github/workflows/deploy-production.yml` with SFTP secrets.

## 5. Legacy iframe embeds

Service pages should use **catalogue CTAs**, not `widget=tests` iframes. Hub widgets (quiz, glossary) may still use [docs/WEBSITE-EMBED.md](docs/WEBSITE-EMBED.md).

## Local dev

```bash
python3 -m http.server 9876
open "http://localhost:9876/"
```
