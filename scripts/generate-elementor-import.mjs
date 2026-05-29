#!/usr/bin/env node
/**
 * Generates Elementor-importable page templates + WordPress WXR for Coleebri catalogue embeds.
 * Run: node scripts/generate-elementor-import.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'integrate', 'elementor');

function eid() {
  return Math.random().toString(16).slice(2, 9);
}

function shortcodeWidget(shortcode) {
  return {
    id: eid(),
    elType: 'widget',
    widgetType: 'shortcode',
    settings: { shortcode },
    elements: [],
  };
}

function headingWidget(title, size = 'h1') {
  return {
    id: eid(),
    elType: 'widget',
    widgetType: 'heading',
    settings: {
      title,
      header_size: size,
      align: 'left',
    },
    elements: [],
  };
}

function textWidget(html) {
  return {
    id: eid(),
    elType: 'widget',
    widgetType: 'text-editor',
    settings: { editor: html },
    elements: [],
  };
}

function sectionContainer(children, opts = {}) {
  return {
    id: eid(),
    elType: 'container',
    settings: {
      content_width: 'full',
      flex_direction: 'column',
      flex_gap: { unit: 'px', size: 16, column: '16', row: '16', isLinked: true },
      padding: opts.padding || {
        unit: 'px',
        top: '24',
        right: '20',
        bottom: '24',
        left: '20',
        isLinked: false,
      },
      ...opts.extra,
    },
    elements: children,
  };
}

function buildPage({ title, intro, blocks }) {
  const elements = [];
  if (intro) {
    elements.push(
      sectionContainer([headingWidget(title), textWidget(`<p>${intro}</p>`)], {
        padding: { unit: 'px', top: '40', right: '20', bottom: '8', left: '20', isLinked: false },
      })
    );
  } else {
    elements.push(
      sectionContainer([headingWidget(title)], {
        padding: { unit: 'px', top: '40', right: '20', bottom: '8', left: '20', isLinked: false },
      })
    );
  }
  for (const block of blocks) {
    const kids = [];
    if (block.heading) kids.push(headingWidget(block.heading, 'h2'));
    if (block.note) kids.push(textWidget(`<p>${block.note}</p>`));
    if (block.htmlWidget) kids.push(htmlWidget(block.htmlWidget.widget, block.htmlWidget.attrs));
    else if (block.htmlAttrs) {
      const m = block.shortcode.match(/widget="([^"]+)"/);
      const widget = m ? m[1] : 'tests';
      kids.push(htmlWidget(widget, block.htmlAttrs));
    } else kids.push(shortcodeWidget(block.shortcode));
    elements.push(sectionContainer(kids, { padding: block.padding }));
  }
  return {
    content: elements,
    page_settings: { hide_title: 'yes' },
    version: '0.4',
    title,
    type: 'page',
  };
}

const CATALOGUE_BASE = 'https://guillaumegual-hue.github.io/catalogue/';
const WP_SITE_BASE = 'https://health.coleebri.com/en';
const ASSET_VER = '20260530a';

const sc = (widget, extra = '') =>
  `[coleebri_catalogue widget="${widget}" branding="none"${extra ? ' ' + extra : ''}]`;

function htmlEmbed(widget, attrs = '') {
  const base = CATALOGUE_BASE;
  return `<div data-coleebri-embed="${widget}" data-coleebri-base="${base}" data-branding="none" data-site="${WP_SITE_BASE}" data-integrated="1"${attrs}></div><script src="${base}assets/coleebri-embed.js?v=${ASSET_VER}" data-base="${base}"><\\/script>`;
}

function htmlWidget(widget, attrs = '') {
  return {
    id: eid(),
    elType: 'widget',
    widgetType: 'html',
    settings: { html: htmlEmbed(widget, attrs) },
    elements: [],
  };
}

const PAGES = [
  {
    slug: 'coleebri-catalogue-home',
    title: 'Catalogue — Home widgets',
    intro:
      'Featured tests and category links. Requires the Coleebri Catalogue Embed plugin and hosted catalogue at <code>/catalogue/</code>.',
    blocks: [
      { heading: 'Most ordered tests', shortcode: sc('most-ordered', 'height="880"') },
      { heading: 'Browse by category', shortcode: sc('categories', 'height="520"') },
      { heading: 'Help me choose', shortcode: sc('quiz', 'height="640"') },
    ],
  },
  {
    slug: 'coleebri-full-catalogue',
    title: 'Patient catalogue (full)',
    intro: 'Full catalogue with search and tabs — use only if you need everything on one page.',
    blocks: [{ shortcode: sc('catalogue', 'height="920"') }],
  },
  {
    slug: 'coleebri-service-men',
    title: "Men's health tests",
    blocks: [{ shortcode: sc('tests', 'service="men" height="900"'), htmlAttrs: ' data-service="men" data-height="900"' }],
  },
  {
    slug: 'coleebri-service-women',
    title: "Women's health tests",
    blocks: [{ shortcode: sc('tests', 'service="women" height="900"'), htmlAttrs: ' data-service="women" data-height="900"' }],
  },
  {
    slug: 'coleebri-service-general',
    title: 'General health tests',
    blocks: [{ shortcode: sc('tests', 'service="general" height="900"'), htmlAttrs: ' data-service="general" data-height="900"' }],
  },
  {
    slug: 'coleebri-service-sexual',
    title: 'Sexual health tests',
    blocks: [{ shortcode: sc('tests', 'service="sexual" height="880"'), htmlAttrs: ' data-service="sexual" data-height="880"' }],
  },
  {
    slug: 'coleebri-service-fitness',
    title: 'Fitness & allergies tests',
    blocks: [{ shortcode: sc('tests', 'service="fitness" height="900"'), htmlAttrs: ' data-service="fitness" data-height="900"' }],
  },
  {
    slug: 'coleebri-service-dna',
    title: 'DNA tests',
    blocks: [{ shortcode: sc('tests', 'service="dna" height="900"'), htmlAttrs: ' data-service="dna" data-height="900"' }],
  },
  {
    slug: 'coleebri-section-paternity',
    title: 'Paternity & DNA (section)',
    blocks: [{ shortcode: sc('tests', 'category="paternity" height="880"') }],
  },
  {
    slug: 'coleebri-section-profiles',
    title: 'Health profiles (section)',
    blocks: [{ shortcode: sc('tests', 'category="profiles" height="880"') }],
  },
  {
    slug: 'coleebri-section-allergies',
    title: 'Allergies (section)',
    blocks: [{ shortcode: sc('tests', 'category="allergies" height="880"') }],
  },
  {
    slug: 'coleebri-collection',
    title: 'Phlebotomy & collection',
    blocks: [{ shortcode: sc('collection', 'height="720"') }],
  },
  {
    slug: 'coleebri-patient-info',
    title: 'Patient information',
    blocks: [{ shortcode: sc('patient-info', 'height="920"') }],
  },
  {
    slug: 'coleebri-laboratories',
    title: 'Our laboratories',
    blocks: [{ shortcode: sc('compliance', 'height="520"') }],
  },
  {
    slug: 'coleebri-glossary',
    title: 'Biomarker glossary',
    blocks: [{ shortcode: sc('glossary', 'height="560"') }],
  },
  {
    slug: 'coleebri-marker-check',
    title: 'Check a marker',
    blocks: [{ shortcode: sc('marker-check', 'height="520"') }],
  },
  {
    slug: 'coleebri-catalogue-nav',
    title: 'Catalogue category navigation',
    note: 'Horizontal tab bar — links open the hosted catalogue.',
    blocks: [{ shortcode: sc('tabs', 'height="140"') }],
  },
];

mkdirSync(outDir, { recursive: true });

const manifest = [];

for (const page of PAGES) {
  const blocks = page.blocks.map((b) => ({
    ...b,
    note: b.note || page.note,
  }));
  const json = buildPage({
    title: page.title,
    intro: page.intro,
    blocks,
  });
  const filename = `${page.slug}.json`;
  writeFileSync(join(outDir, filename), JSON.stringify(json, null, 2));
  manifest.push({
    file: filename,
    title: page.title,
    slug: page.slug,
    suggestedPath: page.slug.replace(/^coleebri-/, '').replace(/-/g, '/'),
  });
}

writeFileSync(
  join(outDir, 'manifest.json'),
  JSON.stringify(
    {
      generated: new Date().toISOString(),
      pluginRequired: 'integrate/coleebri-catalogue.php',
      wpConfig: "define('COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/');",
      pages: manifest,
    },
    null,
    2
  )
);

// WordPress WXR (shortcode in post content — works with Classic block or shortcode in Elementor)
const wxrItems = PAGES.map((p) => {
  const shortcodes = p.blocks.map((b) => b.shortcode).join('\n\n');
  const intro = p.intro ? `<p>${p.intro}</p>\n` : '';
  return { title: p.title, slug: p.slug, content: `${intro}${shortcodes}` };
});

const wxr = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
  <title>Coleebri Catalogue Pages</title>
  <link>https://health.coleebri.com</link>
  <description>Catalogue embed pages for Elementor</description>
  <wp:wxr_version>1.2</wp:wxr_version>
${wxrItems
  .map(
    (item) => `  <item>
    <title>${escapeXml(item.title)}</title>
    <link>https://health.coleebri.com/${item.slug}/</link>
    <content:encoded><![CDATA[${item.content}]]></content:encoded>
    <wp:post_name>${item.slug}</wp:post_name>
    <wp:status>draft</wp:status>
    <wp:post_type>page</wp:post_type>
  </item>`
  )
  .join('\n')}
</channel>
</rss>`;

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

writeFileSync(join(outDir, 'coleebri-catalogue-pages.xml'), wxr);

console.log(`Wrote ${manifest.length} Elementor templates + manifest + WXR to integrate/elementor/`);
