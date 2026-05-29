/**
 * WordPress REST helpers for catalogue sync scripts.
 */

export function getWpConfig(env = process.env) {
  const url = (env.COLEEBRI_WP_URL || env.WP_URL || '').replace(/\/$/, '');
  const user = env.COLEEBRI_WP_USER || env.WP_USER || '';
  const password = env.COLEEBRI_WP_APP_PASSWORD || env.WP_APP_PASSWORD || '';
  if (!url || !user || !password) {
    throw new Error(
      'Set COLEEBRI_WP_URL, COLEEBRI_WP_USER, and COLEEBRI_WP_APP_PASSWORD in .env (Application Password).'
    );
  }
  const auth = Buffer.from(`${user}:${password}`).toString('base64');
  return { url, auth };
}

export async function wpFetch(path, { method = 'GET', body, env } = {}) {
  const { url, auth } = getWpConfig(env);
  const res = await fetch(`${url}/wp-json${path}`, {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg = typeof data === 'object' && data?.message ? data.message : text;
    throw new Error(`WP ${method} ${path} → ${res.status}: ${msg}`);
  }
  return data;
}

export async function wpFetchAll(path, { perPage = 100, env } = {}) {
  let page = 1;
  const all = [];
  for (;;) {
    const sep = path.includes('?') ? '&' : '?';
    const batch = await wpFetch(`${path}${sep}per_page=${perPage}&page=${page}`, { env });
    if (!Array.isArray(batch) || !batch.length) break;
    all.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }
  return all;
}
