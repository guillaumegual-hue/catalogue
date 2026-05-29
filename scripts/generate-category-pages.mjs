#!/usr/bin/env node
/**
 * Generate /tests/{slug}/index.html — one unique URL per catalogue category.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CATEGORY_PAGES, ASSET_VER } from './category-pages-config.mjs';
import { CATALOGUE_BASE_STAGING } from './catalogue-config.mjs';
import { execSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
execSync('node scripts/generate-category-heroes.mjs', { cwd: root, stdio: 'inherit' });
const testsDir = join(root, 'tests');

function escapeJson(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

function buildCategoryHtml(page, assetRoot) {
  const boot = {
    slug: page.slug,
    title: page.title,
  };
  if (page.service) boot.service = page.service;
  if (page.category) boot.category = page.category;
  if (page.scroll) boot.scroll = page.scroll;
  if (page.page) boot.page = page.page;

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.title} — Coleebri Health</title>
  <meta name="description" content="${page.title}. Coleebri Health patient test catalogue 2026." />
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
<script src="${assetRoot}print-catalogue.js?v=${ASSET_VER}"></script>
<script src="${assetRoot}pdf-export.js?v=${ASSET_VER}"></script>
<script src="${assetRoot}phlebotomy-enquiry.js?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}components.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}catalogue-blocks.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}api-guidance-ui.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}glossary-ui.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}marker-check.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}phlebotomy-enquiry.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}cart.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}quiz.jsx?v=${ASSET_VER}"></script>
<script type="text/babel" src="${assetRoot}tweaks-panel.jsx"></script>
<script type="text/babel" src="${assetRoot}app.jsx?v=${ASSET_VER}"></script>
</body>
</html>
`;
}

function buildHubIndex() {
  const base = CATALOGUE_BASE_STAGING;
  const isTool = (p) => p.page === 'glossary' || p.page === 'marker-check';
  const categoryLinks = CATEGORY_PAGES.filter((p) => !isTool(p) && !p.scroll)
    .map((p) => `    <li><a href="${base}tests/${p.slug}/">${p.title}</a></li>`)
    .join('\n');
  const toolLinks = CATEGORY_PAGES.filter((p) => isTool(p))
    .map((p) => `    <li><a href="${base}tests/${p.slug}/">${p.title}</a></li>`)
    .join('\n');
  const infoLinks = CATEGORY_PAGES.filter((p) => p.scroll)
    .map((p) => `    <li><a href="${base}tests/${p.slug}/">${p.title}</a></li>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Browse tests — Coleebri Health</title>
  <link rel="stylesheet" href="../assets/coleebri-health-site.css?v=${ASSET_VER}" />
  <style>
    body { font-family: Work Sans, system-ui; max-width: 40rem; margin: 2rem auto; padding: 0 1.25rem; color: #111; }
    h1 { font-family: Poppins, system-ui; color: #00525c; }
    ul { line-height: 1.9; padding-left: 1.25rem; }
    a { color: #00889a; font-weight: 600; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .lead { color: #424242; }
  </style>
</head>
<body>
  <h1>Browse tests by category</h1>
  <p class="lead">Each link opens a dedicated catalogue page (for WordPress menus and SEO).</p>
  <h2>Test categories</h2>
  <ul>
${categoryLinks}
  </ul>
  <h2>Tools</h2>
  <ul>
${toolLinks}
  </ul>
  <h2>Information</h2>
  <ul>
${infoLinks}
  </ul>
  <p><a href="../Coleebri%20Patient%20Catalogue.html">Full catalogue</a> (search, compare, quiz)</p>
  <p><a href="urls.json">urls.json</a> — all links for menus</p>
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

writeFileSync(join(testsDir, 'index.html'), buildHubIndex());

const manifest = CATEGORY_PAGES.map((p) => ({
  slug: p.slug,
  title: p.title,
  url: `${CATALOGUE_BASE_STAGING}tests/${p.slug}/`,
}));
writeFileSync(join(testsDir, 'urls.json'), JSON.stringify(manifest, null, 2));

console.log(`Wrote ${CATEGORY_PAGES.length} pages under tests/ + hub index.html`);
console.log('Menu URLs: tests/urls.json');
