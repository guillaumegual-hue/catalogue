#!/usr/bin/env node
/**
 * Apply Coleebri theme CSS to an OpnForm enquiry form (form-level Custom Code).
 *
 * Usage:
 *   node scripts/opnform-apply-theme.mjs          # auto-picks latest test enquiry form
 *   node scripts/opnform-apply-theme.mjs 8      # numeric id from opnform-list-forms.mjs
 *   node scripts/opnform-apply-theme.mjs my-slug
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  apiFetch,
  extractForm,
  findEnquiryForm,
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

let ref = process.argv[2] || process.env.COLEEBRI_OPNFORM_ENQUIRY_ID || process.env.COLEEBRI_OPNFORM_ENQUIRY_SLUG;

const themeCss = readFileSync(join(root, 'assets/opnform-coleebri-theme.css'), 'utf8');

async function loadForm() {
  if (!ref) {
    const forms = await listWorkspaceForms(cfg);
    const pick = findEnquiryForm(forms);
    if (!pick?.id) {
      console.error('No test enquiry form found. Create one first:\n');
      console.error('  node scripts/opnform-create-enquiry-form.mjs');
      console.error('  node scripts/opnform-list-forms.mjs');
      console.error('  node scripts/opnform-apply-theme.mjs 8   # use real id, not <NEW_ID>');
      process.exit(1);
    }
    console.log('Using form id=%s slug=%s (%s)', pick.id, pick.slug, pick.title);
    ref = String(pick.id);
  }

  const idArg = /^\d+$/.test(ref) ? ref : undefined;
  try {
    return await getForm(cfg, { slug: idArg ? undefined : ref, id: idArg });
  } catch (e) {
    if (!idArg && /test-enquiry/i.test(ref)) {
      const forms = e.forms || (await listWorkspaceForms(cfg));
      const pick = findEnquiryForm(forms);
      if (pick?.id) {
        console.log('Slug stale; using id=%s (%s)', pick.id, pick.title);
        return getForm(cfg, { id: String(pick.id) });
      }
    }
    throw e;
  }
}

let form;
try {
  form = await loadForm();
} catch (e) {
  console.error(e.message || e);
  if (e.forms?.length) {
    console.error('\nForms in workspace', cfg.workspaceId + ':');
    for (const f of e.forms) {
      console.error(`  id=${f.id}\tslug=${f.slug}\t${f.title}`);
    }
  }
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
  custom_css: themeCss,
};

const path = formUpdatePath(form);
let { res, data } = await apiFetch(path, { ...cfg, method: 'PUT', body });

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
