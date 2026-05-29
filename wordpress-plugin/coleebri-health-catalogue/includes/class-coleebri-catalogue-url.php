<?php
/**
 * Build catalogue URLs (static app on same domain or staging).
 */

if (!defined('ABSPATH')) {
    exit;
}

class Coleebri_Catalogue_URL
{
    public static function base(): string
    {
        return coleebri_catalogue_base();
    }

    public static function html_file(): string
    {
        return 'Coleebri%20Patient%20Catalogue.html';
    }

    public static function deep_link(array $args = []): string
    {
        $base = self::base();
        $parts = [];
        if (!empty($args['service']) && $args['service'] !== 'all') {
            $parts[] = 'service=' . rawurlencode((string) $args['service']);
        }
        if (!empty($args['category'])) {
            $parts[] = 'category=' . rawurlencode((string) $args['category']);
        }
        if (!empty($args['test'])) {
            $parts[] = 'test=' . rawurlencode((string) $args['test']);
        }
        $hash = $parts ? '#' . implode('&', $parts) : '#top';
        return $base . self::html_file() . $hash;
    }
}
