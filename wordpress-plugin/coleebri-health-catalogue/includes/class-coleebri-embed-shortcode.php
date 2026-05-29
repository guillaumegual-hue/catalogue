<?php
/**
 * Legacy embed shortcode — prefer catalogue CTAs on service pages.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Coleebri_Embed_Shortcode
{
    public static function register(): void
    {
        add_shortcode('coleebri_catalogue', [self::class, 'render']);
    }

    /**
     * @param array<string, string> $atts
     */
    public static function render($atts): string
    {
        $atts = shortcode_atts([
            'widget'   => 'tests',
            'service'  => '',
            'category' => '',
            'height'   => '900',
            'branding' => 'none',
        ], $atts, 'coleebri_catalogue');

        $base = esc_url(coleebri_catalogue_base());
        $widget = sanitize_key($atts['widget']);
        $qs = 'widget=' . rawurlencode($widget);
        if ($atts['service'] !== '') {
            $qs .= '&service=' . rawurlencode($atts['service']);
        }
        if ($atts['category'] !== '') {
            $qs .= '&category=' . rawurlencode($atts['category']);
        }
        $qs .= '&branding=none&transparent=1';

        $src = $base . 'embed/?' . $qs;
        $height = (int) $atts['height'];
        if ($height < 120) {
            $height = 900;
        }

        return sprintf(
            '<iframe src="%s" title="%s" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" ' .
            'style="width:100%%;border:0;border-radius:12px;min-height:%dpx;display:block;background:transparent"></iframe>',
            esc_url($src),
            esc_attr__('Coleebri Health catalogue', 'coleebri-health-catalogue'),
            $height
        );
    }
}
