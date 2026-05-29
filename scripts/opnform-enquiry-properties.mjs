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

export function loadCatalogue() {
  const ctx = { window: {} };
  runInContext(readFileSync(join(root, 'data.js'), 'utf8'), createContext(ctx));
  return {
    tests: ctx.window.TESTS || [],
    sections: ctx.window.SECTIONS || [],
  };
}

export function sectionLabel(sections, sectionId) {
  const s = sections.find((x) => x.id === sectionId);
  return s ? s.label : sectionId;
}

export function buildTestSelectOptions(tests, sections) {
  const sorted = [...tests].sort((a, b) => {
    const sa = sectionLabel(sections, a.section);
    const sb = sectionLabel(sections, b.section);
    if (sa !== sb) return sa.localeCompare(sb);
    return a.name.localeCompare(b.name);
  });

  return sorted.map((t) => {
    const code = t.code && t.code !== '-' ? t.code : t.id;
    const sec = sectionLabel(sections, t.section);
    const label = `${sec} — ${t.name} (${code})`;
    return { id: t.id, name: label };
  });
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

export function buildEnquiryProperties({ tests, sections, catalogueUrl = CATALOGUE_URL }) {
  const testOptions = buildTestSelectOptions(tests, sections);

  return [
    {
      type: 'nf-text',
      name: 'Intro',
      id: 'b0000001-0001-4000-8000-000000000001',
      hidden: false,
      help_position: 'below_input',
      width: 'full',
      align: 'left',
      content: `<span class="coleebri-eyebrow">Request a test</span><h2>Test enquiry</h2><p>Choose your test from the catalogue list below (${tests.length} tests), or <a href="${catalogueUrl}" target="_blank" rel="noopener">browse the full catalogue</a> to compare markers and prices.</p>`,
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
    {
      type: 'select',
      name: 'Test from catalogue',
      id: 'a1000001-0001-4000-8000-000000000020',
      hidden: false,
      help_position: 'below_input',
      placeholder: 'Select a test…',
      select: { options: testOptions },
      width: 'full',
      align: 'left',
      allow_creation: false,
      without_dropdown: false,
      shuffle_options: false,
      hide_field_name: false,
      required: true,
      disabled: false,
      prefill: null,
      help: `All ${tests.length} tests from the patient catalogue, grouped by category.`,
    },
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
    }),
  ];
}
