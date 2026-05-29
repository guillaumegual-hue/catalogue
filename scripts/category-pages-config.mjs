/**
 * One static HTML page per category — unique URLs for WordPress menus.
 * Regenerate: node scripts/generate-category-pages.mjs
 */
export const ASSET_VER = '20260608c';

/** @type {Array<{ slug: string, title: string, service?: string, category?: string }>} */
export const CATEGORY_PAGES = [
  { slug: 'all-tests', title: 'All tests', service: 'all' },
  { slug: 'general-health', title: 'General health tests', service: 'general' },
  { slug: 'womens-health', title: "Women's health tests", service: 'women' },
  { slug: 'mens-health', title: "Men's health tests", service: 'men' },
  { slug: 'sexual-health', title: 'Sexual health tests', service: 'sexual' },
  { slug: 'fitness-wellbeing', title: 'Fitness & wellbeing tests', service: 'fitness' },
  { slug: 'allergies', title: 'Allergies & sensitivities tests', service: 'allergies' },
  { slug: 'dna', title: 'Paternity & DNA', service: 'dna' },
  { slug: 'phlebotomy-collection', title: 'Phlebotomy & collection', service: 'collection' },
  { slug: 'health-profiles', title: 'Health profiles & screens', category: 'profiles' },
  { slug: 'routine-tests', title: 'Routine tests', category: 'routine' },
  { slug: 'autoimmune', title: 'Autoimmune profiles', category: 'autoimmune' },
  { slug: 'vitamins-minerals', title: 'Vitamins & minerals', category: 'vitamins' },
  { slug: 'specific-requests', title: 'Specific requests', category: 'specific' },
];

/** Slug redirects under /tests/{from}/ → /tests/{to}/ */
export const CATEGORY_REDIRECTS = [{ from: 'paternity-dna', to: 'dna' }];

/** Retired URLs → full catalogue with hash */
export const CATALOGUE_ROOT_REDIRECTS = [
  { from: 'glossary', hash: '#biomarker-glossary' },
  { from: 'glossaire', hash: '#biomarker-glossary' },
  { from: 'marker-check', hash: '' },
  { from: 'patient-information', hash: '#patient-information' },
];
