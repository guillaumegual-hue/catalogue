#!/usr/bin/env node
/**
 * Production zip: index.html + tests/{category}/ only.
 *   node scripts/build-deploy-zip.mjs
 */
import { execSync, spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'coleebri-catalogue-deploy.zip');

execSync('node scripts/generate-category-pages.mjs', { cwd: root, stdio: 'inherit' });

const excludeArgs = [
  '*.git/*',
  '*/.git/*',
  '.git/*',
  'export/*',
  'export/**',
  'wordpress-plugin/*',
  'wordpress-plugin/**',
  'node_modules/*',
  'scripts/*',
  'scripts/**',
  'docs/*',
  'docs/**',
  'uploads/*',
  'preview/*',
  'preview2/*',
  'integrate/*',
  'embed/*',
  'coleebri-catalogue-deploy/*',
  'coleebri-catalogue-deploy.zip',
  '.github/*',
  '.cursor/*',
  '.env',
  '.env.*',
  'integrate.html',
  'embed-widgets.jsx',
  'print-catalogue.js',
  'pdf-export.js',
  'Coleebri Patient Catalogue-print.html',
  'IMPORT-README.md',
  'excel-items.json',
  '*.DS_Store',
].flatMap((pattern) => ['-x', pattern]);

const result = spawnSync('zip', ['-r', out, '.', ...excludeArgs], { cwd: root, stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status || 1);
console.log('Wrote', out);
