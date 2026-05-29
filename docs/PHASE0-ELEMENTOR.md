# Phase 0 — one WordPress page per service category

Adds **General Health**, **Women's**, **Men's**, **Sexual**, **Fitness & Allergies**, and **DNA** browse pages on top of your existing site. Uses your catalogue **test card UI** (not WooCommerce shop grids yet).

## Prerequisites

- [ ] Catalogue hosted (GitHub Pages or `/catalogue/` on server) — see [DEPLOY.md](../DEPLOY.md)
- [ ] **Elementor** (free) + **Elementor Pro** active
- [ ] Plugin **Coleebri Health Catalogue Embed** (`coleebri-catalogue.zip`) active — **not** `coleebri-health-catalogue`
- [ ] `COLEEBRI_CATALOGUE_BASE` in `wp-config.php` points at catalogue URL (trailing slash)
- [ ] Activate **Elementor** free if it is still inactive

## Pages to create

| Service (`service=`) | Suggested slug | Elementor template file | Shortcode (already in template) |
|----------------------|----------------|-------------------------|--------------------------------|
| `general` | `tests/general-health` | `integrate/elementor/coleebri-service-general.json` | `service="general"` |
| `women` | `tests/womens-health` | `coleebri-service-women.json` | `service="women"` |
| `men` | `tests/mens-health` | `coleebri-service-men.json` | `service="men"` |
| `sexual` | `tests/sexual-health` | `coleebri-service-sexual.json` | `service="sexual"` |
| `fitness` | `tests/fitness-allergies` | `coleebri-service-fitness.json` | `service="fitness"` |
| `dna` | `tests/dna` | `coleebri-service-dna.json` | `service="dna"` |

## Steps (repeat per category)

1. **Templates → Saved Templates → Import** — upload the JSON from `integrate/elementor/`.
2. **Pages → Add New** — open with Elementor.
3. **Folder icon → My Templates** — insert the imported template.
4. Set **title**, **slug**, and Yoast meta from `data.js` track blurbs (`window.TRACKS`).
5. **Publish**.

## Optional hub page

- Import `coleebri-catalogue-nav.json` or add shortcode:  
  `[coleebri_catalogue widget="tabs" height="140" branding="none"]`
- Parent menu **Health tests** → link to hub and each category page.

## Optional cross-links on each page

Below the grid, add a Shortcode widget:

```text
[coleebri_catalogue widget="tabs" height="140" branding="none"]
```

## Verify

1. Open the page on the front end (not only in Elementor preview).
2. Test cards load; filter matches category (e.g. men's tests on men's page).
3. No PHP white screen — if shortcode shows as plain text, embed plugin is inactive or `COLEEBRI_CATALOGUE_BASE` is wrong.

## Later (not Phase 0)

- **Specialist / GLxg** — add track in `data.js`, new template + page
- **WooCommerce sync** — CLI script; same card UI can read WC later
- **Single product checkout** — Elementor Theme Builder + WC widgets
