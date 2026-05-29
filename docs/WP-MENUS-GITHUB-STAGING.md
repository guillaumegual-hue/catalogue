# WordPress menu links — GitHub Pages (testing)

Each row is a **different URL** (own folder under `/catalogue/tests/`).  
Use **Custom link** in Appearance → Menus. Do not use hash-only links on the main HTML file.

Base for staging:

```text
https://guillaumegual-hue.github.io/catalogue/
```

Regenerate pages after `data.js` changes:

```bash
node scripts/generate-category-pages.mjs
```

---

## Main menu (copy each URL exactly)

| Menu label | URL |
|------------|-----|
| **All tests** | https://guillaumegual-hue.github.io/catalogue/tests/all-tests/ |
| **General health** | https://guillaumegual-hue.github.io/catalogue/tests/general-health/ |
| **Women's health** | https://guillaumegual-hue.github.io/catalogue/tests/womens-health/ |
| **Men's health** | https://guillaumegual-hue.github.io/catalogue/tests/mens-health/ |
| **Sexual health** | https://guillaumegual-hue.github.io/catalogue/tests/sexual-health/ |
| **Fitness & wellbeing** | https://guillaumegual-hue.github.io/catalogue/tests/fitness-wellbeing/ |
| **Allergies & sensitivities** | https://guillaumegual-hue.github.io/catalogue/tests/allergies/ |
| **DNA tests** | https://guillaumegual-hue.github.io/catalogue/tests/dna/ |
| **Phlebotomy & collection** | https://guillaumegual-hue.github.io/catalogue/tests/phlebotomy-collection/ |

---

## Extra sections (optional submenu)

| Menu label | URL |
|------------|-----|
| Paternity & DNA | https://guillaumegual-hue.github.io/catalogue/tests/paternity-dna/ |
| Health profiles & screens | https://guillaumegual-hue.github.io/catalogue/tests/health-profiles/ |
| Routine tests | https://guillaumegual-hue.github.io/catalogue/tests/routine-tests/ |
| Autoimmune profiles | https://guillaumegual-hue.github.io/catalogue/tests/autoimmune/ |
| Vitamins & minerals | https://guillaumegual-hue.github.io/catalogue/tests/vitamins-minerals/ |
| Specific requests | https://guillaumegual-hue.github.io/catalogue/tests/specific-requests/ |

---

## Information

| Menu label | URL |
|------------|-----|
| Patient information | https://guillaumegual-hue.github.io/catalogue/tests/patient-information/ |
| Full catalogue (search & quiz) | https://guillaumegual-hue.github.io/catalogue/Coleebri%20Patient%20Catalogue.html |
| Category index (hub) | https://guillaumegual-hue.github.io/catalogue/tests/ |

---

## Homepage iframes (not menu items)

See [homepage-embed-snippet.html](../integrate/elementor/homepage-embed-snippet.html) — use `guillaumegual-hue.github.io` as `data-coleebri-base`.

---

## After Infomaniak production

Replace host in every URL:

`guillaumegual-hue.github.io/catalogue` → `health.coleebri.com/catalogue`

Paths stay the same: `/tests/mens-health/`, etc.

Machine-readable list: [`tests/urls.json`](../tests/urls.json) (generated).
