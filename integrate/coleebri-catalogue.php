<?php
/**
 * Plugin Name: Coleebri Health Catalogue Embed
 * Description: Shortcode embeds for the hosted patient catalogue (quiz, test grids, glossary). No product import.
 * Version: 1.2.0
 * Author: Coleebri Health
 * Requires at least: 6.0
 * Requires PHP: 7.2
 *
 * Usage:
 *   [coleebri_catalogue widget="glossary" height="560"]
 *   [coleebri_catalogue widget="marker" marker="hba1c" height="320"]
 *   [coleebri_catalogue widget="catalogue" service="women" height="900"]
 *   [coleebri_catalogue widget="catalogue" category="profiles" height="900"]
 *   [coleebri_catalogue widget="catalogue" branding="none" height="900"]
 *   [coleebri_catalogue widget="catalogue" test="GH014" height="720"]
 *   [coleebri_catalogue widget="catalogue" group="most-ordered" height="900"]
 *   [coleebri_catalogue widget="most-ordered" height="880"]
 *   [coleebri_catalogue widget="tests" category="profiles" height="880"]
 *   [coleebri_catalogue widget="tests" service="men" height="900"]
 *   [coleebri_catalogue widget="tabs" height="140"]
 *   [coleebri_catalogue widget="quiz" height="640"]
 *   [coleebri_catalogue widget="collection" height="720"]
 *   [coleebri_catalogue widget="compliance" height="480"]
 *   [coleebri_catalogue widget="patient-info" height="920"]
 *   [coleebri_catalogue widget="categories" height="520"]
 *
 * Optional in wp-config.php:
 *   define('COLEEBRI_CATALOGUE_BASE', 'https://health.coleebri.com/catalogue/');
 */

if (!defined('ABSPATH')) {
    exit;
}

function coleebri_catalogue_base_url() {
    if (defined('COLEEBRI_CATALOGUE_BASE') && COLEEBRI_CATALOGUE_BASE) {
        $base = COLEEBRI_CATALOGUE_BASE;
    } else {
        $base = 'https://health.coleebri.com/catalogue/';
    }
    return trailingslashit($base);
}

function coleebri_catalogue_embed_script_url() {
    return coleebri_catalogue_base_url() . 'assets/coleebri-embed.js';
}

function coleebri_catalogue_shortcode($atts) {
    $atts = shortcode_atts(
        array(
            'widget'   => 'glossary',
            'height'   => '560',
            'service'  => '',
            'section'  => '',
            'category' => '',
            'marker'    => '',
            'test'      => '',
            'tests'     => '',
            'group'     => '',
            'branding'  => 'partner',
            'header'    => '',
            'logo'      => '',
            'name'      => '',
            'link'      => '',
            'class'     => '',
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

    $service = $atts['service'] !== '' ? $atts['service'] : $atts['section'];
    $category = sanitize_key($atts['category']);
    $marker = sanitize_key($atts['marker']);
    $test = preg_replace('/[^A-Za-z0-9_-]/', '', (string) $atts['test']);
    $tests = preg_replace('/[^A-Za-z0-9_,\s-]/', '', (string) $atts['tests']);
    $group = sanitize_key($atts['group']);
    $branding = strtolower((string) $atts['branding']);
    $header = sanitize_key($atts['header']);
    $logo = strtolower((string) $atts['logo']);
    $name = strtolower((string) $atts['name']);
    $link = strtolower((string) $atts['link']);

    $base = esc_url(coleebri_catalogue_base_url());
    $id   = 'coleebri-embed-' . wp_unique_id();

    $attrs = sprintf(
        'id="%s" class="coleebri-catalogue-embed %s" data-coleebri-embed="%s" data-height="%s" data-coleebri-base="%s"',
        esc_attr($id),
        esc_attr($atts['class']),
        esc_attr($widget),
        esc_attr($height),
        $base
    );

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
        $attrs .= ' data-branding="0"';
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
            '<script src="%sassets/coleebri-embed-params.js?v=20260601a"><\/script>',
            $base
        );
        $html .= sprintf(
            '<script src="%s" data-base="%s" defer><\/script>',
            esc_url(coleebri_catalogue_embed_script_url() . '?v=20260601a'),
            $base
        );
        $script_enqueued = true;
    }

    return $html;
}

add_shortcode('coleebri_catalogue', 'coleebri_catalogue_shortcode');
