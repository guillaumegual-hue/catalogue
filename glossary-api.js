/* Marker lookup — Coleebri plain-language text + outbound links only (no NHS/NICE body text). */

(function () {
  const SLUG_DISCLAIMER_KIND = {
    'pcr-sti': 'sexual',
    ige: 'allergy',
    'ttg-iga': 'allergy',
    amh: 'fitness',
    psa: 'general',
    testosterone: 'general',
  };

  function searchMarkers(query) {
    const entries = window.ColeebriGlossary.getEntries();
    const q = String(query || '')
      .trim()
      .toLowerCase();
    if (!q) return entries;
    return entries.filter(function (e) {
      const haystack = [e.slug, e.term, e.also || '', e.plain].join(' ').toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
  }

  function resolveMarkerSlug(input) {
    const q = String(input || '').trim().toLowerCase();
    if (!q) return null;
    const entries = window.ColeebriGlossary.getEntries();
    const exact = entries.find(function (e) {
      return e.slug === q;
    });
    if (exact) return exact.slug;
    const byTerm = entries.find(function (e) {
      const label = (e.term + ' ' + (e.also || '')).toLowerCase();
      return label === q || e.term.toLowerCase() === q;
    });
    if (byTerm) return byTerm.slug;
    const matches = searchMarkers(q);
    return matches.length === 1 ? matches[0].slug : null;
  }

  function lookupMarker(slugOrQuery) {
    const slug = resolveMarkerSlug(slugOrQuery) || slugOrQuery;
    const entry = window.ColeebriGlossary.getEntry(slug);
    if (!entry) {
      return {
        ok: false,
        error: 'We could not find that marker. Choose one from the list or try another name.',
      };
    }

    const g = entry.guidance || {};
    const disclaimerKind = SLUG_DISCLAIMER_KIND[entry.slug] || 'general';

    return {
      ok: true,
      slug: entry.slug,
      term: entry.term,
      also: entry.also,
      plain: entry.plain,
      nice: g.nice || [],
      nhs: g.nhs || [],
      disclaimer: window.ColeebriCompliance.getDisclaimer(disclaimerKind),
      glossaryNotice: window.ColeebriCompliance.GLOSSARY_NOTICE,
      lookedUpAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
    };
  }

  window.ColeebriGlossaryApi = {
    searchMarkers: searchMarkers,
    resolveMarkerSlug: resolveMarkerSlug,
    lookupMarker: lookupMarker,
  };
})();
