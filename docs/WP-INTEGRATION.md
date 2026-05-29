# WordPress integration (native feel)

Category pages use **one iframe** (`widget=tests` only) — no duplicate “Coleebri Health / Open full catalogue” bar and no in-page tab strip. Use your **site menu** to move between `/en/tests/…` pages.

## How it works

- **Catalogue assets** load from GitHub Pages (or `/catalogue/` on your server later).
- **`data-site="https://health.coleebri.com/en"`** + **`data-integrated="1"`** on the embed tell the iframe to:
  - Hide embed chrome (`branding=none`)
  - Keep **Enquire** on the site (`mailto:` opens from the parent window, not GitHub)
  - Block navigation to `github.io/catalogue` HTML pages

## Page URLs

| Category | Path |
|----------|------|
| Hub | `/en/tests/` |
| General | `/en/tests/general-health/` |
| Women's | `/en/tests/womens-health/` |
| Men's | `/en/tests/mens-health/` |
| Sexual | `/en/tests/sexual-health/` |
| Fitness & allergies | `/en/tests/fitness-allergies/` |
| DNA | `/en/tests/dna/` |

## Optional: full catalogue on your domain

For the **exact** full patient catalogue (search, all tabs in one view), host static files at `https://health.coleebri.com/catalogue/` and either:

- Link menu items to that URL, or
- Use one WP page with `[coleebri_catalogue widget="catalogue" height="920" branding="none"]` after `COLEEBRI_CATALOGUE_BASE` points at your domain.

Category pages are intentionally **lighter** — same test cards, your theme header/footer.

## Plugin shortcode

```text
[coleebri_catalogue widget="tests" service="men" height="900" branding="none"]
```

Set in `wp-config.php`:

```php
define( 'COLEEBRI_CATALOGUE_BASE', 'https://guillaumegual-hue.github.io/catalogue/' );
```

When the catalogue moves to your server, change that URL only.
