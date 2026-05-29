#!/usr/bin/env node
/**
 * Repair enquiry form fields + design (OpnForm 1.x uses type "text", not short_text).
 * Usage: source .env && node scripts/opnform-update-enquiry-form.mjs [form-id]
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  apiFetch,
  extractForm,
  formUpdatePath,
  getConfig,
  getForm,
  requireToken,
} from './opnform-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = getConfig();
requireToken(cfg.token);

const formId = process.argv[2] || process.env.COLEEBRI_OPNFORM_ENQUIRY_ID || '10';
const patch = JSON.parse(
  readFileSync(join(root, 'integrate/opnform/test-enquiry-payload.json'), 'utf8')
);

const existing = await getForm(cfg, { id: String(formId) });
const themeCss = readFileSync(join(root, 'assets/opnform-coleebri-theme.css'), 'utf8');

const body = {
  title: patch.title,
  visibility: existing.visibility || patch.visibility,
  language: existing.language || patch.language,
  theme: patch.theme,
  presentation_style: patch.presentation_style,
  dark_mode: patch.dark_mode,
  color: patch.color,
  width: patch.width,
  size: patch.size,
  border_radius: 'full',
  uppercase_labels: patch.uppercase_labels,
  no_branding: patch.no_branding,
  transparent_background: false,
  submit_button_text: patch.submit_button_text,
  logo_picture:
    'https://health.coleebri.com/wp-content/uploads/sites/12/2025/02/Fichier-7@2x.png',
  properties: patch.properties,
  custom_css: themeCss,
};

const { res, data } = await apiFetch(formUpdatePath(existing), {
  ...cfg,
  method: 'PUT',
  body,
});

if (!res.ok) {
  console.error('Update failed', res.status, data);
  process.exit(1);
}

const updated = extractForm(data) || existing;
console.log('Repaired form id:', updated.id);
console.log('Public URL:', `${cfg.publicBase}/forms/${updated.slug}`);
console.log('Fields:', updated.properties?.filter((p) => !p.hidden).map((p) => p.name).join(', '));
