/**
 * One static HTML page per category — unique URLs for WordPress menus.
 * Regenerate: node scripts/generate-category-pages.mjs
 */
export const ASSET_VER = '20260607n';

/** @type {Array<{ slug: string, title: string, service?: string, category?: string, scroll?: string }>} */
export const CATEGORY_PAGES = [
  { slug: 'all-tests', title: 'All tests', service: 'all' },
  { slug: 'general-health', title: 'General health tests', service: 'general' },
  { slug: 'womens-health', title: "Women's health tests", service: 'women' },
  { slug: 'mens-health', title: "Men's health tests", service: 'men' },
  { slug: 'sexual-health', title: 'Sexual health tests', service: 'sexual' },
  { slug: 'fitness-wellbeing', title: 'Fitness & wellbeing tests', service: 'fitness' },
  { slug: 'allergies', title: 'Allergies & sensitivities tests', service: 'allergies' },
  { slug: 'dna', title: 'DNA tests', service: 'dna' },
  { slug: 'phlebotomy-collection', title: 'Phlebotomy & collection', service: 'collection' },
  { slug: 'paternity-dna', title: 'Paternity & DNA', category: 'paternity' },
  { slug: 'health-profiles', title: 'Health profiles & screens', category: 'profiles' },
  { slug: 'routine-tests', title: 'Routine tests', category: 'routine' },
  { slug: 'autoimmune', title: 'Autoimmune profiles', category: 'autoimmune' },
  { slug: 'vitamins-minerals', title: 'Vitamins & minerals', category: 'vitamins' },
  { slug: 'specific-requests', title: 'Specific requests', category: 'specific' },
  { slug: 'patient-information', title: 'Patient information', scroll: 'patient-information' },
  { slug: 'glossary', title: 'Biomarker glossary', page: 'glossary' },
  { slug: 'glossaire', title: 'Glossaire des biomarqueurs', page: 'glossary' },
  { slug: 'marker-check', title: 'Check a marker', page: 'marker-check' },
];
