#!/usr/bin/env node
/**
 * Create test-enquiry form via OpnForm API (server-side only).
 * Requires: COLEEBRI_OPNFORM_TOKEN, optional COLEEBRI_OPNFORM_API_BASE
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const token = process.env.COLEEBRI_OPNFORM_TOKEN;
const apiBase = (process.env.COLEEBRI_OPNFORM_API_BASE || 'https://app.coleebri.eu/api').replace(/\/$/, '');

if (!token) {
  console.error('Set COLEEBRI_OPNFORM_TOKEN (never commit tokens to git).');
  process.exit(1);
}

const payload = JSON.parse(readFileSync(join(root, 'integrate/opnform/test-enquiry-payload.json'), 'utf8'));

const res = await fetch(`${apiBase}/open/forms`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

const text = await res.text();
let data;
try {
  data = JSON.parse(text);
} catch {
  data = text;
}

if (!res.ok) {
  console.error('Create form failed', res.status, data);
  process.exit(1);
}

const slug = data.slug || data.data?.slug || 'unknown';
console.log('Created form.');
console.log('Slug:', slug);
console.log('Public URL:', `https://app.coleebri.eu/forms/${slug}`);
console.log('Set COLEEBRI_OPNFORM_ENQUIRY_SLUG in wp-config.php to:', slug);
