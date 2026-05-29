/**
 * Per-category hero copy for /tests/{slug}/ pages.
 * Images: place WebP/JPG at assets/category-heroes/{slug}.webp (optional).
 * Regenerate JS: node scripts/generate-category-heroes.mjs
 */

/** @typedef {{ eyebrow: string, heading: string, intro: string, image?: string, imageAlt?: string, theme?: string }} CategoryHero */

/** @type {Record<string, CategoryHero>} */
export const CATEGORY_HEROES = {
  'all-tests': {
    eyebrow: 'Full catalogue',
    heading: 'Browse all patient tests',
    intro:
      'Search, compare and enquire across every test we collect — blood, urine and DNA — from one place.',
    theme: 'all',
  },
  'general-health': {
    eyebrow: 'General health',
    heading: 'Our general health testing',
    intro:
      'Routine blood work, health profiles and screening panels for everyday monitoring and peace of mind.',
    theme: 'general',
  },
  'womens-health': {
    eyebrow: "Women's health",
    heading: "Our women's health testing",
    intro:
      'Cycle, fertility, menopause and women-focused wellness panels — collected professionally and reported by accredited laboratories.',
    theme: 'women',
  },
  'mens-health': {
    eyebrow: "Men's health",
    heading: "Our men's health testing",
    intro:
      'Testosterone, prostate, performance and men-focused panels — with clear pricing and turnaround on every test card.',
    theme: 'men',
  },
  'sexual-health': {
    eyebrow: 'Sexual health',
    heading: 'Our sexual health testing',
    intro:
      'Confidential STI screening. If you have symptoms or need treatment, contact your GP or a sexual-health clinic.',
    theme: 'sexual',
  },
  'fitness-wellbeing': {
    eyebrow: 'Fitness & wellbeing',
    heading: 'Our fitness & wellbeing testing',
    intro:
      'Sports performance, recovery and nutrition panels for athletes and active lifestyles.',
    theme: 'fitness',
  },
  allergies: {
    eyebrow: 'Allergies & sensitivities',
    heading: 'Our allergy & sensitivity testing',
    intro:
      'IgE allergy and intolerance testing — speak to a healthcare professional before making major diet changes based on results.',
    theme: 'allergies',
  },
  dna: {
    eyebrow: 'DNA testing',
    heading: 'Our DNA testing services',
    intro:
      'We recognise that each testing journey is deeply personal and treat it with the attention and importance it deserves. We only work with partners **Ministry of Justice-approved** for our legal DNA testing services.',
    image: 'dna.webp',
    imageAlt: 'DNA double helix illustration',
    theme: 'dna',
  },
  'phlebotomy-collection': {
    eyebrow: 'Phlebotomy & collection',
    heading: 'How we collect your sample',
    intro:
      'Home visits, clinic days and postal kits — pricing for collection and add-ons, with qualified clinicians and accredited laboratory partners.',
    theme: 'collection',
  },
  'paternity-dna': {
    eyebrow: 'Paternity & DNA',
    heading: 'Our paternity & DNA testing',
    intro:
      'Legal (court-admissible) and peace-of-mind DNA tests. Legal tests require professional collection with **chain-of-custody**.',
    theme: 'paternity',
  },
  'health-profiles': {
    eyebrow: 'Health profiles',
    heading: 'Our health profiles & screens',
    intro:
      'Multi-marker panels for check-ups, hormones, fatigue and general wellbeing — see every marker on each test card.',
    theme: 'profiles',
  },
  'routine-tests': {
    eyebrow: 'Routine tests',
    heading: 'Our routine tests',
    intro: 'Single-purpose blood and urine tests for targeted monitoring and follow-up.',
    theme: 'routine',
  },
  autoimmune: {
    eyebrow: 'Autoimmune',
    heading: 'Our autoimmune profiles',
    intro:
      'Specialist antibody panels — your doctor or specialist should explain results in the context of your symptoms.',
    theme: 'autoimmune',
  },
  'vitamins-minerals': {
    eyebrow: 'Vitamins & minerals',
    heading: 'Our vitamins & minerals testing',
    intro: 'Nutritional and trace-element testing to support discussions with your GP or dietitian.',
    theme: 'vitamins',
  },
  'specific-requests': {
    eyebrow: 'Specific requests',
    heading: 'Bespoke & targeted tests',
    intro:
      'Cannot find what you need? Contact **health@coleebri.com** — we can often arrange additional markers through partner laboratories.',
    theme: 'specific',
  },
};
