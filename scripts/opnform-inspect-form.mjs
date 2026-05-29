#!/usr/bin/env node
/**
 * Inspect OpnForm field names for prefill mapping.
 * Usage: node scripts/opnform-inspect-form.mjs test-enquiry
 */
const slug = process.argv[2] || process.env.COLEEBRI_OPNFORM_ENQUIRY_SLUG;
if (!slug) {
  console.error('Usage: node scripts/opnform-inspect-form.mjs <slug>');
  console.error('Or set COLEEBRI_OPNFORM_ENQUIRY_SLUG. List forms: node scripts/opnform-list-forms.mjs');
  process.exit(1);
}
const token = process.env.COLEEBRI_OPNFORM_TOKEN;
const apiBase = (process.env.COLEEBRI_OPNFORM_API_BASE || 'https://app.coleebri.eu/api').replace(/\/$/, '');

if (!token) {
  console.error('Set COLEEBRI_OPNFORM_TOKEN');
  process.exit(1);
}

const res = await fetch(`${apiBase}/open/forms/${encodeURIComponent(slug)}`, {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
});
const data = await res.json();
if (!res.ok) {
  console.error(res.status, data);
  process.exit(1);
}

const form = data.data || data;
console.log('Title:', form.title);
console.log('Slug:', form.slug);
console.log('Fields:');
for (const p of form.properties || []) {
  console.log(`  - id=${p.id} name=${p.name} type=${p.type} hidden=${!!p.hidden}`);
}
console.log('');
console.log('URL prefill example (hidden fields use `name` as query key):');
console.log(`  ${(process.env.COLEEBRI_OPNFORM_PUBLIC_BASE || 'https://app.coleebri.eu').replace(/\/$/, '')}/forms/${slug}?test_name=Example&test_code=CLBR-001`);
