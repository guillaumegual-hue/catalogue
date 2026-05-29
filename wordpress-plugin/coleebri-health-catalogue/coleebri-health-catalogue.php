<?php
/**
 * Plugin Name: Coleebri Health Catalogue
 * Description: Searchable blood-test index (coleebri_test) synced from the patient catalogue data.js. Embeds optional; primary UX lives at /catalogue/.
 * Version: 1.0.0
 * Author: Coleebri Health
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: coleebri-health-catalogue
 */

if (!defined('ABSPATH')) {
    exit;
}

define('COLEEBRI_HC_VERSION', '1.0.0');
define('COLEEBRI_HC_PATH', plugin_dir_path(__FILE__));
define('COLEEBRI_HC_URL', plugin_dir_url(__FILE__));

require_once COLEEBRI_HC_PATH . 'includes/class-coleebri-test-cpt.php';
require_once COLEEBRI_HC_PATH . 'includes/class-coleebri-catalogue-url.php';
require_once COLEEBRI_HC_PATH . 'includes/class-coleebri-embed-shortcode.php';

function coleebri_catalogue_base(): string
{
    if (defined('COLEEBRI_CATALOGUE_BASE')) {
        return trailingslashit(COLEEBRI_CATALOGUE_BASE);
    }
    return trailingslashit(home_url('/catalogue/'));
}

function coleebri_catalogue_deep_link(array $args = []): string
{
    return Coleebri_Catalogue_URL::deep_link($args);
}

add_action('plugins_loaded', static function () {
    Coleebri_Test_CPT::register();
    Coleebri_Embed_Shortcode::register();
});

add_action('init', static function () {
    Coleebri_Test_CPT::register_meta();
});

register_activation_hook(__FILE__, static function () {
    Coleebri_Test_CPT::register();
    Coleebri_Test_CPT::register_meta();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, static function () {
    flush_rewrite_rules();
});

require_once COLEEBRI_HC_PATH . 'includes/class-coleebri-search.php';

add_action('plugins_loaded', static function () {
    Coleebri_Search::register();
}, 20);

add_filter('single_template', static function ($template) {
    if (is_singular(Coleebri_Test_CPT::POST_TYPE)) {
        $plugin_template = COLEEBRI_HC_PATH . 'templates/single-coleebri_test.php';
        if (file_exists($plugin_template)) {
            return $plugin_template;
        }
    }
    return $template;
});
