#!/usr/bin/env node
/**
 * Download category hero images from WordPress media gallery URLs.
 * Optionally scrape hero <img> from /en/tests/* when the site responds.
 *
 *   node scripts/fetch-category-hero-images.mjs
 *   node scripts/fetch-category-hero-images.mjs --scrape-pages
 */
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CATEGORY_HEROES } from './category-heroes-data.mjs';
import { CATEGORY_HERO_WP_MEDIA } from './category-hero-media-map.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets', 'category-heroes');
const scrapePages = process.argv.includes('--scrape-pages');
const WP_BASE = 'https://health.coleebri.com';

function extFromUrl(url) {
  const m = String(url).match(/\.(jpe?g|png|webp|avif)(\?|#|$)/i);
  if (!m) return '.jpg';
  const ext = m[1].toLowerCase();
  return ext === 'jpeg' ? '.jpg' : '.' + ext;
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ColeebriCatalogueHeroSync/1.0' },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  return buf.length;
}

async function scrapePageHeroUrl(pageSlug) {
  const pageUrl = `${WP_BASE}/en/tests/${pageSlug}/`;
  const res = await fetch(pageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ColeebriCatalogue/1.0)' },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const urls = [
    ...html.matchAll(
      /https:\/\/health\.coleebri\.com\/wp-content\/uploads\/sites\/12\/[^"'<>\\s]+\.(?:jpe?g|png|webp)/gi
    ),
  ].map((m) => m[0]);
  const heroish = urls.filter(
    (u) =>
      !/logo|favicon|icon|woocommerce-placeholder|12x12|150x150|300x300/i.test(u) &&
      !/Fichier-7|Fichier-29@2x/i.test(u)
  );
  const scored = heroish.map((u) => {
    let score = 0;
    if (/1920|scaled|1024|1280|768/.test(u)) score += 3;
    if (/dna|health|test|lab|blood|pexels|group-of/i.test(u)) score += 2;
    if (/\.png$/i.test(u) && /sexual|dna|maternity/i.test(u)) score += 1;
    return { u, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.u || heroish[0] || null;
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const manifest = {};
  const updatedHeroes = { ...CATEGORY_HEROES };

  for (const [slug, hero] of Object.entries(CATEGORY_HEROES)) {
    const map = CATEGORY_HERO_WP_MEDIA[slug];
    let sourceUrl = map?.wpMediaUrl || null;

    if (scrapePages && map?.wpPageSlug) {
      try {
        const scraped = await scrapePageHeroUrl(map.wpPageSlug);
        if (scraped) {
          sourceUrl = scraped;
          console.log(`  scraped ${slug} ← ${scraped.split('/').pop()}`);
        }
      } catch (e) {
        console.warn(`  scrape ${slug}: ${e.message}`);
      }
    }

    if (!sourceUrl) {
      console.warn(`skip ${slug}: no wpMediaUrl`);
      continue;
    }

    const ext = extFromUrl(sourceUrl);
    const filename = slug + ext;
    const dest = join(outDir, filename);

    try {
      const bytes = await download(sourceUrl, dest);
      updatedHeroes[slug] = { ...hero, image: filename };
      manifest[slug] = { file: filename, bytes, sourceUrl };
      console.log(`ok ${slug} → ${filename} (${Math.round(bytes / 1024)} KB)`);
    } catch (e) {
      console.error(`fail ${slug}: ${e.message}`);
      manifest[slug] = { error: e.message, sourceUrl };
    }
  }

  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

  const heroesPath = join(root, 'assets', 'category-heroes.js');
  writeFileSync(
    heroesPath,
    `/* Generated — node scripts/generate-category-heroes.mjs */\nwindow.CATEGORY_HEROES = ${JSON.stringify(updatedHeroes, null, 2)};\n`,
    'utf8'
  );

  console.log('Updated assets/category-heroes.js — sync image: fields in category-heroes-data.mjs if needed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
