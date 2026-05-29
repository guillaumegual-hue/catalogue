#!/usr/bin/env node
/** List forms in workspace 1. Usage: node scripts/opnform-list-forms.mjs */
const token = process.env.COLEEBRI_OPNFORM_TOKEN;
const apiBase = (process.env.COLEEBRI_OPNFORM_API_BASE || 'https://app.coleebri.eu/api').replace(/\/$/, '');
const ws = process.env.COLEEBRI_OPNFORM_WORKSPACE_ID || '1';

if (!token) {
  console.error('Set COLEEBRI_OPNFORM_TOKEN');
  process.exit(1);
}

const res = await fetch(`${apiBase}/open/workspaces/${ws}/forms`, {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
});
const data = await res.json();
if (!res.ok) {
  console.error(res.status, data);
  process.exit(1);
}

const forms = data.data || data;
for (const f of forms) {
  console.log(`${f.id}\t${f.slug}\t${f.title}`);
}
