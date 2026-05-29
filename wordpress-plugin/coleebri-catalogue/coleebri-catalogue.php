<?php
/**
 * Plugin Name: Coleebri Health Catalogue Embed
 * Description: Shortcode embeds for the hosted patient catalogue; OpnForm bridge for enquiries on WordPress.
 * Version: 1.3.0
 * Author: Coleebri Health
 * Requires at least: 6.0
 * Requires PHP: 7.2
 *
 * @package ColeebriCatalogueEmbed
 */

if (!defined('ABSPATH')) {
    exit;
}

function coleebri_catalogue_base_url() {
    if (defined('COLEEBRI_CATALOGUE_BASE') && COLEEBRI_CATALOGUE_BASE) {
        $base = COLEEBRI_CATALOGUE_BASE;
    } else {
        $base = 'https://guillaumegual-hue.github.io/catalogue/';
    }
    return trailingslashit($base);
}

function coleebri_catalogue_asset_ver() {
    return '20260531a';
}

function coleebri_catalogue_embed_script_url() {
    return coleebri_catalogue_base_url() . 'assets/coleebri-embed.js';
}

function coleebri_opnform_public_base() {
    if (defined('COLEEBRI_OPNFORM_PUBLIC_BASE') && COLEEBRI_OPNFORM_PUBLIC_BASE) {
        return untrailingslashit(COLEEBRI_OPNFORM_PUBLIC_BASE);
    }
    return 'https://app.coleebri.eu';
}

function coleebri_opnform_enquiry_slug() {
    if (defined('COLEEBRI_OPNFORM_ENQUIRY_SLUG') && COLEEBRI_OPNFORM_ENQUIRY_SLUG) {
        return sanitize_title(COLEEBRI_OPNFORM_ENQUIRY_SLUG);
    }
    return 'test-enquiry';
}

function coleebri_catalogue_wp_site_base() {
    if (defined('COLEEBRI_WP_SITE_BASE') && COLEEBRI_WP_SITE_BASE) {
        return trailingslashit(COLEEBRI_WP_SITE_BASE);
    }
    return trailingslashit(home_url('/en'));
}

function coleebri_catalogue_should_load_bridge() {
    if (defined('COLEEBRI_CATALOGUE_BRIDGE') && !COLEEBRI_CATALOGUE_BRIDGE) {
        return false;
    }
    if (is_admin()) {
        return false;
    }
    return apply_filters('coleebri_catalogue_load_bridge', true);
}

function coleebri_catalogue_enqueue_bridge() {
    if (!coleebri_catalogue_should_load_bridge()) {
        return;
    }

    $base = coleebri_catalogue_base_url();
    $ver  = coleebri_catalogue_asset_ver();

    wp_enqueue_style(
        'coleebri-wp-bridge',
        $base . 'assets/coleebri-wp-bridge.css',
        array(),
        $ver
    );

    wp_enqueue_script(
        'coleebri-wp-bridge',
        $base . 'assets/coleebri-wp-bridge.js',
        array(),
        $ver,
        true
    );

    wp_localize_script(
        'coleebri-wp-bridge',
        'ColeebriWpBridge',
        array(
            'opnformPublicBase' => coleebri_opnform_public_base(),
            'enquirySlug'       => coleebri_opnform_enquiry_slug(),
            'compareMax'        => 3,
            'storageKey'        => 'coleebri-health-embed-state',
            'allowedOrigins'    => array(
                'https://health.coleebri.com',
                'https://www.health.coleebri.com',
                'https://guillaumegual-hue.github.io',
            ),
            'prefillKeys'       => array('test_name', 'test_code', 'test_id', 'source_page', 'category'),
        )
    );
}
add_action('wp_enqueue_scripts', 'coleebri_catalogue_enqueue_bridge');

function coleebri_catalogue_shortcode($atts) {
    $atts = shortcode_atts(
        array(
            'widget'        => 'glossary',
            'height'        => '560',
            'service'       => '',
            'section'       => '',
            'category'      => '',
            'marker'        => '',
            'test'          => '',
            'tests'         => '',
            'group'         => '',
            'branding'      => 'partner',
            'header'        => '',
            'logo'          => '',
            'name'          => '',
            'link'          => '',
            'class'         => '',
            'integrated'    => '',
            'transparent'   => '',
            'display_only'  => '',
            'site'          => '',
        ),
        $atts,
        'coleebri_catalogue'
    );

    $allowed = array(
        'glossary', 'marker', 'marker-check', 'disclaimer', 'cta', 'catalogue',
        'tests', 'section', 'tabs', 'nav', 'quiz', 'collection', 'compliance', 'patient-info', 'patient-information',
        'most-ordered', 'categories', 'category-list',
    );
    $widget  = in_array($atts['widget'], $allowed, true) ? $atts['widget'] : 'glossary';
    $height  = preg_replace('/[^0-9]/', '', (string) $atts['height']);
    if (!$height) {
        $height = '560';
    }

    $service  = $atts['service'] !== '' ? $atts['service'] : $atts['section'];
    $category = sanitize_key($atts['category']);
    $marker   = sanitize_key($atts['marker']);
    $test     = preg_replace('/[^A-Za-z0-9_-]/', '', (string) $atts['test']);
    $tests    = preg_replace('/[^A-Za-z0-9_,\s-]/', '', (string) $atts['tests']);
    $group    = sanitize_key($atts['group']);
    $branding = strtolower((string) $atts['branding']);
    $header   = sanitize_key($atts['header']);
    $logo     = strtolower((string) $atts['logo']);
    $name     = strtolower((string) $atts['name']);
    $link     = strtolower((string) $atts['link']);

    $integrated  = in_array(strtolower($atts['integrated']), array('1', 'true', 'yes'), true);
    $transparent = in_array(strtolower($atts['transparent']), array('1', 'true', 'yes'), true);
    $display_only = in_array(strtolower($atts['display_only']), array('1', 'true', 'yes'), true);

    if ($widget === 'tests' && $branding === 'partner' && $atts['branding'] === 'partner' && !$integrated) {
        $integrated  = true;
        $transparent = true;
        $display_only = true;
    }

    $site = $atts['site'] !== '' ? esc_url(trailingslashit($atts['site'])) : esc_url(coleebri_catalogue_wp_site_base());

    $base = esc_url(coleebri_catalogue_base_url());
    $id   = 'coleebri-embed-' . wp_unique_id();
    $ver  = coleebri_catalogue_asset_ver();

    $attrs = sprintf(
        'id="%s" class="coleebri-catalogue-embed %s" data-coleebri-embed="%s" data-height="%s" data-coleebri-base="%s"',
        esc_attr($id),
        esc_attr($atts['class']),
        esc_attr($widget),
        esc_attr($height),
        $base
    );

    if ($integrated) {
        $attrs .= ' data-integrated="1" data-site="' . esc_attr($site) . '"';
    }
    if ($transparent) {
        $attrs .= ' data-transparent="1"';
    }
    if ($display_only) {
        $attrs .= ' data-display-only="1"';
    }
    if ($service !== '') {
        $attrs .= sprintf(' data-service="%s"', esc_attr(sanitize_key($service)));
    }
    if ($category !== '') {
        $attrs .= sprintf(' data-category="%s"', esc_attr($category));
    }
    if ($marker !== '') {
        $attrs .= sprintf(' data-marker="%s"', esc_attr($marker));
    }
    if ($group !== '') {
        $attrs .= sprintf(' data-group="%s"', esc_attr($group));
    } elseif ($test !== '') {
        $attrs .= sprintf(' data-test="%s"', esc_attr(strtoupper($test)));
    } elseif ($tests !== '') {
        $attrs .= sprintf(' data-tests="%s"', esc_attr($tests));
    }
    if ($header !== '') {
        $attrs .= sprintf(' data-header="%s"', esc_attr($header));
    } elseif (in_array($branding, array('0', 'false', 'none', 'off', 'internal'), true)) {
        $attrs .= ' data-branding="none"';
    } elseif ($logo !== '' || $name !== '' || $link !== '') {
        $attrs .= sprintf(' data-logo="%s"', esc_attr(in_array($logo, array('0', 'false', 'no', 'off'), true) ? '0' : '1'));
        $attrs .= sprintf(' data-name="%s"', esc_attr(in_array($name, array('1', 'true', 'yes'), true) ? '1' : '0'));
        $attrs .= sprintf(' data-link="%s"', esc_attr(in_array($link, array('0', 'false', 'no', 'off'), true) ? '0' : '1'));
    } elseif (!in_array($branding, array('partner', 'external', '1', 'true', ''), true) && $branding !== '') {
        $attrs .= sprintf(' data-header="%s"', esc_attr($branding));
    }

    static $script_enqueued = false;
    $html = '<div ' . $attrs . '></div>';

    if (!$script_enqueued) {
        $html .= sprintf(
            '<script src="%sassets/coleebri-embed-params.js?v=%s"><\/script>',
            $base,
            esc_attr($ver)
        );
        $html .= sprintf(
            '<script src="%s" data-base="%s" defer><\/script>',
            esc_url(coleebri_catalogue_embed_script_url() . '?v=' . $ver),
            $base
        );
        $script_enqueued = true;
    }

    return $html;
}
add_shortcode('coleebri_catalogue', 'coleebri_catalogue_shortcode');

/**
 * Inline OpnForm on hub or landing pages.
 * Usage: [coleebri_opnform slug="test-enquiry" height="720"]
 */
function coleebri_opnform_shortcode($atts) {
    $atts = shortcode_atts(
        array(
            'slug'   => coleebri_opnform_enquiry_slug(),
            'height' => '720',
            'class'  => '',
        ),
        $atts,
        'coleebri_opnform'
    );

    $slug   = sanitize_title($atts['slug']);
    $height = preg_replace('/[^0-9]/', '', (string) $atts['height']);
    if (!$height) {
        $height = '720';
    }

    $src = esc_url(coleebri_opnform_public_base() . '/forms/' . $slug);
    return sprintf(
        '<iframe class="coleebri-opnform-embed %s" src="%s" title="%s" style="width:100%%;border:0;min-height:%spx;background:transparent" loading="lazy"></iframe>',
        esc_attr($atts['class']),
        $src,
        esc_attr__('Coleebri Health form', 'coleebri-catalogue'),
        esc_attr($height)
    );
}
add_shortcode('coleebri_opnform', 'coleebri_opnform_shortcode');
