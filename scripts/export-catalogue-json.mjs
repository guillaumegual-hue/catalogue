#!/usr/bin/env node
/**
 * Export window.TESTS, SECTIONS, TRACKS from data.js to JSON for the WordPress plugin.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataJs = readFileSync(join(root, 'data.js'), 'utf8');

const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(dataJs, sandbox);

const out = {
  exportedAt: new Date().toISOString(),
  sampleTypes: sandbox.window.SAMPLE_TYPES || {},
  sections: sandbox.window.SECTIONS || [],
  tracks: sandbox.window.TRACKS || [],
  catalogueTabs: sandbox.window.CATALOGUE_TABS || [],
  tests: sandbox.window.TESTS || [],
};

const outDir = join(root, 'wordpress-plugin/coleebri-health-catalogue/data');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'catalogue.json'), JSON.stringify(out, null, 2));
console.log(`Exported ${out.tests.length} tests to ${outDir}/catalogue.json`);
