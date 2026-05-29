#!/usr/bin/env node
/**
 * Sync enquiry form from data.js (all catalogue tests + blue logo).
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
import {
  buildEnquiryProperties,
  loadCatalogue,
  LOGO_URL,
  CATALOGUE_URL,
} from './opnform-enquiry-properties.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = getConfig();
requireToken(cfg.token);

const formId = process.argv[2] || process.env.COLEEBRI_OPNFORM_ENQUIRY_ID || '10';
const { tests, sections } = loadCatalogue();
const catalogueUrl =
  process.env.COLEEBRI_CATALOGUE_PUBLIC_URL || CATALOGUE_URL;

const existing = await getForm(cfg, { id: String(formId) });
const themeCss = readFileSync(join(root, 'assets/opnform-coleebri-theme.css'), 'utf8');

const body = {
  title: 'Test enquiry — Coleebri Health',
  visibility: existing.visibility || 'public',
  language: existing.language || 'en',
  theme: 'default',
  presentation_style: 'classic',
  dark_mode: 'light',
  color: '#00889a',
  width: 'centered',
  size: 'md',
  border_radius: 'full',
  uppercase_labels: false,
  no_branding: true,
  transparent_background: false,
  submit_button_text: 'Send enquiry',
  logo_picture: process.env.COLEEBRI_LOGO_URL || LOGO_URL,
  properties: buildEnquiryProperties({ tests, sections, catalogueUrl }),
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
console.log('Updated form id:', updated.id);
console.log('Logo:', body.logo_picture);
console.log('Catalogue tests:', tests.length, '| categories:', buildEnquiryProperties({ tests }).filter((p) => p.type === 'select' && p.name === 'Test').length);
console.log('Public URL:', `${cfg.publicBase}/forms/${updated.slug}`);
