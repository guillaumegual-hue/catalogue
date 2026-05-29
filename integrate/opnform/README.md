# OpnForm form definitions

| Form | Slug (default) | Payload |
|------|----------------|---------|
| Test enquiry | `test-enquiry` | [test-enquiry-payload.json](test-enquiry-payload.json) |

Create in the OpnForm UI or run `node scripts/opnform-create-enquiry-form.mjs` with `COLEEBRI_OPNFORM_TOKEN` set locally (never in git).

After creation, run `node scripts/opnform-inspect-form.mjs test-enquiry` and align hidden field `name` values with URL prefill keys in [coleebri-wp-bridge.js](../../assets/coleebri-wp-bridge.js) (`test_name`, `test_code`, `test_id`, `source_page`, `category`).
