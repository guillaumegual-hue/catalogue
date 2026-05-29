# Infomaniak + WordPress — operator checklist

Run in order after pulling latest `main`.

## 1. Deploy catalogue

```bash
chmod +x scripts/deploy-infomaniak.sh
export COLEEBRI_DEPLOY_HOST='you@ssh.infomaniak.com'
export COLEEBRI_DEPLOY_PATH='/path/to/public_html/catalogue'
./scripts/deploy-infomaniak.sh
```

Or upload via File Manager. Paste [`integrate/wp-config-snippet.php`](../integrate/wp-config-snippet.php) into `wp-config.php`.

Verify:

- https://health.coleebri.com/catalogue/Coleebri%20Patient%20Catalogue.html
- https://health.coleebri.com/catalogue/embed/?widget=most-ordered

## 2. Homepage embeds

Paste [`integrate/elementor/homepage-embed-snippet.html`](../integrate/elementor/homepage-embed-snippet.html) into two Elementor HTML widgets on the **homepage**. Remove WooCommerce product grids from home.

## 3. Menus + service pages

- Menus: [WP-MENUS.md](WP-MENUS.md)
- Re-import `integrate/elementor/coleebri-service-*.json` if CTAs are stale (`node scripts/generate-elementor-import.mjs`)

## 4. Plugin + search

```bash
node scripts/build-wp-plugin-zip.mjs
# Upload zip → Plugins → Activate
node scripts/sync-wp-tests.mjs --dry-run
node scripts/sync-wp-tests.mjs
```

Search popup #2949: [WP-SEARCH-POPUP.md](WP-SEARCH-POPUP.md)

## 5. WooCommerce

[WOOCOMMERCE-SUNSET.md](WOOCOMMERCE-SUNSET.md) — stop using WC for patient test catalogue.
