<?php
/**
 * Single blood test — SEO landing; primary UX in the catalogue app.
 *
 * @package ColeebriHealthCatalogue
 */

get_header();

while (have_posts()) {
    the_post();
    $clbr_id = (string) get_post_meta(get_the_ID(), 'clbr_id', true);
    $code = (string) get_post_meta(get_the_ID(), 'clbr_code', true);
    $price = (string) get_post_meta(get_the_ID(), 'clbr_price', true);
    $turnaround = (string) get_post_meta(get_the_ID(), 'clbr_turnaround', true);
    $tracks_json = (string) get_post_meta(get_the_ID(), 'clbr_tracks', true);
    $tracks = json_decode($tracks_json, true);
    $service = is_array($tracks) && isset($tracks[0]) ? (string) $tracks[0] : '';
    $catalogue_url = coleebri_catalogue_deep_link([
        'test'    => $clbr_id,
        'service' => $service,
    ]);
    ?>
    <main class="coleebri-test-single shell" style="max-width:720px;margin:2rem auto;padding:0 1.25rem">
        <?php if ($code && $code !== '-') : ?>
            <p class="coleebri-test-single__code" style="font-size:.85rem;color:#5a6b7d"><?php echo esc_html($code); ?></p>
        <?php endif; ?>
        <h1><?php the_title(); ?></h1>
        <div class="coleebri-test-single__body"><?php the_content(); ?></div>
        <?php if ($turnaround) : ?>
            <p><strong><?php esc_html_e('Turnaround:', 'coleebri-health-catalogue'); ?></strong> <?php echo esc_html($turnaround); ?></p>
        <?php endif; ?>
        <?php if ($price !== '' && $price !== 'POA') : ?>
            <p><strong><?php esc_html_e('Indicative price:', 'coleebri-health-catalogue'); ?></strong>
                <?php echo esc_html(is_numeric($price) ? '£' . $price : $price); ?></p>
        <?php endif; ?>
        <p style="margin-top:1.5rem">
            <a class="button" href="<?php echo esc_url($catalogue_url); ?>" style="display:inline-block;padding:.75rem 1.25rem;background:#00889a;color:#fff;border-radius:999px;text-decoration:none;font-weight:600">
                <?php esc_html_e('View in catalogue & enquire', 'coleebri-health-catalogue'); ?>
            </a>
        </p>
        <p style="margin-top:1rem;font-size:.9rem;color:#5a6b7d">
            <?php esc_html_e('Compare markers, add to your list, and send an enquiry from the full patient catalogue.', 'coleebri-health-catalogue'); ?>
        </p>
    </main>
    <?php
}

get_footer();
