(function () {
  'use strict';

  function detectBase() {
    var href = location.href.split('#')[0].split('?')[0];
    if (location.protocol === 'file:') {
      if (/\/integrate\/index\.html$/i.test(href)) {
        return decodeURI(href.replace(/integrate\/index\.html$/i, ''));
      }
      if (/\/integrate\.html$/i.test(href)) {
        return decodeURI(href.replace(/integrate\.html$/i, ''));
      }
      return decodeURI(href.replace(/[^/]+$/, ''));
    }
    var path = location.pathname.replace(/\/integrate(?:\/.*|\.html)?$/i, '/');
    if (path.slice(-1) !== '/') path += '/';
    return location.origin + path;
  }

  var baseInput = document.getElementById('integrate-base-url');
  var previewEl = document.getElementById('embed-base-preview');
  var widgetSelect = document.getElementById('snippet-widget');
  var heightInput = document.getElementById('snippet-height');
  var serviceWrap = document.getElementById('snippet-service-wrap');
  var serviceSelect = document.getElementById('snippet-service');
  var categoryWrap = document.getElementById('snippet-category-wrap');
  var categorySelect = document.getElementById('snippet-category');
  var markerWrap = document.getElementById('snippet-marker-wrap');
  var markerSelect = document.getElementById('snippet-marker');
  var headerPresetSelect = document.getElementById('snippet-header-preset');
  var headerCustomWrap = document.getElementById('snippet-header-custom');
  var headerLogoCheck = document.getElementById('snippet-header-logo');
  var headerNameCheck = document.getElementById('snippet-header-name');
  var headerLinkCheck = document.getElementById('snippet-header-link');
  var testWrap = document.getElementById('snippet-test-wrap');
  var testSelect = document.getElementById('snippet-test');
  var groupWrap = document.getElementById('snippet-group-wrap');
  var groupSelect = document.getElementById('snippet-group');
  var testsInputWrap = document.getElementById('snippet-tests-wrap');
  var testsInput = document.getElementById('snippet-tests');
  var snippetOut = document.getElementById('snippet-output');
  var iframeOut = document.getElementById('iframe-snippet');
  var copyBtn = document.getElementById('snippet-copy');
  var livePreview = document.getElementById('integrate-live-preview');

  var defaultHeights = {
    glossary: 560,
    marker: 320,
    'marker-check': 520,
    disclaimer: 320,
    cta: 220,
    catalogue: 800,
    tests: 900,
    section: 880,
    tabs: 140,
    nav: 140,
    quiz: 640,
    collection: 720,
    compliance: 480,
    'patient-info': 920,
    'most-ordered': 880,
    categories: 520,
    'category-list': 520,
  };

  function getBase() {
    var v = (baseInput && baseInput.value.trim()) || detectBase();
    if (v.slice(-1) !== '/') v += '/';
    return v;
  }

  function headerOptions() {
    var preset = headerPresetSelect ? headerPresetSelect.value : 'partner';
    if (preset === 'none') {
      return { headerPreset: 'none', branding: false };
    }
    if (preset === 'custom') {
      return {
        headerPreset: 'custom',
        branding: true,
        brandLogo: headerLogoCheck ? headerLogoCheck.checked : true,
        brandName: headerNameCheck ? headerNameCheck.checked : false,
        brandLink: headerLinkCheck ? headerLinkCheck.checked : true,
      };
    }
    return { headerPreset: preset, branding: true };
  }

  function embedOptions() {
    var header = headerOptions();
    var group = groupSelect && groupSelect.value ? groupSelect.value : '';
    var test = testSelect && testSelect.value ? testSelect.value : '';
    var tests = testsInput && testsInput.value.trim() ? testsInput.value.trim() : '';
    if (group) {
      test = '';
      tests = '';
    } else if (test) {
      tests = '';
    }
    return {
      service: serviceSelect && serviceSelect.value ? serviceSelect.value : '',
      category: categorySelect && categorySelect.value ? categorySelect.value : '',
      marker: markerSelect && markerSelect.value ? markerSelect.value : '',
      group: group,
      test: test,
      tests: tests,
      headerPreset: header.headerPreset,
      branding: header.branding,
      brandLogo: header.brandLogo,
      brandName: header.brandName,
      brandLink: header.brandLink,
    };
  }

  function buildUrl(widget) {
    var base = getBase();
    if (window.ColeebriEmbedParams) {
      return window.ColeebriEmbedParams.buildEmbedUrl(base, widget, embedOptions());
    }
    return base + 'embed/?widget=' + encodeURIComponent(widget);
  }

  function scriptSnippet() {
    var widget = widgetSelect.value;
    var height = heightInput.value || defaultHeights[widget] || 480;
    var opts = embedOptions();
    var base = getBase();
    var divAttrs =
      'data-coleebri-embed="' +
      widget +
      '" data-height="' +
      height +
      '"';
    if (opts.service) divAttrs += ' data-service="' + opts.service + '"';
    if (opts.category) divAttrs += ' data-category="' + opts.category + '"';
    if (opts.marker) divAttrs += ' data-marker="' + opts.marker + '"';
    if (opts.group) divAttrs += ' data-group="' + opts.group + '"';
    else if (opts.test) divAttrs += ' data-test="' + opts.test + '"';
    else if (opts.tests) divAttrs += ' data-tests="' + opts.tests + '"';
    if (window.ColeebriEmbedParams && window.ColeebriEmbedParams.headerDataAttrs) {
      divAttrs += window.ColeebriEmbedParams.headerDataAttrs(opts);
    } else if (!opts.branding) {
      divAttrs += ' data-branding="0"';
    }
    return (
      '<!-- Coleebri Health catalogue embed -->\n' +
      '<div ' +
      divAttrs +
      '></div>\n' +
      '<script src="' +
      base +
      'assets/coleebri-embed-params.js?v=20260601a"><\/script>\n' +
      '<script src="' +
      base +
      'assets/coleebri-embed.js?v=20260601a" data-base="' +
      base +
      '"><\/script>'
    );
  }

  function iframeOnlySnippet() {
    var widget = widgetSelect.value;
    var height = heightInput.value || defaultHeights[widget] || 480;
    return (
      '<iframe src="' +
      buildUrl(widget) +
      '" title="Coleebri Health catalogue" width="100%" height="' +
      height +
      '" style="border:0;border-radius:12px;min-height:' +
      height +
      'px" loading="lazy"></iframe>'
    );
  }

  function updateHeaderCustomPanel() {
    if (!headerCustomWrap || !headerPresetSelect) return;
    headerCustomWrap.hidden = headerPresetSelect.value !== 'custom';
  }

  function updateTargetPanels() {
    var widget = widgetSelect.value;
    var needsMarker = widget === 'glossary' || widget === 'marker' || widget === 'marker-check';
    var needsFilter =
      widget === 'catalogue' ||
      widget === 'cta' ||
      widget === 'tests' ||
      widget === 'section';
    var needsService = needsFilter || widget === 'tabs' || widget === 'nav';
    var needsCategory = needsFilter;
    var needsTests = needsFilter;
    if (markerWrap) markerWrap.hidden = !needsMarker;
    if (serviceWrap) serviceWrap.hidden = !needsService;
    if (categoryWrap) categoryWrap.hidden = !needsCategory;
    if (testWrap) testWrap.hidden = !needsTests;
    if (groupWrap) groupWrap.hidden = !needsTests;
    if (testsInputWrap) testsInputWrap.hidden = !needsTests;
    updateHeaderCustomPanel();
  }

  function populateMarkerSelect() {
    if (!markerSelect || !window.ColeebriGlossary) return;
    var current = markerSelect.value;
    markerSelect.innerHTML = '<option value="">— all / none —</option>';
    window.ColeebriGlossary.getEntries().forEach(function (entry) {
      var opt = document.createElement('option');
      opt.value = entry.slug;
      opt.textContent = entry.also ? entry.term + ' (' + entry.also + ')' : entry.term;
      markerSelect.appendChild(opt);
    });
    if (current) markerSelect.value = current;
  }

  function populateCategorySelect() {
    if (!categorySelect || !window.SECTIONS) return;
    var current = categorySelect.value;
    categorySelect.innerHTML = '<option value="">— all categories —</option>';
    window.SECTIONS.forEach(function (sec) {
      var opt = document.createElement('option');
      opt.value = sec.id;
      opt.textContent = sec.label;
      categorySelect.appendChild(opt);
    });
    if (current) categorySelect.value = current;
  }

  function populateTestSelect() {
    if (!testSelect || !window.TESTS || !window.SECTIONS) return;
    var current = testSelect.value;
    testSelect.innerHTML = '<option value="">— all tests —</option>';
    window.SECTIONS.forEach(function (sec) {
      var og = document.createElement('optgroup');
      og.label = sec.label;
      window.TESTS.filter(function (t) {
        return t.section === sec.id;
      }).forEach(function (t) {
        var opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name + ' (' + t.id + ')';
        og.appendChild(opt);
      });
      if (og.children.length) testSelect.appendChild(og);
    });
    if (current) testSelect.value = current;
  }

  function populateGroupSelect() {
    if (!groupSelect || !window.ColeebriTestGroups) return;
    var current = groupSelect.value;
    groupSelect.innerHTML = '<option value="">— no group —</option>';
    window.ColeebriTestGroups.forEach(function (g) {
      var opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.label + ' (' + g.testIds.length + ' tests)';
      groupSelect.appendChild(opt);
    });
    if (current) groupSelect.value = current;
  }

  function populateServiceSelect() {
    if (!serviceSelect || !window.TRACKS) return;
    var current = serviceSelect.value;
    serviceSelect.innerHTML =
      '<option value="">— all services —</option>' +
      '<option value="top">Home</option>' +
      '<option value="collection">Collection &amp; phlebotomy</option>' +
      '<option value="patient-information">Patient information</option>';
    window.TRACKS.forEach(function (track) {
      var opt = document.createElement('option');
      opt.value = track.id;
      opt.textContent = track.label;
      serviceSelect.appendChild(opt);
    });
    if (current) serviceSelect.value = current;
  }

  function refresh() {
    var base = getBase();
    if (baseInput && !baseInput.value) baseInput.value = base;
    if (previewEl) previewEl.textContent = buildUrl('glossary');
    if (snippetOut) snippetOut.textContent = scriptSnippet();
    if (iframeOut) iframeOut.textContent = iframeOnlySnippet();
    updateTargetPanels();
    if (livePreview && window.ColeebriEmbed) {
      var opts = embedOptions();
      livePreview.setAttribute('data-coleebri-embed', widgetSelect.value);
      livePreview.setAttribute('data-height', heightInput.value);
      livePreview.setAttribute('data-coleebri-base', base);
      if (opts.service) livePreview.setAttribute('data-service', opts.service);
      else livePreview.removeAttribute('data-service');
      if (opts.category) livePreview.setAttribute('data-category', opts.category);
      else livePreview.removeAttribute('data-category');
      if (opts.marker) livePreview.setAttribute('data-marker', opts.marker);
      else livePreview.removeAttribute('data-marker');
      livePreview.removeAttribute('data-group');
      livePreview.removeAttribute('data-test');
      livePreview.removeAttribute('data-tests');
      if (opts.group) livePreview.setAttribute('data-group', opts.group);
      else if (opts.test) livePreview.setAttribute('data-test', opts.test);
      else if (opts.tests) livePreview.setAttribute('data-tests', opts.tests);
      livePreview.removeAttribute('data-branding');
      livePreview.removeAttribute('data-header');
      livePreview.removeAttribute('data-logo');
      livePreview.removeAttribute('data-name');
      livePreview.removeAttribute('data-link');
      if (opts.headerPreset === 'none' || opts.branding === false) {
        livePreview.setAttribute('data-branding', '0');
      } else if (opts.headerPreset === 'custom') {
        livePreview.setAttribute('data-logo', opts.brandLogo !== false ? '1' : '0');
        livePreview.setAttribute('data-name', opts.brandName ? '1' : '0');
        livePreview.setAttribute('data-link', opts.brandLink !== false ? '1' : '0');
      } else if (opts.headerPreset && opts.headerPreset !== 'partner') {
        livePreview.setAttribute('data-header', opts.headerPreset);
      }
      window.ColeebriEmbed.mount(livePreview);
    }
  }

  if (baseInput) {
    baseInput.addEventListener('input', refresh);
    baseInput.value = detectBase();
  }
  function applySiteWidgetDefaults() {
    if (!widgetSelect || !headerPresetSelect) return;
    var w = widgetSelect.value;
    if (w === 'most-ordered' || w === 'categories' || w === 'category-list') {
      headerPresetSelect.value = 'none';
      updateHeaderCustomPanel();
    }
  }

  if (widgetSelect) {
    widgetSelect.addEventListener('change', function () {
      heightInput.value = defaultHeights[widgetSelect.value] || 480;
      applySiteWidgetDefaults();
      refresh();
    });
  }
  if (heightInput) heightInput.addEventListener('input', refresh);
  if (serviceSelect) serviceSelect.addEventListener('change', refresh);
  if (categorySelect) categorySelect.addEventListener('change', refresh);
  if (markerSelect) markerSelect.addEventListener('change', refresh);
  if (headerPresetSelect) {
    headerPresetSelect.addEventListener('change', function () {
      updateHeaderCustomPanel();
      refresh();
    });
  }
  if (headerLogoCheck) headerLogoCheck.addEventListener('change', refresh);
  if (headerNameCheck) headerNameCheck.addEventListener('change', refresh);
  if (headerLinkCheck) headerLinkCheck.addEventListener('change', refresh);
  if (testSelect) {
    testSelect.addEventListener('change', function () {
      if (testSelect.value && groupSelect) groupSelect.value = '';
      if (testSelect.value && testsInput) testsInput.value = '';
      refresh();
    });
  }
  if (groupSelect) {
    groupSelect.addEventListener('change', function () {
      if (groupSelect.value && testSelect) testSelect.value = '';
      if (groupSelect.value && testsInput) testsInput.value = '';
      refresh();
    });
  }
  if (testsInput) {
    testsInput.addEventListener('input', function () {
      if (testsInput.value.trim() && groupSelect) groupSelect.value = '';
      if (testsInput.value.trim() && testSelect) testSelect.value = '';
      refresh();
    });
  }

  document.querySelectorAll('.integrate-widget-card').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('.integrate-widget-card').forEach(function (c) {
        c.classList.remove('is-active');
      });
      card.classList.add('is-active');
      widgetSelect.value = card.getAttribute('data-widget');
      heightInput.value = defaultHeights[widgetSelect.value] || 480;
      refresh();
    });
  });

  if (copyBtn && snippetOut) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(snippetOut.textContent).then(function () {
        copyBtn.textContent = 'Copied';
        setTimeout(function () {
          copyBtn.textContent = 'Copy snippet';
        }, 2000);
      });
    });
  }

  var embedScript = document.querySelector('script[src*="coleebri-embed.js"]');
  if (embedScript) embedScript.setAttribute('data-base', detectBase());

  populateMarkerSelect();
  populateCategorySelect();
  populateServiceSelect();
  populateTestSelect();
  populateGroupSelect();
  applySiteWidgetDefaults();

  function recipeSnippet(widget, opts, height) {
    var prevWidget = widgetSelect.value;
    var prevService = serviceSelect ? serviceSelect.value : '';
    var prevCategory = categorySelect ? categorySelect.value : '';
    var prevHeight = heightInput.value;
    widgetSelect.value = widget;
    if (serviceSelect) serviceSelect.value = opts.service || '';
    if (categorySelect) categorySelect.value = opts.category || '';
    if (groupSelect) groupSelect.value = '';
    if (testSelect) testSelect.value = '';
    if (testsInput) testsInput.value = '';
    heightInput.value = String(height || defaultHeights[widget] || 800);
    refresh();
    var snippet = scriptSnippet();
    widgetSelect.value = prevWidget;
    if (serviceSelect) serviceSelect.value = prevService;
    if (categorySelect) categorySelect.value = prevCategory;
    heightInput.value = prevHeight;
    refresh();
    return snippet;
  }

  function renderRecipeGrid(containerId, items) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    items.forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'integrate-recipe-card';
      var title = document.createElement('h4');
      title.textContent = item.label;
      card.appendChild(title);
      if (item.blurb) {
        var p = document.createElement('p');
        p.textContent = item.blurb;
        card.appendChild(p);
      }
      var pre = document.createElement('pre');
      pre.className = 'integrate-code integrate-code--compact';
      pre.textContent = recipeSnippet(item.widget, item.opts, item.height);
      card.appendChild(pre);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-outline integrate-recipe-use';
      btn.textContent = 'Use in builder';
      btn.addEventListener('click', function () {
        widgetSelect.value = item.widget;
        if (serviceSelect) serviceSelect.value = item.opts.service || '';
        if (categorySelect) categorySelect.value = item.opts.category || '';
        if (groupSelect) groupSelect.value = '';
        if (testSelect) testSelect.value = '';
        if (testsInput) testsInput.value = '';
        heightInput.value = String(item.height || defaultHeights[item.widget] || 800);
        applySiteWidgetDefaults();
        refresh();
        document.getElementById('elementor').scrollIntoView({ behavior: 'smooth' });
      });
      card.appendChild(btn);
      el.appendChild(card);
    });
  }

  if (window.SECTIONS) {
    renderRecipeGrid(
      'integrate-section-recipes',
      window.SECTIONS.map(function (sec) {
        return {
          label: sec.label,
          blurb: sec.blurb,
          widget: 'tests',
          opts: { category: sec.id },
          height: 880,
        };
      })
    );
  }
  if (window.TRACKS) {
    renderRecipeGrid(
      'integrate-track-recipes',
      window.TRACKS.map(function (track) {
        return {
          label: track.label,
          blurb: track.blurb,
          widget: 'tests',
          opts: { service: track.id },
          height: 900,
        };
      })
    );
  }

  refresh();
})();
