# OpnForm — test enquiry

Synced from data.js: **Category** → **Test** (with price). Re-run after data.js changes.

```bash
set -a && source .env && set +a
node scripts/opnform-update-enquiry-form.mjs 10
```

Logo: assets/coleebri-health-logo.svg (COLEEBRI_LOGO_URL to override).
