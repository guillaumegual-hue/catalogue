#!/usr/bin/env node
/**
 * Package wordpress-plugin/coleebri-health-catalogue as a zip for WP upload.
 */
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pluginDir = join(root, 'wordpress-plugin', 'coleebri-health-catalogue');
const outZip = join(root, 'wordpress-plugin', 'coleebri-health-catalogue.zip');

execSync(`cd "${join(root, 'wordpress-plugin')}" && zip -r coleebri-health-catalogue.zip coleebri-health-catalogue -x "*.DS_Store"`, {
  stdio: 'inherit',
});
console.log(`Wrote ${outZip}`);
