# WooCommerce sunset — patient blood test catalogue

The patient catalogue (`data.js` + React app) replaces WooCommerce for **browse, compare, and enquire**. Future ecommerce should extend the catalogue stack, not WC products.

## What to remove on WordPress

| Item | Action |
|------|--------|
| WC product grid on `blood-tests` and similar | Replace with homepage embeds + catalogue links |
| Syncing catalogue rows to WC products | **Stop** — use `node scripts/sync-wp-tests.mjs` → `coleebri_test` CPT |
| Shop archives for patient tests | Redirect to `/catalogue/` or relevant `#service=` hash |

## What to keep (for now)

- WooCommerce plugin if other non-catalogue products exist
- Payment plugins unrelated to the 91-test patient list

## Enquire flow (current)

- **Catalogue Request modal** on `health.coleebri.com/catalogue/`
- Email: health@coleebri.com
- No cart checkout on WC for catalogue tests

## Redirects (when ready)

Example (Redirection plugin or `.htaccess`):

| Old | New |
|-----|-----|
| `/en/blood-tests/` | `/catalogue/Coleebri%20Patient%20Catalogue.html` |
| `/en/product/{legacy-slug}/` | Matching `#test={CLBR_ID}` or `/blood-test/{slug}/` CPT URL |

Map legacy product slugs manually once — do not auto-import 91 products again.

## Future commerce

Planned on catalogue + API layer: appointments, baskets, Stripe, etc.  
Single source of truth remains `data.js` / Excel export in this repo.

See [PATIENT-JOURNEY.md](PATIENT-JOURNEY.md).
