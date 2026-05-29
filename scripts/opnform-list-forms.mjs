#!/usr/bin/env node
/** List forms in workspace 1. Usage: node scripts/opnform-list-forms.mjs */
import { getConfig, requireToken, listWorkspaceForms } from './opnform-lib.mjs';

const cfg = getConfig();
requireToken(cfg.token);

try {
  const forms = await listWorkspaceForms(cfg);
  if (!forms.length) {
    console.log('No forms in workspace', cfg.workspaceId);
    process.exit(0);
  }
  for (const f of forms) {
    const url = f.share_url || `${cfg.publicBase}/forms/${f.slug}`;
    console.log(`${f.id}\t${f.slug}\t${f.title}\t${url}`);
  }
} catch (e) {
  console.error(e.message, e.data || '');
  process.exit(1);
}
