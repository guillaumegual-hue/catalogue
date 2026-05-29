# Category hero images

Banner images for `/tests/{slug}/` pages, synced from the **WordPress media library** on health.coleebri.com.

## Refresh from media gallery

```bash
node scripts/fetch-category-hero-images.mjs
node scripts/generate-category-heroes.mjs
node scripts/generate-category-pages.mjs
```

Optional: try to read hero images from live Elementor pages (when the site is up):

```bash
node scripts/fetch-category-hero-images.mjs --scrape-pages
```

## Override a mapping

Edit `scripts/category-hero-media-map.mjs` (`wpMediaUrl` per slug), then re-run the fetch script.

Source URLs are recorded in `manifest.json` after each fetch.

## Specs

~1200×480px (2:1) recommended. JPG/PNG/WebP. Large files (&gt;500 KB) can be compressed before commit.
