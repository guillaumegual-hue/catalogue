#!/usr/bin/env node
/**
 * Sync window.TESTS from data.js → WordPress coleebri_test posts (REST API).
 *
 * Prerequisites:
 *   - Plugin coleebri-health-catalogue installed and activated
 *   - Application password for a user with edit_posts
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/export-catalogue-json.mjs
 *   node scripts/sync-wp-tests.mjs
 *   node scripts/sync-wp-tests.mjs --dry-run
 */
import { loadCatalogueData } from './load-catalogue-data.mjs';
import { wpFetch, wpFetchAll } from './wp-lib.mjs';

const dryRun = process.argv.includes('--dry-run');
const REST = '/wp/v2/coleebri_test';

function buildPayload(test) {
  const id = String(test.id || '');
  const name = String(test.name || 'Test');
  const blurb = String(test.blurb || '');
  const code = String(test.code || '');
  const section = String(test.section || '');
  const tracks = Array.isArray(test.tracks) ? test.tracks : [];
  const samples = Array.isArray(test.samples) ? test.samples : [];
  const components = Array.isArray(test.components) ? test.components : [];
  const primaryTrack = tracks[0] || section;
  const hashParts = [];
  if (primaryTrack && primaryTrack !== 'all') hashParts.push(`service=${encodeURIComponent(primaryTrack)}`);
  hashParts.push(`test=${encodeURIComponent(id)}`);
  const catalogueHash = `#${hashParts.join('&')}`;
  const slug = `${id}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  const price = test.price != null ? String(test.price) : '';
  let excerpt = code ? `${code} — ` : '';
  if (price && price !== 'POA') excerpt += price.match(/^\d/) ? `£${price}` : price;

  return {
    title: name,
    slug,
    content: blurb,
    excerpt,
    status: 'publish',
    meta: {
      clbr_id: id,
      clbr_code: code,
      clbr_section: section,
      clbr_tracks: JSON.stringify(tracks),
      clbr_samples: JSON.stringify(samples),
      clbr_turnaround: String(test.turnaround || ''),
      clbr_price: price,
      clbr_price_upper: !!test.priceUpper,
      clbr_components: JSON.stringify(components),
      clbr_catalogue_hash: catalogueHash,
    },
  };
}

async function main() {
  const { tests } = loadCatalogueData();
  console.log(`Catalogue tests: ${tests.length}${dryRun ? ' (dry run)' : ''}`);

  let existing = [];
  try {
    existing = await wpFetchAll(REST);
  } catch (e) {
    console.error(e.message);
    console.error('\nIs the Coleebri Health Catalogue plugin active?');
    process.exit(1);
  }

  const byClbrId = new Map();
  for (const post of existing) {
    const id = post.meta?.clbr_id || post.clbr_id;
    if (id) byClbrId.set(String(id), post);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const test of tests) {
    const payload = buildPayload(test);
    const clbrId = payload.meta.clbr_id;
    const found = byClbrId.get(clbrId);

    if (dryRun) {
      console.log(`${found ? 'UPDATE' : 'CREATE'} ${clbrId} → ${payload.slug}`);
      continue;
    }

    if (found) {
      await wpFetch(`${REST}/${found.id}`, {
        method: 'PUT',
        body: {
          title: payload.title,
          slug: payload.slug,
          content: payload.content,
          excerpt: payload.excerpt,
          status: payload.status,
          meta: payload.meta,
        },
      });
      updated += 1;
    } else {
      await wpFetch(REST, {
        method: 'POST',
        body: {
          title: payload.title,
          slug: payload.slug,
          content: payload.content,
          excerpt: payload.excerpt,
          status: payload.status,
          meta: payload.meta,
        },
      });
      created += 1;
    }
  }

  if (dryRun) {
    console.log('Dry run complete.');
    return;
  }

  console.log(`Done. Created: ${created}, updated: ${updated}, skipped: ${skipped}`);
  console.log('Flush permalinks in WP if single URLs 404.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
