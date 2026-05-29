#!/usr/bin/env node
/**
 * Inspect OpnForm field names for prefill mapping.
 * Usage: node scripts/opnform-inspect-form.mjs <slug>
 */
import {
  getConfig,
  requireToken,
  apiFetch,
  extractForm,
  listWorkspaceForms,
} from './opnform-lib.mjs';

const cfg = getConfig();
requireToken(cfg.token);

let slug = process.argv[2] || process.env.COLEEBRI_OPNFORM_ENQUIRY_SLUG;
if (!slug) {
  console.error('Usage: node scripts/opnform-inspect-form.mjs <slug>');
  console.error('Or set COLEEBRI_OPNFORM_ENQUIRY_SLUG. List forms: node scripts/opnform-list-forms.mjs');
  process.exit(1);
}

let { res, data } = await apiFetch(`/open/forms/${encodeURIComponent(slug)}`, cfg);

if (res.status === 404 && /^\d+$/.test(slug)) {
  ({ res, data } = await apiFetch(`/open/forms/${slug}`, cfg));
}

if (res.status === 404) {
  console.error('404 — no form with slug:', slug);
  console.error('\nForms in workspace', cfg.workspaceId + ':');
  const forms = await listWorkspaceForms(cfg);
  for (const f of forms) {
    console.error(`  ${f.slug}\t${f.title}`);
  }
  process.exit(1);
}

if (!res.ok) {
  console.error(res.status, data);
  process.exit(1);
}

const form = extractForm(data) || data;
console.log('Title:', form.title);
console.log('Slug:', form.slug);
console.log('ID:', form.id);
console.log('Fields:');
for (const p of form.properties || []) {
  console.log(`  - id=${p.id} name=${p.name} type=${p.type} hidden=${!!p.hidden}`);
}
console.log('');
console.log('URL prefill example (query keys = field `name`):');
console.log(
  `  ${cfg.publicBase}/forms/${form.slug}?test_name=Example&test_code=CLBR-001&source_page=${encodeURIComponent('https://health.coleebri.com/en/tests/mens-health/')}`
);
