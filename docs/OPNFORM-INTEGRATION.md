# OpnForm integration (Coleebri Health)

Patient interactions on **health.coleebri.com** use OpnForm at **https://app.coleebri.eu**. The catalogue iframe shows **test cards only**; Enquire, compare, and add-to-list run on the WordPress parent via `coleebri-wp-bridge.js`.

## Security

- **Never** commit API tokens to this repository or Elementor HTML.
- If a token was shared in chat or email, **revoke it** in OpnForm → Settings → API Access Tokens and create a new one with minimum abilities (`forms-read`, `forms-write` only for automation).
- Store secrets in `wp-config.php` or your host’s environment:

```php
define( 'COLEEBRI_OPNFORM_API_BASE', 'https://app.coleebri.eu/api' );
define( 'COLEEBRI_OPNFORM_TOKEN', 'paste-new-token-here' ); // server-side only
define( 'COLEEBRI_OPNFORM_PUBLIC_BASE', 'https://app.coleebri.eu' );
define( 'COLEEBRI_OPNFORM_ENQUIRY_SLUG', 'test-enquiry' );
define( 'COLEEBRI_OPNFORM_QUIZ_SLUG', 'help-me-choose' ); // optional
define( 'COLEEBRI_OPNFORM_WORKSPACE_ID', 1 );
```

Public pages only need `COLEEBRI_OPNFORM_PUBLIC_BASE` and slug constants (no Bearer token in the browser).

## Architecture

| Layer | Role |
|-------|------|
| Elementor | Titles, copy, Nav Menu, hub quiz embed (optional) |
| `coleebri-wp-bridge.js` | Compare drawer, shortlist, OpnForm modal, `postMessage` handler |
| Catalogue iframe | `data-display-only="1"` + `data-integrated="1"` → cards only |
| OpnForm | Submissions for test enquiry (and optional quiz) |

## Embed snippet (category pages)

```html
<div
  data-coleebri-embed="tests"
  data-coleebri-base="https://guillaumegual-hue.github.io/catalogue/"
  data-branding="none"
  data-site="https://health.coleebri.com/en"
  data-integrated="1"
  data-transparent="1"
  data-display-only="1"
  data-service="men"
  data-height="900"
></div>
<script src="https://guillaumegual-hue.github.io/catalogue/assets/coleebri-embed.js?v=20260531a" data-base="https://guillaumegual-hue.github.io/catalogue/"></script>
```

Install **Coleebri Health Catalogue Embed** plugin so `coleebri-wp-bridge.js` loads on pages with the embed or `[coleebri_catalogue]`.

## postMessage protocol (iframe → parent)

Origin must match configured hosts (`health.coleebri.com`, `guillaumegual-hue.github.io`).

| `type` | Payload | Parent action |
|--------|---------|---------------|
| `coleebri-enquire` | `{ test: { id, code, name, section, tracks, turnaround, price } }` | Open OpnForm modal with prefill |
| `coleebri-compare` | `{ action: 'toggle'|'clear', test? }` | Update compare list (max 3) |
| `coleebri-list` | `{ action: 'toggle'|'clear', test? }` | Update shortlist |
| `coleebri-open-quiz` | `{}` | Scroll/open hub quiz section |

## Test enquiry form (OpnForm)

**Suggested slug:** `test-enquiry`  
**Public URL:** `https://app.coleebri.eu/forms/test-enquiry`

Hidden / prefill field names (URL query prefill used by bridge):

| Query param | Purpose |
|-------------|---------|
| `test_id` | Catalogue test id |
| `test_code` | CLBR code |
| `test_name` | Display name |
| `source_page` | Parent page URL |
| `category` | Section or service slug |

Create via UI or run (with token in env only):

```bash
export COLEEBRI_OPNFORM_TOKEN='your-token'
export COLEEBRI_OPNFORM_API_BASE='https://app.coleebri.eu/api'
node scripts/opnform-create-enquiry-form.mjs
node scripts/opnform-inspect-form.mjs test-enquiry
```

Payload template: [`integrate/opnform/test-enquiry-payload.json`](integrate/opnform/test-enquiry-payload.json).

Map OpnForm field `name` attributes to the query keys above in the form builder if URL prefill does not apply automatically.

## Elementor popup (enquiry modal)

1. Templates → Popups → create **Test enquiry**.
2. Add HTML widget: `<div id="coleebri-opnform-mount" class="coleebri-opnform-mount"></div>`.
3. Set popup CSS id / class so bridge can open it, or rely on built-in `#coleebri-enquiry-modal` from the bridge script.
4. The bridge injects an iframe: `{publicBase}/forms/{slug}?test_name=…&test_code=…`

## Hub page (`/en/tests/`)

- Nav menu (category links).
- Optional: `[coleebri_catalogue widget="quiz" height="640" branding="none"]` for Help me choose (hub only).
- Compare bar appears automatically when the bridge script is loaded.

## Related docs

- [WP-INTEGRATION.md](WP-INTEGRATION.md) — Elementor layout and category URLs
- OpnForm API: https://docs.opnform.com/api-reference/introduction
