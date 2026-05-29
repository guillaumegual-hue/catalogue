#!/usr/bin/env node
/**
 * Emit assets/category-heroes.js from scripts/category-heroes-data.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CATEGORY_HEROES } from './category-heroes-data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'assets', 'category-heroes.js');

const body = `/* Generated — node scripts/generate-category-heroes.mjs */
window.CATEGORY_HEROES = ${JSON.stringify(CATEGORY_HEROES, null, 2)};
`;

writeFileSync(out, body, 'utf8');
console.log('Wrote assets/category-heroes.js (' + Object.keys(CATEGORY_HEROES).length + ' heroes)');
