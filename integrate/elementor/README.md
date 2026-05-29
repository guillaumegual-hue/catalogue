# Elementor import pack — Coleebri Patient Catalogue

Pre-built **Elementor page templates** and a **WordPress XML** export so you can import catalogue embed pages without building them by hand.

## Before you import

1. Upload the catalogue folder to your server (e.g. `https://health.coleebri.com/catalogue/`).
2. Install the shortcode plugin: copy `integrate/coleebri-catalogue.php` into `wp-content/plugins/coleebri-catalogue/` and activate it.
3. In `wp-config.php` (recommended):

```php
define('COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/');
```

4. Regenerate this pack after changing widgets (optional):

```bash
node scripts/generate-elementor-import.mjs
```

---

## Option A — Import Elementor templates (recommended)

Each `.json` file is one page layout with **Shortcode** widgets already configured.

1. In WordPress: **Templates → Saved Templates** (or **Elementor → My Templates**).
2. **Import Templates** → upload one or more files from this folder, e.g. `coleebri-service-men.json`.
3. Create a new page in Elementor → **Folder icon** → **My Templates** → insert the imported template.
4. Publish. Repeat for each service/section page you need.

| File | Page purpose |
|------|----------------|
| `coleebri-catalogue-home.json` | Most ordered + categories + quiz |
| `coleebri-full-catalogue.json` | Full catalogue iframe |
| `coleebri-service-men.json` | Men's health test grid |
| `coleebri-service-women.json` | Women's health |
| `coleebri-service-general.json` | General health |
| `coleebri-service-sexual.json` | Sexual health |
| `coleebri-service-fitness.json` | Fitness & allergies |
| `coleebri-service-dna.json` | DNA tests |
| `coleebri-section-paternity.json` | Paternity section |
| `coleebri-section-profiles.json` | Health profiles |
| `coleebri-section-allergies.json` | Allergies |
| `coleebri-collection.json` | Phlebotomy & collection |
| `coleebri-patient-info.json` | Patient information |
| `coleebri-laboratories.json` | Laboratories / accreditation |
| `coleebri-glossary.json` | Biomarker glossary |
| `coleebri-marker-check.json` | Check a marker |
| `coleebri-catalogue-nav.json` | Category tab navigation |

See `manifest.json` for the full list.

**Elementor tips**

- Use **stretch section** / full-width container for test grids.
- If shortcodes show as plain text, the plugin is not active or `COLEEBRI_CATALOGUE_BASE` is wrong.
- Your theme (e.g. Vamtam) global colours apply to headings; embed UI uses catalogue CSS inside the iframe.

---

## Option B — Import WordPress pages (XML)

`coleebri-catalogue-pages.xml` creates **draft pages** with shortcodes in the post body.

1. **Tools → Import → WordPress** (install importer if needed).
2. Upload `coleebri-catalogue-pages.xml`.
3. Assign authors, import.
4. Edit each page with Elementor and replace content with the matching template from Option A, **or** add a Shortcode widget containing the shortcode from the page body.

This XML does **not** include Elementor layout data — use Option A for proper Elementor structure.

---

## Option C — Snippet builder (custom pages)

`integrate.html` on your hosted catalogue generates HTML, iframe, and shortcode snippets for any widget/filter combination.

---

## Limitations

- Templates use the **Shortcode** widget — requires `coleebri-catalogue.php`.
- They do **not** include your theme hero, header, or Vamtam sections; import into your existing page designs or merge manually.
- **Elementor Kit** (full site zip) is not included — only individual page templates.
- ICO / company registration placeholders in legal copy remain in the catalogue app, not in these templates.

---

## Support

health@coleebri.com
