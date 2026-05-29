/**
 * Build OpnForm property blocks for test enquiry (from data.js).
 */
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';
import { createContext, runInContext } from 'vm';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const LOGO_URL =
  process.env.COLEEBRI_LOGO_URL ||
  'https://guillaumegual-hue.github.io/catalogue/assets/coleebri-health-logo.svg';

export const CATALOGUE_URL =
  process.env.COLEEBRI_CATALOGUE_PUBLIC_URL ||
  'https://guillaumegual-hue.github.io/catalogue/Coleebri%20Patient%20Catalogue.html';

const CATEGORY_FIELD_ID = 'a1000001-0001-4000-8000-000000000018';

/** Browse categories (same order as health.coleebri.com test pages). */
const CATEGORY_DEFS = [
  { id: 'general', label: 'General Health' },
  { id: 'women', label: "Women's Health" },
  { id: 'men', label: "Men's Health" },
  { id: 'sexual', label: 'Sexual Health' },
  { id: 'fitness', label: 'Fitness & wellbeing' },
  { id: 'allergies', label: 'Allergies & sensitivities' },
  { id: 'dna', label: 'DNA Tests' },
  { id: 'paternity', label: 'Paternity & DNA' },
  { id: 'profiles', label: 'Health profiles & screens' },
  { id: 'other', label: 'Other tests' },
];

export function loadCatalogue() {
  const ctx = { window: {} };
  runInContext(readFileSync(join(root, 'data.js'), 'utf8'), createContext(ctx));
  return {
    tests: ctx.window.TESTS || [],
    sections: ctx.window.SECTIONS || [],
  };
}

export function formatPrice(t) {
  if (t.poa || t.price === null || t.price === undefined) return 'On request';
  if (t.priceUpper) return `from £${t.price}–£${t.priceUpper}`;
  return `£${t.price}`;
}

export function primaryCategoryId(test) {
  if (test.section === 'paternity') return 'paternity';
  if (test.section === 'allergies' || (test.tracks || []).includes('allergies')) return 'allergies';
  if (test.section === 'profiles') return 'profiles';
  for (const id of ['men', 'women', 'sexual', 'fitness', 'general', 'dna']) {
    if ((test.tracks || []).includes(id)) return id;
  }
  if (test.section === 'fitness') return 'fitness';
  if (test.section && CATEGORY_DEFS.some((c) => c.id === test.section)) return test.section;
  return 'other';
}

export function testsByCategory(tests) {
  const map = new Map(CATEGORY_DEFS.map((c) => [c.id, []]));
  for (const t of tests) {
    const cat = primaryCategoryId(t);
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat).push(t);
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return map;
}

export function formatTestOption(t) {
  const code = t.code && t.code !== '-' ? t.code : t.id;
  return `${t.name} — ${formatPrice(t)} (${code})`;
}

function logicShowForCategory(categoryLabel) {
  return {
    conditions: {
      operatorIdentifier: 'and',
      children: [
        {
          identifier: CATEGORY_FIELD_ID,
          value: {
            operator: 'does_not_equal',
            property_meta: { id: CATEGORY_FIELD_ID, type: 'select' },
            value: categoryLabel,
          },
        },
      ],
    },
    actions: ['hide-block'],
  };
}

function textField(block) {
  return {
    help_position: 'below_input',
    width: 'full',
    align: 'left',
    secret_input: false,
    hide_field_name: false,
    show_char_limit: false,
    generates_uuid: false,
    generates_auto_increment_id: false,
    disabled: false,
    prefill: null,
    help: null,
    ...block,
    id: block.id || randomUUID(),
    type: block.type || 'text',
  };
}

function selectField(block) {
  return {
    help_position: 'below_input',
    width: 'full',
    align: 'left',
    allow_creation: false,
    without_dropdown: false,
    shuffle_options: false,
    hide_field_name: false,
    disabled: false,
    prefill: null,
    ...block,
    id: block.id || randomUUID(),
    type: 'select',
  };
}

export function buildEnquiryProperties({ tests, catalogueUrl = CATALOGUE_URL }) {
  const byCat = testsByCategory(tests);
  const activeCategories = CATEGORY_DEFS.filter((c) => (byCat.get(c.id) || []).length > 0);

  const properties = [
    {
      type: 'nf-text',
      name: 'Intro',
      id: 'b0000001-0001-4000-8000-000000000001',
      hidden: false,
      help_position: 'below_input',
      width: 'full',
      align: 'left',
      content: `<span class="coleebri-eyebrow">Request a test</span><h2>Test enquiry</h2><p><strong>Step 1:</strong> choose a category. <strong>Step 2:</strong> choose your test (price shown). Or <a href="${catalogueUrl}" target="_blank" rel="noopener">browse the full catalogue</a> first.</p>`,
    },
    textField({
      id: 'a1000001-0001-4000-8000-000000000001',
      type: 'text',
      name: 'test_name',
      hidden: true,
      hide_field_name: true,
      required: false,
    }),
    textField({
      id: 'a1000001-0001-4000-8000-000000000002',
      type: 'text',
      name: 'test_code',
      hidden: true,
      hide_field_name: true,
      required: false,
    }),
    textField({
      id: 'a1000001-0001-4000-8000-000000000003',
      type: 'text',
      name: 'test_id',
      hidden: true,
      hide_field_name: true,
      required: false,
    }),
    textField({
      id: 'a1000001-0001-4000-8000-000000000004',
      type: 'text',
      name: 'source_page',
      hidden: true,
      hide_field_name: true,
      required: false,
    }),
    textField({
      id: 'a1000001-0001-4000-8000-000000000005',
      type: 'text',
      name: 'category',
      hidden: true,
      hide_field_name: true,
      required: false,
    }),
    selectField({
      name: 'Category',
      id: CATEGORY_FIELD_ID,
      hidden: false,
      placeholder: 'Choose a category…',
      required: true,
      select: {
        options: activeCategories.map((c) => ({
          id: c.id,
          name: c.label,
        })),
      },
      help: `Choose a category, then your test. ${tests.length} tests across ${activeCategories.length} categories.`,
    }),
  ];

  for (const cat of activeCategories) {
    const list = byCat.get(cat.id) || [];
    properties.push(
      selectField({
        name: 'Test',
        id: randomUUID(),
        hidden: false,
        placeholder: 'Select a test…',
        required: true,
        help: `${list.length} tests in ${cat.label}. Prices are laboratory fees; collection may be extra.`,
        select: {
          options: list.map((t) => ({
            id: t.id,
            name: formatTestOption(t),
          })),
        },
        logic: logicShowForCategory(cat.label),
      })
    );
  }

  properties.push(
    textField({
      id: 'a1000001-0001-4000-8000-000000000010',
      type: 'text',
      name: 'Your name',
      hidden: false,
      required: true,
      placeholder: 'Full name',
    }),
    {
      id: 'a1000001-0001-4000-8000-000000000011',
      type: 'email',
      name: 'Email',
      hidden: false,
      help_position: 'below_input',
      placeholder: 'you@example.com',
      width: 'full',
      align: 'left',
      required: true,
    },
    {
      id: 'a1000001-0001-4000-8000-000000000012',
      type: 'phone_number',
      name: 'Phone',
      hidden: false,
      help_position: 'below_input',
      placeholder: 'Optional',
      width: 'full',
      align: 'left',
      required: false,
    },
    textField({
      id: 'a1000001-0001-4000-8000-000000000013',
      type: 'text',
      name: 'Message',
      hidden: false,
      multi_lines: true,
      max_char_limit: 2000,
      placeholder: 'Anything else we should know?',
      required: false,
    })
  );

  return properties;
}

export { CATEGORY_FIELD_ID };
