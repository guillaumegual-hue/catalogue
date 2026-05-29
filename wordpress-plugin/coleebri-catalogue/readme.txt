=== Coleebri Health Catalogue Embed ===
Contributors: coleebri
Requires at least: 6.0
Requires PHP: 7.2
Stable tag: 1.2.0
License: GPLv2 or later

Shortcode embeds for the hosted Coleebri patient catalogue. Does not import products.

== Installation ==

1. Upload and activate this plugin.
2. Host the catalogue static files (see DEPLOY.md in the git repo).
3. Add to wp-config.php:

define( 'COLEEBRI_CATALOGUE_BASE', 'https://your-catalogue-url/' );

== Usage ==

[coleebri_catalogue widget="tests" service="men" height="900" branding="none"]

See docs/PHASE0-ELEMENTOR.md in the repository for category page setup.
