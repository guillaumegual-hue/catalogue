/**
 * WordPress media gallery URLs for category hero banners.
 * Sources: health.coleebri.com/wp-json/wp/v2/media (public) + /en/tests/* page IDs.
 * Refresh: node scripts/fetch-category-hero-images.mjs
 */

/** @type {Record<string, { wpMediaUrl: string, wpPageId?: number, wpPageSlug?: string }>} */
export const CATEGORY_HERO_WP_MEDIA = {
  'all-tests': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/lab-313864_1920.jpg',
    wpPageId: 991627,
    wpPageSlug: 'tests',
  },
  'general-health': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/blood-sample-6200013_1280.jpg',
    wpPageId: 991629,
    wpPageSlug: 'general-health',
  },
  'womens-health': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/pexels-karolina-grabowska-7195310-scaled.jpg',
    wpPageId: 991630,
    wpPageSlug: 'womens-health',
  },
  'mens-health': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/02/doctor-9615943_1280.jpg',
    wpPageId: 991628,
    wpPageSlug: 'mens-health',
  },
  'sexual-health': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/12/Sexual-Health-Test.-1.png',
    wpPageId: 991631,
    wpPageSlug: 'sexual-health',
  },
  'fitness-wellbeing': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2026/03/group-of-people-exercising-together-in-park-2026-01-11-10-30-55-utc-2-2-2-2.jpg',
    wpPageId: 991632,
    wpPageSlug: 'fitness-allergies',
  },
  allergies: {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/pexels-pixabay-356040-scaled.jpg',
    wpPageId: 991632,
    wpPageSlug: 'fitness-allergies',
  },
  dna: {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/dna-7476704_1280.jpg',
    wpPageId: 991633,
    wpPageSlug: 'dna',
  },
  'phlebotomy-collection': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/06/hand-in-medical-glove-holding-a-test-tube-2025-01-15-12-32-40-utc-1.jpg',
  },
  'paternity-dna': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/12/nonlegaldnatrio.png',
  },
  'health-profiles': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/laboratory-3827743_1920.jpg',
  },
  'routine-tests': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/test-tubes-7582098_1920.jpg',
  },
  autoimmune: {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/sample-5053739_1280.jpg',
  },
  'vitamins-minerals': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/donation-732298_1280.jpg',
  },
  'specific-requests': {
    wpMediaUrl:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/pexels-anntarazevich-5895884-scaled.jpg',
  },
};
