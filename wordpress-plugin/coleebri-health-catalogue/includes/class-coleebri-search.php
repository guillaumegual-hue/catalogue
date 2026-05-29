<?php
/**
 * Include catalogue meta in front-end search.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Coleebri_Search
{
    public static function register(): void
    {
        add_filter('posts_join', [self::class, 'posts_join'], 10, 2);
        add_filter('posts_where', [self::class, 'posts_where'], 10, 2);
        add_filter('posts_distinct', [self::class, 'posts_distinct'], 10, 2);
    }

  /**
   * @param \WP_Query $query
   */
    public static function posts_join(string $join, $query): string
    {
        if (!self::is_catalogue_search($query)) {
            return $join;
        }
        global $wpdb;
        return $join . " LEFT JOIN {$wpdb->postmeta} AS clbrmeta ON ({$wpdb->posts}.ID = clbrmeta.post_id AND clbrmeta.meta_key IN ('clbr_id','clbr_code','clbr_section','clbr_components'))";
    }

  /**
   * @param \WP_Query $query
   */
    public static function posts_where(string $where, $query): string
    {
        if (!self::is_catalogue_search($query)) {
            return $where;
        }
        global $wpdb;
        $term = $query->get('s');
        if (!$term) {
            return $where;
        }
        $like = '%' . $wpdb->esc_like($term) . '%';
        $where .= $wpdb->prepare(' OR (clbrmeta.meta_value LIKE %s)', $like);
        return $where;
    }

  /**
   * @param \WP_Query $query
   */
    public static function posts_distinct(string $distinct, $query): string
    {
        if (!self::is_catalogue_search($query)) {
            return $distinct;
        }
        return 'DISTINCT';
    }

  /**
   * @param \WP_Query $query
   */
    private static function is_catalogue_search($query): bool
    {
        if (is_admin() || !$query->is_main_query() || !$query->is_search()) {
            return false;
        }
        return true;
    }
}
