#!/usr/bin/env node
/**
 * Apply Coleebri theme CSS to an OpnForm enquiry form (form-level Custom Code).
 * Usage: COLEEBRI_OPNFORM_TOKEN='…' node scripts/opnform-apply-theme.mjs [slug]
 *
 * Token: same as wp-config COLEEBRI_OPNFORM_TOKEN (forms-write).
 * Default slug: COLEEBRI_OPNFORM_ENQUIRY_SLUG or test-enquiry-coleebri-health-nlsubd
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  apiFetch,
  extractForm,
  getConfig,
  listWorkspaceForms,
  requireToken,
} from './opnform-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const cfg = getConfig();
requireToken(cfg.token);

const slug =
  process.argv[2] ||
  process.env.COLEEBRI_OPNFORM_ENQUIRY_SLUG ||
  'test-enquiry-coleebri-health-nlsubd';

const themeCss = readFileSync(join(root, 'assets/opnform-coleebri-theme.css'), 'utf8');

let { res, data } = await apiFetch(`/open/forms/${encodeURIComponent(slug)}`, cfg);
if (res.status === 404 && /^\d+$/.test(slug)) {
  ({ res, data } = await apiFetch(`/open/forms/${slug}`, cfg));
}
if (!res.ok) {
  console.error('GET form failed', res.status, data);
  process.exit(1);
}

const form = extractForm(data);
if (!form?.properties?.length) {
  console.error('Could not load form properties for', slug);
  process.exit(1);
}

const body = {
  title: form.title,
  visibility: form.visibility || 'public',
  language: form.language || 'en',
  theme: form.theme || 'default',
  presentation_style: form.presentation_style || 'classic',
  dark_mode: form.dark_mode || 'auto',
  color: '#00889a',
  width: form.width || 'centered',
  size: form.size || 'md',
  border_radius: form.border_radius || 'small',
  uppercase_labels: form.uppercase_labels ?? false,
  no_branding: true,
  transparent_background: form.transparent_background ?? true,
  submit_button_text: form.submit_button_text || 'Send enquiry',
  properties: form.properties,
  custom_code: {
    css: themeCss,
    javascript: form.custom_code?.javascript || '',
  },
};

({ res, data } = await apiFetch(`/open/forms/${encodeURIComponent(form.slug || slug)}`, {
  ...cfg,
  method: 'PUT',
  body,
}));

if (!res.ok) {
  console.error('PUT form failed', res.status, data);
  console.error('If custom_code is rejected, paste assets/opnform-coleebri-theme.css in Workspace → Custom Code.');
  process.exit(1);
}

const updated = extractForm(data) || form;
console.log('Updated form:', updated.slug || slug);
console.log('Public URL:', `${cfg.publicBase}/forms/${updated.slug || slug}`);
console.log('Design: color #00889a, no_branding, classic, form custom CSS applied.');
