/**
 * Shared embed URL helpers for Coleebri catalogue widgets.
 */
(function () {
  'use strict';

  var SERVICE_IDS = ['all', 'general', 'women', 'men', 'sexual', 'fitness', 'dna', 'collection', 'top'];

  /** Widgets intended for health.coleebri.com — no embed header by default. */
  var SITE_WIDGETS = { 'most-ordered': true, categories: true, 'category-list': true };

  /** WordPress category pages (path under site base, trailing slash). */
  var WP_SERVICE_PAGES = {
    all: '/tests/',
    general: '/tests/general-health/',
    women: '/tests/womens-health/',
    men: '/tests/mens-health/',
    sexual: '/tests/sexual-health/',
    fitness: '/tests/fitness-allergies/',
    dna: '/tests/dna/',
    collection: '/phlebotomy-vitals-check/',
  };

  var HEADER_PRESETS = {
    none: { show: false, logo: false, name: false, link: false, preset: 'none' },
    partner: { show: true, logo: true, name: false, link: true, preset: 'partner' },
    minimal: { show: true, logo: true, name: false, link: false, preset: 'minimal' },
    link: { show: true, logo: false, name: false, link: true, preset: 'link' },
    text: { show: true, logo: false, name: true, link: true, preset: 'text' },
    full: { show: true, logo: true, name: true, link: true, preset: 'full' },
  };

  function parseOnOffFlag(raw, defaultOn) {
    if (raw === null || raw === '') return defaultOn;
    return raw !== '0' && raw !== 'false' && raw !== 'no' && raw !== 'off';
  }

  function parseHeaderChrome(p) {
    var branding = p.get('branding');
    var header = p.get('header');
    var chrome = p.get('chrome');

    if (
      branding === '0' ||
      branding === 'false' ||
      branding === 'none' ||
      branding === 'off' ||
      branding === 'internal' ||
      header === 'none' ||
      header === '0' ||
      chrome === '0'
    ) {
      return HEADER_PRESETS.none;
    }

    var logoParam = p.get('logo');
    var nameParam = p.get('name');
    var linkParam = p.get('link');
    if (logoParam !== null || nameParam !== null || linkParam !== null) {
      var logo = parseOnOffFlag(logoParam, true);
      var name = parseOnOffFlag(nameParam, false);
      var link = parseOnOffFlag(linkParam, true);
      return {
        show: logo || name || link,
        logo: logo,
        name: name,
        link: link,
        preset: 'custom',
      };
    }

    var presetKey = header || branding;
    if (presetKey === 'minimal') return HEADER_PRESETS.minimal;
    if (presetKey === 'link' || presetKey === 'link-only') return HEADER_PRESETS.link;
    if (presetKey === 'text' || presetKey === 'name') return HEADER_PRESETS.text;
    if (presetKey === 'full') return HEADER_PRESETS.full;
    if (presetKey === 'partner' || presetKey === 'external' || presetKey === '1' || presetKey === 'true') {
      return HEADER_PRESETS.partner;
    }

    return HEADER_PRESETS.partner;
  }

  function applyHeaderChrome(root, chrome) {
    if (!root || !chrome) return;
    root.classList.remove(
      'coleebri-embed--no-branding',
      'coleebri-embed--no-logo',
      'coleebri-embed--no-name',
      'coleebri-embed--no-link',
      'coleebri-embed--link-only',
      'coleebri-embed--logo-only'
    );
    var brand = root.querySelector('.coleebri-embed__brand');
    if (!chrome.show) {
      root.classList.add('coleebri-embed--no-branding');
      if (brand) brand.setAttribute('hidden', 'hidden');
      return;
    }
    if (brand) brand.removeAttribute('hidden');
    if (!chrome.logo) root.classList.add('coleebri-embed--no-logo');
    if (!chrome.name) root.classList.add('coleebri-embed--no-name');
    if (!chrome.link) root.classList.add('coleebri-embed--no-link');
    if (chrome.link && !chrome.logo && !chrome.name) root.classList.add('coleebri-embed--link-only');
    if (chrome.logo && !chrome.name && !chrome.link) root.classList.add('coleebri-embed--logo-only');
  }

  function appendHeaderQuery(url, opts) {
    if (opts.headerPreset === 'none' || opts.branding === false || opts.branding === '0') {
      return url + '&branding=none';
    }
    if (opts.headerPreset && opts.headerPreset !== 'partner' && HEADER_PRESETS[opts.headerPreset]) {
      return url + '&header=' + encodeURIComponent(opts.headerPreset);
    }
    if (opts.headerPreset === 'custom' || opts.brandLogo !== undefined) {
      var logo = opts.brandLogo !== false;
      var name = !!opts.brandName;
      var link = opts.brandLink !== false;
      return url + '&logo=' + (logo ? '1' : '0') + '&name=' + (name ? '1' : '0') + '&link=' + (link ? '1' : '0');
    }
    if (opts.branding === false || opts.chrome === false) {
      return url + '&branding=0';
    }
    return url;
  }

  function headerDataAttrs(opts) {
    if (opts.headerPreset === 'none' || opts.branding === false) return ' data-branding="0"';
    if (opts.headerPreset === 'custom' || opts.brandLogo !== undefined) {
      var logo = opts.brandLogo !== false;
      var name = !!opts.brandName;
      var link = opts.brandLink !== false;
      return (
        ' data-logo="' +
        (logo ? '1' : '0') +
        '" data-name="' +
        (name ? '1' : '0') +
        '" data-link="' +
        (link ? '1' : '0') +
        '"'
      );
    }
    if (opts.headerPreset && opts.headerPreset !== 'partner') {
      return ' data-header="' + opts.headerPreset + '"';
    }
    return '';
  }

  function normalizeSiteBase(raw) {
    if (!raw) return '';
    var base = String(raw).trim();
    if (!base) return '';
    if (base.slice(-1) !== '/') base += '/';
    return base;
  }

  function isIntegratedEmbed(opts) {
    opts = opts || {};
    if (opts.integrated === true || opts.integrated === '1') return true;
    return !!normalizeSiteBase(opts.siteBase);
  }

  function resolveWpPageUrl(siteBase, serviceOrTabId) {
    var base = normalizeSiteBase(siteBase);
    if (!base) return '';
    var key = serviceOrTabId || 'all';
    if (key === 'top') key = 'all';
    var path = WP_SERVICE_PAGES[key];
    if (!path) return '';
    return base.replace(/\/$/, '') + path;
  }

  function resolveParentNavigateUrl(embed, opts) {
    embed = embed || {};
    opts = opts || {};
    var site = normalizeSiteBase(embed.siteBase);
    if (!site) return '';

    if (opts.test || opts.testId) {
      var service = opts.service || embed.service || 'all';
      var page = resolveWpPageUrl(site, service === 'all' || service === 'top' ? 'general' : service);
      if (!page) return '';
      var testId = String(opts.test || opts.testId).trim();
      return page + (page.indexOf('?') === -1 ? '?' : '&') + 'test=' + encodeURIComponent(testId);
    }

    if (opts.service !== undefined || opts.tabId !== undefined) {
      var tab = opts.tabId != null ? opts.tabId : opts.service;
      if (tab === '' || tab === 'all') return resolveWpPageUrl(site, 'all');
      return resolveWpPageUrl(site, tab);
    }

    if (opts.category) {
      return resolveWpPageUrl(site, 'all');
    }

    return '';
  }

  function parseHeaderFromElement(el) {
    if (!el) return HEADER_PRESETS.partner;
    var branding = el.getAttribute('data-branding');
    if (branding === '0' || branding === 'false' || branding === 'none' || branding === 'off') {
      return HEADER_PRESETS.none;
    }
    var preset = el.getAttribute('data-header');
    if (preset && HEADER_PRESETS[preset]) return HEADER_PRESETS[preset];
    var logo = el.getAttribute('data-logo');
    if (logo !== null) {
      return {
        show: true,
        logo: logo !== '0',
        name: el.getAttribute('data-name') === '1',
        link: el.getAttribute('data-link') !== '0',
        preset: 'custom',
      };
    }
    return HEADER_PRESETS.partner;
  }

  function splitTestIds(raw) {
    if (!raw) return [];
    return String(raw)
      .split(/[,;\s]+/)
      .map(function (s) {
        return s.trim().toUpperCase();
      })
      .filter(Boolean);
  }

  function resolveTestIds(opts) {
    opts = opts || {};
    if (opts.group && typeof window !== 'undefined' && window.ColeebriTestGroups) {
      var g = window.ColeebriTestGroups.find(function (x) {
        return x.id === opts.group;
      });
      if (g && g.testIds && g.testIds.length) return g.testIds.slice();
    }
    if (opts.tests) {
      if (Array.isArray(opts.tests)) return opts.tests.slice();
      return splitTestIds(opts.tests);
    }
    if (opts.test || opts.testId) {
      var one = String(opts.test || opts.testId).trim().toUpperCase();
      return one ? [one] : [];
    }
    return [];
  }

  function parseTestFields(p) {
    var group = p.get('group') || '';
    var test = p.get('test') || p.get('testId') || '';
    var tests = p.get('tests') || p.get('testIds') || '';
    return {
      group: group,
      test: test,
      tests: tests,
      testIds: resolveTestIds({ group: group, test: test, tests: tests }),
    };
  }

  function parseEmbedParams(search) {
    var p = new URLSearchParams(search || '');
    var service = p.get('service') || p.get('track') || '';
    if (!service && p.get('section')) service = p.get('section');
    var widget = normalizeWidget(p.get('widget') || 'glossary');
    var headerChrome = parseHeaderChrome(p);
    if (SITE_WIDGETS[widget] && p.get('branding') === null && p.get('header') === null && p.get('logo') === null) {
      headerChrome = HEADER_PRESETS.none;
    }
    var testFields = parseTestFields(p);
    var cardsOnly = p.get('cards') === '1' || p.get('cardsOnly') === '1' || widget === 'most-ordered';
    var catalogueBase = p.get('catalogue') || '';
    var siteBase = normalizeSiteBase(p.get('site') || '');
    var integrated = p.get('integrated') === '1' || p.get('integrated') === 'true' || !!siteBase;
    if (integrated && headerChrome.show && p.get('branding') === null) {
      headerChrome = HEADER_PRESETS.none;
    }
    return {
      widget: widget,
      service: service,
      category: p.get('category') || p.get('cat') || '',
      marker: p.get('marker') || p.get('slug') || '',
      group: testFields.group,
      test: testFields.test,
      tests: testFields.tests,
      testIds: testFields.testIds,
      header: headerChrome,
      headerPreset: headerChrome.preset,
      brandLogo: headerChrome.logo,
      brandName: headerChrome.name,
      brandLink: headerChrome.link,
      branding: headerChrome.show,
      chrome: headerChrome.show,
      cardsOnly: cardsOnly,
      compact: p.get('compact') === '1' || p.get('compact') === 'true',
      catalogueBase: catalogueBase,
      siteBase: siteBase,
      integrated: integrated,
      wpServicePages: WP_SERVICE_PAGES,
    };
  }

  function parseCatalogueHash(hash) {
    var raw = String(hash || '').replace(/^#/, '');
    if (!raw) return {};
    if (raw === 'patient-information') return { scroll: 'patient-information' };
    if (raw === 'about-our-service') return { scroll: 'about-our-service' };
    if (raw === 'how-results-work') return { scroll: 'how-results-work' };
    if (raw === 'our-laboratories') return { scroll: 'our-laboratories' };
    if (raw === 'cost-transparency') return { scroll: 'cost-transparency' };
    if (raw === 'terms-cancellation') return { scroll: 'terms-cancellation' };
    if (raw === 'legal-information') return { scroll: 'legal-information' };
    if (raw.indexOf('=') !== -1) {
      var q = new URLSearchParams(raw);
      var service = q.get('service') || q.get('track') || q.get('section') || '';
      var testFields = parseTestFields(q);
      return {
        service: service,
        category: q.get('category') || q.get('cat') || '',
        marker: q.get('marker') || q.get('slug') || '',
        group: testFields.group,
        test: testFields.test,
        tests: testFields.tests,
        testIds: testFields.testIds,
      };
    }
    if (raw.indexOf('test-') === 0) {
      return { test: raw.slice(5), testIds: resolveTestIds({ test: raw.slice(5) }) };
    }
    if (raw.indexOf('group-') === 0) {
      return { group: raw.slice(6), testIds: resolveTestIds({ group: raw.slice(6) }) };
    }
    if (raw.indexOf('category-') === 0) return { category: raw.slice(9) };
    if (raw.indexOf('cat-') === 0) return { category: raw.slice(4) };
    if (raw.indexOf('service-') === 0) return { service: raw.slice(8) };
    if (SERVICE_IDS.indexOf(raw) !== -1) {
      return { service: raw === 'all' || raw === 'top' ? '' : raw };
    }
    return {};
  }

  function appendTestHashParts(parts, opts) {
    if (opts.group) parts.push('group=' + encodeURIComponent(opts.group));
    else if (opts.tests) parts.push('tests=' + encodeURIComponent(opts.tests));
    else if (opts.test) parts.push('test=' + encodeURIComponent(opts.test));
    else if (opts.testId) parts.push('test=' + encodeURIComponent(opts.testId));
  }

  function buildCatalogueHash(opts) {
    opts = opts || {};
    if (opts.service === 'patient-information') return '#patient-information';
    if (opts.service === 'about-our-service') return '#about-our-service';
    if (opts.service === 'top') return '#top';
    var parts = [];
    if (opts.service && opts.service !== 'all' && opts.service !== 'top') {
      parts.push('service=' + encodeURIComponent(opts.service));
    }
    if (opts.category) parts.push('category=' + encodeURIComponent(opts.category));
    if (opts.marker) parts.push('marker=' + encodeURIComponent(opts.marker));
    appendTestHashParts(parts, opts);
    if (parts.length) return '#' + parts.join('&');
    if (opts.service && opts.service !== 'all') return '#' + opts.service;
    return '#top';
  }

  function normalizeWidget(widget) {
    var w = widget || 'glossary';
    if (w === 'section' || w === 'category-page' || w === 'service' || w === 'track') return 'tests';
    if (w === 'patient-information') return 'patient-info';
    if (w === 'category-list') return 'categories';
    return w;
  }

  function filterCatalogueTests(opts) {
    opts = opts || {};
    if (!window.TESTS) return [];
    var list = window.TESTS.slice();
    var service = opts.service || opts.track || opts.section || '';
    if (service && service !== 'all' && service !== 'top' && service !== 'collection') {
      list = list.filter(function (t) {
        return t.tracks && t.tracks.indexOf(service) !== -1;
      });
    }
    if (opts.category) {
      list = list.filter(function (t) {
        return t.section === opts.category;
      });
    }
    var ids = resolveTestIds(opts);
    if (ids.length) {
      var allowed = {};
      ids.forEach(function (id) {
        allowed[String(id).toUpperCase()] = true;
      });
      list = list.filter(function (t) {
        return allowed[t.id];
      });
    }
    return list;
  }

  function buildEmbedUrl(base, widget, opts) {
    opts = opts || {};
    widget = normalizeWidget(widget || 'glossary');
    if (base.slice(-1) !== '/') base += '/';
    var url = base + 'embed/?widget=' + encodeURIComponent(widget);
    if (opts.service) url += '&service=' + encodeURIComponent(opts.service);
    if (opts.category) url += '&category=' + encodeURIComponent(opts.category);
    if (opts.marker) url += '&marker=' + encodeURIComponent(opts.marker);
    if (opts.section && !opts.service) url += '&service=' + encodeURIComponent(opts.section);
    if (opts.group) url += '&group=' + encodeURIComponent(opts.group);
    else if (opts.tests) url += '&tests=' + encodeURIComponent(opts.tests);
    else if (opts.test) url += '&test=' + encodeURIComponent(opts.test);
    if (opts.siteBase) url += '&site=' + encodeURIComponent(opts.siteBase);
    if (opts.integrated) url += '&integrated=1';
    return appendHeaderQuery(url, opts);
  }

  window.ColeebriEmbedParams = {
    SERVICE_IDS: SERVICE_IDS,
    SITE_WIDGETS: SITE_WIDGETS,
    HEADER_PRESETS: HEADER_PRESETS,
    normalizeWidget: normalizeWidget,
    filterCatalogueTests: filterCatalogueTests,
    splitTestIds: splitTestIds,
    resolveTestIds: resolveTestIds,
    parseHeaderChrome: parseHeaderChrome,
    applyHeaderChrome: applyHeaderChrome,
    headerDataAttrs: headerDataAttrs,
    parseHeaderFromElement: parseHeaderFromElement,
    parseEmbedParams: parseEmbedParams,
    parseCatalogueHash: parseCatalogueHash,
    buildCatalogueHash: buildCatalogueHash,
    buildEmbedUrl: buildEmbedUrl,
    normalizeSiteBase: normalizeSiteBase,
    isIntegratedEmbed: isIntegratedEmbed,
    resolveWpPageUrl: resolveWpPageUrl,
    resolveParentNavigateUrl: resolveParentNavigateUrl,
    WP_SERVICE_PAGES: WP_SERVICE_PAGES,
  };
})();
