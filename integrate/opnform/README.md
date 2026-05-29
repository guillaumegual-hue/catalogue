# OpnForm form definitions

| Form | Slug (default) | Payload |
|------|----------------|---------|
| Test enquiry | `test-enquiry` | [test-enquiry-payload.json](test-enquiry-payload.json) |

Create in the OpnForm UI or run (never commit the token):

```bash
export COLEEBRI_OPNFORM_TOKEN='your-token'
export COLEEBRI_OPNFORM_API_BASE='https://app.coleebri.eu/api'
node scripts/opnform-list-forms.mjs
node scripts/opnform-create-enquiry-form.mjs
# if slug still missing: node scripts/opnform-create-enquiry-form.mjs --verbose
node scripts/opnform-inspect-form.mjs <slug-from-list-or-create>
```

Each property block **must** have a UUID `id` and an OpnForm `type` (`short_text`, `email`, `phone_number`, `long_text`). The create script adds missing ids automatically.

If inspect returns 404, the slug is wrong — run `node scripts/opnform-list-forms.mjs` first.

Hidden fields use `name` values `test_name`, `test_code`, `test_id`, `source_page`, `category` for URL prefill (see [coleebri-wp-bridge.js](../../assets/coleebri-wp-bridge.js)).
