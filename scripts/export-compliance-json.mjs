#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'compliance-copy.js'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const copy = sandbox.window.ColeebriCompliance;
if (!copy) {
  throw new Error('Could not read window.ColeebriCompliance from compliance-copy.js');
}

function noticeToHtml(n) {
  if (!n) return '';
  const parts = [];
  if (n.paragraphs) {
    for (const p of n.paragraphs) parts.push(`<p>${escapeHtml(p)}</p>`);
  }
  if (n.bullets) {
    parts.push('<ul>' + n.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('') + '</ul>');
  }
  if (n.links) {
    parts.push(
      '<p>' +
        n.links.map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`).join(' · ') +
        '</p>'
    );
  }
  return parts.join('');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const notices = copy.TEST_NOTICES || {};
const out = { testNotices: {} };
for (const [key, n] of Object.entries(notices)) {
  out.testNotices[key] = {
    title: n.title || '',
    body: noticeToHtml(n),
  };
}

const outDir = join(root, 'wordpress-plugin/coleebri-health-catalogue/data');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'compliance.json'), JSON.stringify(out, null, 2));
console.log('Exported compliance.json');
