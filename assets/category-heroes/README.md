# Category hero images

Optional banner images for `/tests/{slug}/` pages.

| File | Page |
|------|------|
| `dna.webp` | `/tests/dna/` |
| `{slug}.webp` | `/tests/{slug}/` |

**Specs:** ~1200×480px (or 2:1), WebP or JPG, &lt; 200 KB if possible.

If a file is missing, a themed gradient placeholder is shown instead.

**Copy** is edited in `scripts/category-heroes-data.mjs`, then run:

```bash
node scripts/generate-category-heroes.mjs
node scripts/generate-category-pages.mjs
```
