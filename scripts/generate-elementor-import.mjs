#!/usr/bin/env node
/**
 * Generates Elementor-importable page templates + WordPress WXR for Coleebri catalogue embeds.
 * Run: node scripts/generate-elementor-import.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadCatalogueData } from './load-catalogue-data.mjs';
import { catalogueDeepLink, catalogueBase, WP_SITE_BASE } from './catalogue-config.mjs';

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

function buildPage({ title, intro, blocks, embedOnly = false }) {
  const elements = [];
  if (!embedOnly) {
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
  }
  for (const block of blocks) {
    const kids = [];
    if (block.heading) kids.push(headingWidget(block.heading, 'h2'));
    if (block.note) kids.push(textWidget(`<p>${block.note}</p>`));
    if (block.cta) {
      kids.push(
        textWidget(
          `<p class="coleebri-wp-cta"><a class="coleebri-catalogue-cta" href="${block.cta.href}">${block.cta.label}</a></p>`
        )
      );
    }
    if (block.htmlWidget) {
      kids.push({
        id: eid(),
        elType: 'widget',
        widgetType: 'html',
        settings: {
          html: htmlEmbed(block.htmlWidget.widget, block.htmlWidget.attrs || '', block.htmlWidget.mode || 'hub'),
        },
        elements: [],
      });
    } else if (block.htmlAttrs) {
      const m = block.shortcode.match(/widget="([^"]+)"/);
      const widget = m ? m[1] : 'tests';
      kids.push(htmlWidget(widget, block.htmlAttrs));
    } else if (block.shortcode) kids.push(shortcodeWidget(block.shortcode));
    if (kids.length) elements.push(sectionContainer(kids, { padding: block.padding }));
  }
  return {
    content: elements,
    page_settings: { hide_title: 'yes' },
    version: '0.4',
    title,
    type: 'page',
  };
}

const CATALOGUE_BASE = catalogueBase();
const ASSET_VER = '20260606d';
const { tracks } = loadCatalogueData();
const trackById = Object.fromEntries(tracks.map((t) => [t.id, t]));

function servicePage(title, trackId, slug, opts = {}) {
  const t = trackById[trackId] || {};
  const filter = opts.category
    ? { category: opts.category }
    : { service: trackId };
  return {
    slug,
    title,
    intro: t.blurb || opts.intro || '',
    blocks: [
      {
        heading: 'Browse tests',
        note:
          'Open the patient catalogue to search, compare markers, add tests to your list, and send an enquiry.',
        cta: {
          label: 'View all tests in the catalogue',
          href: catalogueDeepLink(filter, CATALOGUE_BASE),
        },
      },
      {
        heading: 'Need help choosing?',
        note: 'Use the quiz and biomarker tools in the full catalogue.',
        cta: {
          label: 'Open full catalogue',
          href: catalogueDeepLink({}, CATALOGUE_BASE),
        },
      },
    ],
  };
}

const EMBED_INTEGRATED =
  ' data-branding="none" data-site="' + WP_SITE_BASE + '" data-integrated="1"';
const EMBED_CATEGORY = EMBED_INTEGRATED + ' data-transparent="1"';

const sc = (widget, extra = '') =>
  `[coleebri_catalogue widget="${widget}" branding="none"${extra ? ' ' + extra : ''}]`;

function htmlEmbed(widget, attrs = '', mode = 'category') {
  const base = CATALOGUE_BASE;
  let chrome = '';
  if (mode === 'homepage') {
    chrome = ' data-transparent="1"';
  } else if (mode === 'category') {
    chrome = EMBED_CATEGORY;
  } else {
    chrome = EMBED_INTEGRATED + (mode === 'transparent' ? ' data-transparent="1"' : '');
  }
  return `<div data-coleebri-embed="${widget}" data-coleebri-base="${base}"${chrome}${attrs}></div><script src="${base}assets/coleebri-embed.js?v=${ASSET_VER}" data-base="${base}"><\\/script>`;
}

function homepageEmbedBlock(widget, height) {
  return {
    heading: widget === 'most-ordered' ? 'Most ordered tests' : 'Browse by category',
    note:
      widget === 'most-ordered'
        ? 'Featured panels — opens the full catalogue for compare and enquire.'
        : 'Jump to a section in the patient catalogue.',
    htmlWidget: {
      widget,
      mode: 'homepage',
      attrs: ` data-height="${height}"`,
    },
  };
}

function htmlWidget(widget, attrs = '', mode = 'category') {
  return {
    id: eid(),
    elType: 'widget',
    widgetType: 'html',
    settings: { html: htmlEmbed(widget, attrs, mode) },
    elements: [],
  };
}

const PAGES = [
  {
    slug: 'coleebri-catalogue-home',
    title: 'Catalogue — Home widgets',
    intro:
      'For the Elementor <strong>homepage</strong> only: host catalogue at <code>/catalogue/</code> on Infomaniak, then paste blocks from <code>homepage-embed-snippet.html</code> or import this template.',
    blocks: [
      homepageEmbedBlock('most-ordered', 880),
      homepageEmbedBlock('categories', 520),
    ],
  },
  {
    slug: 'coleebri-full-catalogue',
    title: 'Patient catalogue (full)',
    intro: 'Full catalogue with search and tabs — use only if you need everything on one page.',
    blocks: [{ shortcode: sc('catalogue', 'height="920"') }],
  },
  {
    slug: 'coleebri-tests-hub',
    title: 'Health tests hub',
    intro:
      'Add your hero copy and an Elementor <strong>Nav Menu</strong> (see integrate/elementor/category-nav-snippet.html). Embed the quiz widget below; use Elementor forms or mailto for enquiries.',
    blocks: [
      {
        heading: 'Help me choose',
        note: 'Optional anchor id coleebri-hub-quiz for in-page links.',
        htmlWidget: {
          widget: 'quiz',
          mode: 'transparent',
          attrs: ' id="coleebri-hub-quiz" class="coleebri-wp-hub-quiz-anchor" data-height="640"',
        },
      },
    ],
  },
  servicePage("Men's health tests", 'men', 'coleebri-service-men'),
  servicePage("Women's health tests", 'women', 'coleebri-service-women'),
  servicePage('General health tests', 'general', 'coleebri-service-general'),
  servicePage('Sexual health tests', 'sexual', 'coleebri-service-sexual'),
  servicePage('Fitness & wellbeing tests', 'fitness', 'coleebri-service-fitness', {
    category: 'fitness',
  }),
  servicePage('Allergies & sensitivities tests', 'allergies', 'coleebri-service-allergies', {
    category: 'allergies',
  }),
  servicePage('DNA tests', 'dna', 'coleebri-service-dna'),
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
    title: 'Catalogue category navigation (legacy iframe tabs)',
    note: 'Prefer an Elementor Nav Menu on the hub page — see category-nav-snippet.html.',
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
    embedOnly: page.embedOnly,
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
      embedScript: 'assets/coleebri-embed.js',
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
