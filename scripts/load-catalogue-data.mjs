import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function loadCatalogueData() {
  const dataJs = readFileSync(join(root, 'data.js'), 'utf8');
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(dataJs, sandbox);
  return {
    tests: sandbox.window.TESTS || [],
    sections: sandbox.window.SECTIONS || [],
    tracks: sandbox.window.TRACKS || [],
    tabs: sandbox.window.CATALOGUE_TABS || [],
    sampleTypes: sandbox.window.SAMPLE_TYPES || {},
  };
}
