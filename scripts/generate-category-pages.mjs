#!/usr/bin/env node
/**
 * Generate /tests/{slug}/index.html — one unique URL per catalogue category.
 */
import { writeFileSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  CATEGORY_PAGES,
  CATEGORY_REDIRECTS,
  CATALOGUE_ROOT_REDIRECTS,
  ASSET_VER,
} from './category-pages-config.mjs';
import { CATALOGUE_BASE_STAGING } from './catalogue-config.mjs';
import { execSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
execSync('node scripts/generate-category-heroes.mjs', { cwd: root, stdio: 'inherit' });
const testsDir = join(root, 'tests');

const keptSlugs = new Set([
  ...CATEGORY_PAGES.map((p) => p.slug),
  ...CATEGORY_REDIRECTS.map((r) => r.from),
  ...CATALOGUE_ROOT_REDIRECTS.map((r) => r.from),
]);

function escapeJson(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

function buildCategoryHtml(page, assetRoot) {
  const boot = { slug: page.slug, title: page.title };
  if (page.service) boot.service = page.service;
  if (page.category) boot.category = page.category;

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.title} — Coleebri Health</title>
  <meta name="description" content="${page.title}. Coleebri Health test catalogue 2026." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${assetRoot}assets/coleebri-health-site.css?v=${ASSET_VER}" />
</head>
<body>
<div id="root"></div>
<script>
window.TWEAK_DEFAULTS = { showAnalytesByDefault: false, denseCards: false, showPriceTier: true, showBadges: true, primaryAccent: "teal" };
window.COLEEBRI_CATALOGUE_PAGE = ${escapeJson(boot)};
</script>
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin></script>
<script src="${assetRoot}assets/catalogue-site.js?v=${ASSET_VER}"></script>
<script src="${assetRoot}assets/coleebri-embed-params.js?v=${ASSET_VER}"></script>
<script src="${assetRoot}data.js?v=${ASSET_VER}"></script>
<script src="${assetRoot}pricing.js"></script>
<script src="${assetRoot}assets/category-heroes.js?v=${ASSET_VER}"></script>
<script src="${assetRoot}compliance-copy.js?v=${ASSET_VER}"></script>
<script src="${assetRoot}glossary-guidance.js?v=${ASSET_VER}"></script>
<script src="${assetRoot}glossary-api.js?v=${ASSET_VER}"></script>
<script src="${assetRoot}glossary.js?v=${ASSET_VER}"></script>
<script src="${assetRoot}phlebotomy-enquiry.js?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}components.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}catalogue-blocks.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}api-guidance-ui.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}glossary-ui.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}marker-check.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}phlebotomy-enquiry.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}cart.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}quiz.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}app.jsx?v=${ASSET_VER}"></script>
</body>
</html>
`;
}

function buildRedirectHtml(target) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=${target}" />
  <link rel="canonical" href="${target}" />
  <title>Redirecting…</title>
  <script>location.replace('${target}' + (location.search || '') + (location.hash || ''));</script>
</head>
<body>
  <p><a href="${target}">Continue to catalogue</a></p>
</body>
</html>
`;
}

function buildHubIndex() {
  const base = CATALOGUE_BASE_STAGING;
  const categoryLinks = CATEGORY_PAGES.map(
    (p) => `    <li><a href="${base}tests/${p.slug}/">${p.title}</a></li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=../index.html" />
  <title>Redirecting to catalogue…</title>
  <script>location.replace('../index.html');</script>
</head>
<body>
  <p><a href="../index.html">Open full catalogue</a></p>
  <h1>Category pages</h1>
  <ul>
${categoryLinks}
  </ul>
  <p><a href="urls.json">urls.json</a> — menu link list</p>
</body>
</html>
`;
}

mkdirSync(testsDir, { recursive: true });

for (const page of CATEGORY_PAGES) {
  const dir = join(testsDir, page.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), buildCategoryHtml(page, '../../'));
}

for (const { from, to } of CATEGORY_REDIRECTS) {
  const dir = join(testsDir, from);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), buildRedirectHtml(`../${to}/`));
}

for (const { from, hash } of CATALOGUE_ROOT_REDIRECTS) {
  const dir = join(testsDir, from);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), buildRedirectHtml(`../index.html${hash}`));
}

for (const name of readdirSync(testsDir, { withFileTypes: true })) {
  if (!name.isDirectory()) continue;
  if (!keptSlugs.has(name.name)) {
    rmSync(join(testsDir, name.name), { recursive: true, force: true });
  }
}

writeFileSync(join(testsDir, 'index.html'), buildHubIndex());

const manifest = CATEGORY_PAGES.map((p) => ({
  slug: p.slug,
  title: p.title,
  url: `${CATALOGUE_BASE_STAGING}tests/${p.slug}/`,
}));
writeFileSync(join(testsDir, 'urls.json'), JSON.stringify(manifest, null, 2));

console.log(`Wrote ${CATEGORY_PAGES.length} category pages under tests/`);
console.log('Menu URLs: tests/urls.json');
