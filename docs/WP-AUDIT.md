# WordPress audit — 2026-05-29

Site: **Coleebri Health** — https://health.coleebri.com/en/

## Plugins (relevant)

| Plugin | Status | Notes |
|--------|--------|--------|
| **Coleebri Health Catalogue Embed** | **Not installed** | Required for `[coleebri_catalogue]` shortcodes |
| coleebri-health-catalogue (fat) | Not present | Good — avoid re-activating |
| **Elementor** (free) | **Inactive** | Activate for shortcode widget + imports |
| **Elementor Pro** | Active | Theme builder / Pro widgets |
| WooCommerce | Active | Legacy product grids on some pages |
| WordPress MCP | Inactive in UI | API still reachable for agents |

## Pages

- No published pages found with `coleebri_catalogue` shortcode yet.
- **blood-tests** (ID 990926) — WooCommerce product grid, not patient catalogue embed.
- Category pilot pages created via API — see slugs under `tests/` (mens-health, etc.).

## Configuration

- **`COLEEBRI_CATALOGUE_BASE`** — not readable via REST; set in `wp-config.php` to staging:
  ```php
  define( 'COLEEBRI_CATALOGUE_BASE', 'https://guillaumegual-hue.github.io/catalogue/' );
  ```
- Until the embed plugin is installed, Elementor **HTML** widgets can load the catalogue via `data-coleebri-embed` + script (see `integrate.html`).

## Actions required (human)

1. **Plugins → Add New → Upload** [`wordpress-plugin/coleebri-catalogue.zip`](../wordpress-plugin/coleebri-catalogue.zip) → Activate.
2. **Activate Elementor** (free) alongside Elementor Pro.
3. Add `COLEEBRI_CATALOGUE_BASE` in `wp-config.php` (above).
4. Open each new page in Elementor → **Regenerate CSS** if layout looks unstyled.

## Hosted catalogue

- Staging: https://guillaumegual-hue.github.io/catalogue/
- Production (later): https://health.coleebri.com/catalogue/
