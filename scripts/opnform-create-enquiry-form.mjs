#!/usr/bin/env node
/**
 * Create test-enquiry form via OpnForm API (server-side only).
 * Requires: COLEEBRI_OPNFORM_TOKEN, optional COLEEBRI_OPNFORM_API_BASE
 */
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';
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

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = getConfig();
requireToken(cfg.token);

const verbose = process.argv.includes('--verbose');

function normalizeProperty(block) {
  return {
    help_position: 'below_input',
    width: 'full',
    align: 'left',
    ...block,
    id: block.id || randomUUID(),
  };
}

function normalizePayload(raw) {
  const payload = { ...raw };
  payload.properties = (payload.properties || []).map(normalizeProperty);
  return payload;
}

const raw = JSON.parse(readFileSync(join(root, 'integrate/opnform/test-enquiry-payload.json'), 'utf8'));
const payload = normalizePayload(raw);
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
