#!/usr/bin/env node
/** Writes scripts/.wp-update-{pageId}.json from integrate/elementor templates. */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const elDir = join(root, 'integrate', 'elementor');

const MAP = [
  [991628, 'coleebri-service-men.json'],
  [991629, 'coleebri-service-general.json'],
  [991630, 'coleebri-service-women.json'],
  [991631, 'coleebri-service-sexual.json'],
  [991632, 'coleebri-service-fitness.json'],
  [991633, 'coleebri-service-dna.json'],
];

for (const [id, file] of MAP) {
  const t = JSON.parse(readFileSync(join(elDir, file), 'utf8'));
  writeFileSync(
    join(root, 'scripts', `.wp-update-${id}.json`),
    JSON.stringify({
      id,
      meta: {
        _elementor_edit_mode: 'builder',
        _elementor_template_type: 'wp-page',
        _elementor_data: JSON.stringify(t.content),
      },
    })
  );
}
console.log('Wrote', MAP.length, 'update payloads (allergies page 991632 is fitness — create new WP page for allergies).');
