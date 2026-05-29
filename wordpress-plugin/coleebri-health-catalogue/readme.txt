=== Coleebri Health Catalogue ===
Contributors: coleebri
Requires at least: 6.0
Requires PHP: 7.4
Stable tag: 1.0.0

Registers the coleebri_test post type for WordPress search and SEO. Sync tests from the catalogue repo:

  node scripts/export-catalogue-json.mjs
  node scripts/sync-wp-tests.mjs

Set in wp-config.php:

  define( 'COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/' );

See docs/PATIENT-JOURNEY.md in the catalogue repository.
