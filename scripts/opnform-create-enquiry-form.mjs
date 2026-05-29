#!/usr/bin/env node
/**
 * Create test-enquiry form via OpnForm API (server-side only).
 * Requires: COLEEBRI_OPNFORM_TOKEN, optional COLEEBRI_OPNFORM_API_BASE
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  getConfig,
  requireToken,
  apiFetch,
  extractForm,
  resolveFormAfterCreate,
  printFormSummary,
  listWorkspaceForms,
  findFormByTitle,
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

const verbose = process.argv.includes('--verbose');
const { tests, sections } = loadCatalogue();

const payload = {
  workspace_id: 1,
  title: 'Test enquiry — Coleebri Health',
  visibility: 'public',
  language: 'en',
  theme: 'default',
  color: '#00889a',
  dark_mode: 'light',
  width: 'centered',
  size: 'md',
  border_radius: 'full',
  uppercase_labels: false,
  no_branding: true,
  transparent_background: false,
  presentation_style: 'classic',
  submit_button_text: 'Send enquiry',
  logo_picture: process.env.COLEEBRI_LOGO_URL || LOGO_URL,
  properties: buildEnquiryProperties({
    tests,
    sections,
    catalogueUrl: process.env.COLEEBRI_CATALOGUE_PUBLIC_URL || CATALOGUE_URL,
  }),
};
const formTitle = payload.title;

const { res, data, text } = await apiFetch('/open/forms', {
  ...cfg,
  method: 'POST',
  body: payload,
});

if (!res.ok) {
  console.error('Create form failed', res.status, data);
  process.exit(1);
}

if (verbose || !extractForm(data)?.slug) {
  console.error('HTTP', res.status, '(response envelope)');
  if (typeof data === 'object') console.error(JSON.stringify(data, null, 2));
  else console.error(text);
  console.error('');
}

let form = await resolveFormAfterCreate(cfg, { title: formTitle, createResponse: data });

if (!form?.slug) {
  console.error('Form may have been created but slug could not be resolved.');
  console.error('Run: node scripts/opnform-list-forms.mjs');
  const forms = await listWorkspaceForms(cfg);
  const partial = findFormByTitle(forms, formTitle);
  if (partial.length) {
    console.error('\nMatching forms by title:');
    for (const f of partial) {
      console.error(`  ${f.id}\t${f.slug}\t${f.title}`);
    }
  }
  process.exit(1);
}

console.log('Created form.');
printFormSummary(form, cfg.publicBase);
