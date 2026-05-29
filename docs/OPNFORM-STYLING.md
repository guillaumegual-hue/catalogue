# OpnForm styling — Coleebri Health (self-hosted pilot)

Style enquiry forms on **https://app.coleebri.eu** to match the patient catalogue and **health.coleebri.com**. This phase is **forms only** — catalogue embeds still use **mailto** for Enquire until you pass the visual QA below.

## Files

| File | Purpose |
|------|---------|
| [`assets/opnform-coleebri-theme.css`](../assets/opnform-coleebri-theme.css) | Workspace CSS to copy into OpnForm |
| [`assets/coleebri-health-site.css`](../assets/coleebri-health-site.css) | Design tokens (Poppins, Work Sans, `#00889a`) |

## 1. Apply theme CSS

### Option A — API (recommended if you have the token)

From `wp-config.php` use `COLEEBRI_OPNFORM_TOKEN` (never commit it):

```bash
export COLEEBRI_OPNFORM_TOKEN='your-token'
export COLEEBRI_OPNFORM_API_BASE='https://app.coleebri.eu/api'
export COLEEBRI_OPNFORM_ENQUIRY_SLUG='test-enquiry-coleebri-health-nlsubd'  # or use id: 9
node scripts/opnform-list-forms.mjs    # if 404, confirm id/slug here
node scripts/opnform-apply-theme.mjs   # or: node scripts/opnform-apply-theme.mjs 9
```

**Form missing from list?** Create it first:

```bash
node scripts/opnform-create-enquiry-form.mjs
node scripts/opnform-apply-theme.mjs <id-from-list>
```

**404 on apply?** Use an **id** from `opnform-list-forms.mjs` (id `9` only works if that form still exists in workspace 1).

This sets form colour `#00889a`, **no branding**, Classic layout, and pastes [`assets/opnform-coleebri-theme.css`](../assets/opnform-coleebri-theme.css) into the form’s **Custom Code → CSS**.

### Option B — Manual (workspace-wide)

1. Log in to **app.coleebri.eu**.
2. Open your **workspace** → **Settings** → **Custom Code** → **Custom CSS**.
3. Paste all of `assets/opnform-coleebri-theme.css` → **Save** (raw CSS only — no `<style>` tags).

Custom CSS applies on the **public form URL**, not in the editor. Open the live form link to preview.

If styles do not appear:

- Confirm the form is served on **app.coleebri.eu** (custom domain).
- Hard-refresh the public page (cache).
- Increase specificity or add `!important` in the repo file, then re-paste.

## 2. Configure the test enquiry form

Use your existing form (e.g. slug `test-enquiry-coleebri-health-nlsubd`) or create a new one.

### Design

| Setting | Value |
|---------|--------|
| Presentation | **Classic** (all fields on one scrollable page) |
| Width | Centered |
| Primary colour | `#00889a` |
| Logo | Coleebri Health logo (same as site) |
| Remove branding | **On** |

### Recommended fields

| Field | Type | `name` (for later URL prefill) |
|-------|------|-------------------------------|
| Name | Short text | — |
| Email | Email | — |
| Phone | Phone | — |
| Message | Long text | — |
| Test name | Hidden or short text | `test_name` |
| Test code | Hidden or short text | `test_code` |
| Test ID | Hidden or short text | `test_id` |
| Source page | Hidden or short text | `source_page` |
| Category | Hidden or short text | `category` |

Form-level **Custom Code** can stay empty if workspace CSS is enough.

## 3. Visual QA checklist

Open the **public form URL** beside a category page (e.g. `https://health.coleebri.com/en/tests/mens-health/`) at the same zoom.

- [ ] Body text uses **Work Sans**; headings use **Poppins**
- [ ] Primary button / submit is **#00889a**; hover is darker teal (`#006d7b`)
- [ ] Page background is **#fafafa**; inputs are white with subtle teal border
- [ ] Border radius on inputs/buttons is ~**12px**, not sharp defaults
- [ ] No **“Powered by OpnForm”** visible
- [ ] Form would look acceptable inside an **Elementor popup** (phase 2)

## 4. Maintenance

After upgrading OpnForm:

1. Re-open the public enquiry form and run the QA checklist.
2. If layout breaks, inspect elements in DevTools, update [`assets/opnform-coleebri-theme.css`](../assets/opnform-coleebri-theme.css), commit, re-paste into workspace Custom CSS.

## Phase 2 (not in this pilot)

When the form passes QA:

- Wire catalogue **Enquire** → OpnForm modal with URL prefill (`test_name`, `test_code`, …)
- Restore parent-page bridge (see git history for `coleebri-wp-bridge.js`)

Until then, integrated catalogue embeds keep **mailto:health@coleebri.com** — see [WEBSITE-EMBED.md](WEBSITE-EMBED.md).

## Reference

- OpnForm custom CSS: https://help.opnform.com/en/article/can-i-style-my-form-with-some-css-code-1v3dlr9/
- Enquiries: health@coleebri.com
