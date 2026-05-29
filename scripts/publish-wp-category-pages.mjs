#!/usr/bin/env node
/**
 * Prints WP-CLI / MCP instructions and Elementor meta payloads for category pages.
 * Run: node scripts/publish-wp-category-pages.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const elDir = join(root, 'integrate', 'elementor');

const PAGES = [
  { file: 'coleebri-service-general.json', slug: 'general-health', title: 'General health tests' },
  { file: 'coleebri-service-women.json', slug: 'womens-health', title: "Women's health tests" },
  { file: 'coleebri-service-men.json', slug: 'mens-health', title: "Men's health tests" },
  { file: 'coleebri-service-sexual.json', slug: 'sexual-health', title: 'Sexual health tests' },
  { file: 'coleebri-service-fitness.json', slug: 'fitness-wellbeing', title: 'Fitness & wellbeing tests' },
  { file: 'coleebri-service-allergies.json', slug: 'allergies', title: 'Allergies & sensitivities tests' },
  { file: 'coleebri-service-dna.json', slug: 'dna', title: 'DNA tests' },
];

console.log('Parent slug: tests (create if missing)\n');
for (const p of PAGES) {
  const tpl = JSON.parse(readFileSync(join(elDir, p.file), 'utf8'));
  console.log(`--- ${p.title} → /en/tests/${p.slug}/`);
  console.log(`slug: ${p.slug}`);
  console.log(`elementor elements: ${tpl.content.length} containers`);
}
