<?php
/**
 * coleebri_test — searchable index posts synced from catalogue data.js.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Coleebri_Test_CPT
{
    public const POST_TYPE = 'coleebri_test';

    public const META = [
        'clbr_id'       => 'string',
        'clbr_code'     => 'string',
        'clbr_section'  => 'string',
        'clbr_tracks'   => 'string',
        'clbr_samples'  => 'string',
        'clbr_turnaround' => 'string',
        'clbr_price'    => 'string',
        'clbr_price_upper' => 'boolean',
        'clbr_components' => 'string',
        'clbr_catalogue_hash' => 'string',
    ];

    public static function register(): void
    {
        register_post_type(self::POST_TYPE, [
            'labels' => [
                'name'          => __('Blood tests', 'coleebri-health-catalogue'),
                'singular_name' => __('Blood test', 'coleebri-health-catalogue'),
                'add_new_item'  => __('Add blood test', 'coleebri-health-catalogue'),
                'edit_item'     => __('Edit blood test', 'coleebri-health-catalogue'),
            ],
            'public'              => true,
            'publicly_queryable'  => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_rest'        => true,
            'has_archive'         => false,
            'exclude_from_search' => false,
            'menu_icon'           => 'dashicons-heart',
            'supports'            => ['title', 'editor', 'excerpt', 'custom-fields'],
            'rewrite'             => [
                'slug'       => 'blood-test',
                'with_front' => false,
            ],
            'capability_type'     => 'post',
        ]);
    }

    public static function register_meta(): void
    {
        foreach (self::META as $key => $type) {
            register_post_meta(self::POST_TYPE, $key, [
                'type'              => $type,
                'single'            => true,
                'show_in_rest'      => true,
                'auth_callback'     => static function () {
                    return current_user_can('edit_posts');
                },
            ]);
        }
    }

    /**
     * @param array<string, mixed> $test Catalogue test object from data.js
     */
    public static function build_post_payload(array $test): array
    {
        $id = (string) ($test['id'] ?? '');
        $name = (string) ($test['name'] ?? 'Test');
        $blurb = (string) ($test['blurb'] ?? '');
        $code = (string) ($test['code'] ?? '');
        $section = (string) ($test['section'] ?? '');
        $tracks = isset($test['tracks']) && is_array($test['tracks']) ? $test['tracks'] : [];
        $samples = isset($test['samples']) && is_array($test['samples']) ? $test['samples'] : [];
        $components = isset($test['components']) && is_array($test['components']) ? $test['components'] : [];

        $primary_track = $tracks[0] ?? $section;
        $hash_parts = [];
        if ($primary_track && $primary_track !== 'all') {
            $hash_parts[] = 'service=' . rawurlencode($primary_track);
        }
        $hash_parts[] = 'test=' . rawurlencode($id);
        $catalogue_hash = '#' . implode('&', $hash_parts);

        $search_blob = strtolower(implode(' ', array_filter([
            $name,
            $code,
            $id,
            $blurb,
            $section,
            implode(' ', $tracks),
            implode(' ', $components),
        ])));

        $slug = sanitize_title($id . '-' . substr(preg_replace('/[^a-z0-9]+/i', '-', $name), 0, 48));
        $price = isset($test['price']) ? (string) $test['price'] : '';
        $excerpt = $code ? $code . ' — ' : '';
        if ($price !== '' && $price !== 'POA') {
            $excerpt .= is_numeric($price) ? '£' . $price : $price;
        }

        return [
            'title'   => $name,
            'slug'    => $slug,
            'content' => $blurb,
            'excerpt' => $excerpt,
            'status'  => 'publish',
            'meta'    => [
                'clbr_id'            => $id,
                'clbr_code'          => $code,
                'clbr_section'       => $section,
                'clbr_tracks'        => wp_json_encode($tracks),
                'clbr_samples'       => wp_json_encode($samples),
                'clbr_turnaround'    => (string) ($test['turnaround'] ?? ''),
                'clbr_price'         => $price,
                'clbr_price_upper'   => !empty($test['priceUpper']),
                'clbr_components'    => wp_json_encode($components),
                'clbr_catalogue_hash'=> $catalogue_hash,
                '_coleebri_search_blob' => $search_blob,
            ],
        ];
    }
}
