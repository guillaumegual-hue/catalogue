# UI parity checklist — test cards

Compare the same service (e.g. **men**) in three places:

1. **Full catalogue** — `Coleebri Patient Catalogue.html` with hash `#service=men`
2. **Embed** — https://guillaumegual-hue.github.io/catalogue/embed/?widget=tests&service=men&branding=none
3. **WordPress** — https://health.coleebri.com/en/tests/mens-health/ (after publish)

## Root cause (fixed in repo)

Embed loads only [`assets/coleebri-health-site.css`](../assets/coleebri-health-site.css). The full HTML file had **additional** test-card rules inline (grid, flex layout, button styles) that were missing or overridden in the shared CSS file.

## Checklist

| Item | Full catalogue | Embed | WP iframe |
|------|----------------|-------|-----------|
| Card grid 2-col ≥720px | | | |
| Card padding 22px / radius `--r-lg` | | | |
| Title size ~1.28rem, ink colour | | | |
| Sample chips colours | | | |
| Price size ~1.45rem bold | | | |
| Compare / cart / View buttons pill style | | | |
| Hover lift + border teal | | | |
| No duplicate embed header (`branding=none`) | n/a | | |

## Widget composition (optional)

Category pages use `widget=tests` only. For closer parity with the full app tab bar, add above the grid:

```text
[coleebri_catalogue widget="tabs" height="140" branding="none"]
```

Templates in `integrate/elementor/coleebri-service-*.json` include tabs + tests where noted.

## After CSS changes

1. Push to GitHub → wait for Pages deploy.
2. Hard-refresh embed URL (cache-bust `?v=` on assets).
3. Hard-refresh WordPress page.
