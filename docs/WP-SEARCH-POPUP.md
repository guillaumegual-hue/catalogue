# Header search popup (Elementor #2949)

WordPress search only finds content in the database. After installing the **Coleebri Health Catalogue** plugin and running `sync-wp-tests.mjs`, blood tests appear as `coleebri_test` posts.

## Recommended popup layout

1. **Search widget** (Elementor or theme)  
   - Searches **pages + coleebri_test** (default WP search includes all public post types).  
   - Result links go to `/en/blood-test/{slug}/` (plugin single template).

2. **Secondary link** (text or button below search)  
   - Label: **Search all tests in the catalogue**  
   - URL: `https://health.coleebri.com/catalogue/Coleebri%20Patient%20Catalogue.html`  
   - (Use staging URL until production cutover.)

3. **Do not** rely on iframe `widget=tests` for search — that content is not indexed.

## Snippet (HTML widget in popup)

See [`integrate/elementor/search-popup-snippet.html`](../integrate/elementor/search-popup-snippet.html).

## After catalogue sync

- Search **HbA1c**, **CLBR-NP059**, or test name → should return `coleebri_test` rows.  
- Open result → **View in catalogue & enquire** → full app with Request modal.

## JetSearch / SearchWP

If you use a premium search plugin, add `coleebri_test` to the indexed post types and re-index after each sync.

## Popup trigger

The header icon uses Elementor popup **ID 2949** (`#elementor-action:action=popup:open`). Edit that template in **Templates → Popups**.
