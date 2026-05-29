#!/usr/bin/env node
/**
 * Create test-enquiry form via OpnForm API (server-side only).
 * Requires: COLEEBRI_OPNFORM_TOKEN, optional COLEEBRI_OPNFORM_API_BASE
 */
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const token = process.env.COLEEBRI_OPNFORM_TOKEN;
const apiBase = (process.env.COLEEBRI_OPNFORM_API_BASE || 'https://app.coleebri.eu/api').replace(/\/$/, '');
const publicBase = (process.env.COLEEBRI_OPNFORM_PUBLIC_BASE || 'https://app.coleebri.eu').replace(/\/$/, '');

if (!token) {
  console.error('Set COLEEBRI_OPNFORM_TOKEN (never commit tokens to git).');
  process.exit(1);
}

const TYPE_MAP = {
  text: 'short_text',
  textarea: 'long_text',
  phone: 'phone_number',
};

function normalizeProperty(block) {
  const type = TYPE_MAP[block.type] || block.type;
  return {
    width: 'full',
    ...block,
    id: block.id || randomUUID(),
    type,
  };
}

function normalizePayload(raw) {
  const payload = { ...raw };
  payload.properties = (payload.properties || []).map(normalizeProperty);
  return payload;
}

const raw = JSON.parse(readFileSync(join(root, 'integrate/opnform/test-enquiry-payload.json'), 'utf8'));
const payload = normalizePayload(raw);

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

const form = data.data || data;
const slug = form.slug || 'unknown';
const id = form.id;

console.log('Created form.');
console.log('ID:', id);
console.log('Slug:', slug);
console.log('Public URL:', `${publicBase}/forms/${slug}`);
console.log('');
console.log('Add to wp-config.php:');
console.log(`define( 'COLEEBRI_OPNFORM_ENQUIRY_SLUG', '${slug}' );`);
console.log('');
console.log('Inspect fields: node scripts/opnform-inspect-form.mjs', slug);
