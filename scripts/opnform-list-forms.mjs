#!/usr/bin/env node
/** List forms in workspace 1. Usage: COLEEBRI_OPNFORM_TOKEN='…' node scripts/opnform-list-forms.mjs */
import { getConfig, listWorkspaceForms, requireToken } from './opnform-lib.mjs';

const cfg = getConfig();
requireToken(cfg.token);

const forms = await listWorkspaceForms(cfg);
console.log('Workspace', cfg.workspaceId, '—', forms.length, 'form(s):\n');
for (const f of forms) {
  console.log(`  id=${f.id}\tslug=${f.slug}\t${f.title}`);
}
