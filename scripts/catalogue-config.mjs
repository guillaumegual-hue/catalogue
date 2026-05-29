/** Shared URLs for catalogue ↔ WordPress integration. */
export const CATALOGUE_BASE_PROD = 'https://health.coleebri.com/catalogue/';
export const CATALOGUE_BASE_STAGING = 'https://guillaumegual-hue.github.io/catalogue/';
export const WP_SITE_BASE = 'https://health.coleebri.com/en';
export const CATALOGUE_HTML = 'index.html';

export function catalogueBase(env = process.env) {
  return (
    env.COLEEBRI_CATALOGUE_BASE ||
    env.COLEEBRI_CATALOGUE_PUBLIC_URL ||
    CATALOGUE_BASE_PROD
  ).replace(/\/?$/, '/');
}

export function catalogueDeepLink(opts = {}, base = catalogueBase()) {
  const parts = [];
  if (opts.service && opts.service !== 'all') parts.push(`service=${encodeURIComponent(opts.service)}`);
  if (opts.category) parts.push(`category=${encodeURIComponent(opts.category)}`);
  if (opts.test) parts.push(`test=${encodeURIComponent(opts.test)}`);
  const hash = parts.length ? `#${parts.join('&')}` : '#top';
  return `${base}${CATALOGUE_HTML}${hash}`;
}
