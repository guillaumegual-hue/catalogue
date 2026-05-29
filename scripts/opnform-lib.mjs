/**
 * Shared helpers for Coleebri OpnForm CLI scripts.
 */

export function getConfig() {
  const token = process.env.COLEEBRI_OPNFORM_TOKEN;
  const apiBase = (process.env.COLEEBRI_OPNFORM_API_BASE || 'https://app.coleebri.eu/api').replace(/\/$/, '');
  const publicBase = (process.env.COLEEBRI_OPNFORM_PUBLIC_BASE || 'https://app.coleebri.eu').replace(/\/$/, '');
  const workspaceId = process.env.COLEEBRI_OPNFORM_WORKSPACE_ID || '1';
  return { token, apiBase, publicBase, workspaceId };
}

export function requireToken(token) {
  if (!token) {
    console.error('Set COLEEBRI_OPNFORM_TOKEN (never commit tokens to git).');
    process.exit(1);
  }
}

export async function apiFetch(path, { token, apiBase, method = 'GET', body } = {}) {
  const res = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
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
  return { res, data, text };
}

/** Pull a form object out of varied OpnForm / Laravel API envelopes. */
export function extractForm(payload) {
  if (!payload || typeof payload !== 'object') return null;

  const candidates = [
    payload,
    payload.data,
    payload.form,
    payload.resource,
    payload.result,
    payload.attributes,
    payload.data?.data,
    payload.data?.form,
    payload.data?.attributes,
  ];

  for (const c of candidates) {
    if (c && typeof c === 'object' && (c.slug || c.id)) return c;
  }

  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    const inner = payload.data;
    if (inner.slug || inner.id) return inner;
  }

  return null;
}

export function normalizeFormsList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.forms)) return payload.forms;
  if (payload.data && Array.isArray(payload.data.data)) return payload.data.data;
  return [];
}

export async function listWorkspaceForms(cfg) {
  const { res, data } = await apiFetch(`/open/workspaces/${cfg.workspaceId}/forms`, cfg);
  if (!res.ok) {
    const err = new Error(`List forms failed (${res.status})`);
    err.data = data;
    err.status = res.status;
    throw err;
  }
  return normalizeFormsList(data);
}

/**
 * Load a full form for update. Self-hosted API often resolves GET/PUT by numeric id only.
 */
export async function getForm(cfg, { slug, id } = {}) {
  const tryId = async (formId) => {
    const { res, data } = await apiFetch(`/open/forms/${formId}`, cfg);
    if (!res.ok) return { res, data, form: null };
    return { res, data, form: extractForm(data) };
  };

  if (id != null && id !== '') {
    const hit = await tryId(id);
    if (hit.form) return hit.form;
  }

  if (slug) {
    let hit = await tryId(slug);
    if (hit.form) return hit.form;

    const { res, data } = await apiFetch(`/open/forms/${encodeURIComponent(slug)}`, cfg);
    if (res.ok) {
      const form = extractForm(data);
      if (form) return form;
    }

    const forms = await listWorkspaceForms(cfg);
    const match =
      forms.find((f) => f.slug === slug) ||
      forms.find((f) => String(f.id) === String(slug));
    if (match?.id) {
      hit = await tryId(match.id);
      if (hit.form) return hit.form;
    }

    if (res.status === 404) {
      const err = new Error(`Form not found: ${slug}`);
      err.status = 404;
      err.forms = forms;
      throw err;
    }
    const err = new Error(`GET form failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  throw new Error('getForm requires slug or id');
}

export function formUpdatePath(form) {
  return `/open/forms/${form.id ?? form.slug}`;
}

export function findFormByTitle(forms, title) {
  const t = String(title).trim().toLowerCase();
  return forms.filter((f) => String(f.title || '').trim().toLowerCase() === t);
}

export async function resolveFormAfterCreate(cfg, { title, createResponse }) {
  let form = extractForm(createResponse);
  if (form?.slug) return form;

  const forms = await listWorkspaceForms(cfg);
  const matches = findFormByTitle(forms, title);
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    matches.sort((a, b) => (b.id || 0) - (a.id || 0));
    return matches[0];
  }

  if (form?.id && !form.slug) {
    const { res, data } = await apiFetch(`/open/forms/${form.id}`, cfg);
    if (res.ok) {
      form = extractForm(data) || form;
      if (form.slug) return form;
    }
  }

  return form;
}

export function printFormSummary(form, publicBase) {
  const slug = form?.slug;
  const id = form?.id;
  if (!slug) {
    console.error('Could not determine form slug. Raw form object:');
    console.error(JSON.stringify(form, null, 2));
    process.exit(1);
  }
  console.log('ID:', id ?? '(see dashboard)');
  console.log('Slug:', slug);
  console.log('Title:', form.title || '');
  console.log('Public URL:', `${publicBase}/forms/${slug}`);
  console.log('');
  console.log('Add to wp-config.php:');
  console.log(`define( 'COLEEBRI_OPNFORM_ENQUIRY_SLUG', '${slug}' );`);
  console.log('');
  console.log('Inspect fields: node scripts/opnform-inspect-form.mjs', slug);
}
