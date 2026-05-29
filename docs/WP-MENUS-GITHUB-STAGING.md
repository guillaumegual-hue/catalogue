# WordPress menu links — GitHub Pages (testing)

Each row is a **unique URL** under `/catalogue/tests/{slug}/`.  
Use **Custom link** in Appearance → Menus. Do not use hash links on the main HTML file.

**Staging base:** `https://guillaumegual-hue.github.io/catalogue/`  
**Production base:** `https://health.coleebri.com/catalogue/` (same paths)

Regenerate after changes:

```bash
node scripts/generate-category-pages.mjs
```

Machine-readable list: [`tests/urls.json`](../tests/urls.json)

---

## Test categories

| Menu label | Staging URL |
|------------|-------------|
| All tests | https://guillaumegual-hue.github.io/catalogue/tests/all-tests/ |
| General health | https://guillaumegual-hue.github.io/catalogue/tests/general-health/ |
| Women's health | https://guillaumegual-hue.github.io/catalogue/tests/womens-health/ |
| Men's health | https://guillaumegual-hue.github.io/catalogue/tests/mens-health/ |
| Sexual health | https://guillaumegual-hue.github.io/catalogue/tests/sexual-health/ |
| Fitness & wellbeing | https://guillaumegual-hue.github.io/catalogue/tests/fitness-wellbeing/ |
| Allergies & sensitivities | https://guillaumegual-hue.github.io/catalogue/tests/allergies/ |
| Paternity & DNA | https://guillaumegual-hue.github.io/catalogue/tests/dna/ |
| Phlebotomy & collection | https://guillaumegual-hue.github.io/catalogue/tests/phlebotomy-collection/ |
| Health profiles & screens | https://guillaumegual-hue.github.io/catalogue/tests/health-profiles/ |
| Routine tests | https://guillaumegual-hue.github.io/catalogue/tests/routine-tests/ |
| Autoimmune profiles | https://guillaumegual-hue.github.io/catalogue/tests/autoimmune/ |
| Vitamins & minerals | https://guillaumegual-hue.github.io/catalogue/tests/vitamins-minerals/ |
| Specific requests | https://guillaumegual-hue.github.io/catalogue/tests/specific-requests/ |

---

## Tools & glossary

| Menu label | Staging URL |
|------------|-------------|
| Biomarker glossary (EN) | https://guillaumegual-hue.github.io/catalogue/tests/glossary/ |
| **Glossaire** (FR) | https://guillaumegual-hue.github.io/catalogue/tests/glossaire/ |
| Check a marker | https://guillaumegual-hue.github.io/catalogue/tests/marker-check/ |

---

## Information & hub

| Menu label | Staging URL |
|------------|-------------|
| Patient information | https://guillaumegual-hue.github.io/catalogue/tests/patient-information/ |
| Full catalogue (search, compare, quiz) | https://guillaumegual-hue.github.io/catalogue/ |
| Category index (all links) | https://guillaumegual-hue.github.io/catalogue/tests/ |
| Exit to main site | https://health.coleebri.com/en/ |

---

## Production URLs (Infomaniak)

Replace `guillaumegual-hue.github.io/catalogue` with `health.coleebri.com/catalogue` in every URL above.

Example glossaire: `https://health.coleebri.com/catalogue/tests/glossaire/`

---

## Homepage iframes (not menu items)

See [homepage-embed-snippet.html](../integrate/elementor/homepage-embed-snippet.html).
