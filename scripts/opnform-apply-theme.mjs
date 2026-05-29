#!/usr/bin/env node
/**
 * Apply Coleebri theme CSS to an OpnForm enquiry form (form-level Custom Code).
 * Usage: COLEEBRI_OPNFORM_TOKEN='…' node scripts/opnform-apply-theme.mjs [slug-or-id]
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  apiFetch,
  extractForm,
  formUpdatePath,
  getConfig,
  getForm,
  listWorkspaceForms,
  requireToken,
} from './opnform-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const cfg = getConfig();
requireToken(cfg.token);

const ref =
  process.argv[2] ||
  process.env.COLEEBRI_OPNFORM_ENQUIRY_SLUG ||
  process.env.COLEEBRI_OPNFORM_ENQUIRY_ID ||
  'test-enquiry-coleebri-health-nlsubd';

const themeCss = readFileSync(join(root, 'assets/opnform-coleebri-theme.css'), 'utf8');

let form;
try {
  const idArg = /^\d+$/.test(ref) ? ref : undefined;
  form = await getForm(cfg, { slug: idArg ? undefined : ref, id: idArg });
} catch (e) {
  console.error(e.message || e);
  if (e.forms?.length) {
    console.error('\nForms in workspace', cfg.workspaceId + ':');
    for (const f of e.forms) {
      console.error(`  id=${f.id}\tslug=${f.slug}\t${f.title}`);
    }
  }
  console.error('\nTry: node scripts/opnform-list-forms.mjs');
  process.exit(1);
}

if (!form?.properties?.length) {
  console.error('Form has no properties — open it in OpnForm and add fields first.');
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

let path = formUpdatePath(form);
let { res, data } = await apiFetch(path, { ...cfg, method: 'PUT', body });

if (!res.ok && body.custom_code) {
  const fallback = { ...body };
  delete fallback.custom_code;
  fallback.custom_css = themeCss;
  ({ res, data } = await apiFetch(path, { ...cfg, method: 'PUT', body: fallback }));
}

if (!res.ok) {
  console.error('PUT form failed', res.status, data);
  console.error('Paste assets/opnform-coleebri-theme.css in Workspace → Custom Code → Custom CSS.');
  process.exit(1);
}

const updated = extractForm(data) || form;
console.log('Updated form id:', updated.id ?? form.id);
console.log('Slug:', updated.slug ?? form.slug);
console.log('Public URL:', `${cfg.publicBase}/forms/${updated.slug ?? form.slug}`);
console.log('Applied: color #00889a, no_branding, custom CSS.');
