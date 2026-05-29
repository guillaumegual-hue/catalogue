/**
 * Coleebri Health catalogue — embed loader for WordPress / Elementor.
 * Usage:
 *   <div data-coleebri-embed="catalogue" data-service="women" data-category="profiles" data-height="800"></div>
 *   <div data-coleebri-embed="marker" data-marker="hba1c" data-height="320"></div>
 *   <script src="…/assets/coleebri-embed.js" data-base="https://yoursite.com/catalogue/"></script>
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var defaultBase = script && script.getAttribute('data-base');
  if (!defaultBase) {
    var src = (script && script.src) || '';
    defaultBase = src.replace(/\/assets\/coleebri-embed\.js.*$/, '/');
  }
  if (defaultBase && defaultBase.slice(-1) !== '/') defaultBase += '/';

  var WIDGET_LABELS = {
    glossary: 'Biomarker glossary',
    marker: 'Single biomarker',
    'marker-check': 'Check a marker',
    disclaimer: 'Patient disclaimer',
    cta: 'Catalogue call-to-action',
    catalogue: 'Full catalogue (iframe)',
    tests: 'Test cards (filtered)',
    section: 'Test cards by section',
    tabs: 'Category navigation',
    nav: 'Category navigation',
    quiz: 'Help me choose',
    collection: 'Phlebotomy & collection',
    compliance: 'Accreditation strip',
    'patient-info': 'Patient information',
    'most-ordered': 'Most ordered tests (4 panels)',
    categories: 'Catalogue categories',
    'category-list': 'Catalogue categories',
  };

  function buildEmbedUrl(base, widget, options) {
    if (window.ColeebriEmbedParams && window.ColeebriEmbedParams.buildEmbedUrl) {
      return window.ColeebriEmbedParams.buildEmbedUrl(base, widget, options);
    }
    options = options || {};
    if (base.slice(-1) !== '/') base += '/';
    var url = base + 'embed/?widget=' + encodeURIComponent(widget);
    if (options.service || options.section) {
      url += '&service=' + encodeURIComponent(options.service || options.section);
    }
    if (options.category) url += '&category=' + encodeURIComponent(options.category);
    if (options.marker) url += '&marker=' + encodeURIComponent(options.marker);
    if (options.group) url += '&group=' + encodeURIComponent(options.group);
    else if (options.tests) url += '&tests=' + encodeURIComponent(options.tests);
    else if (options.test) url += '&test=' + encodeURIComponent(options.test);
    if (window.ColeebriEmbedParams && window.ColeebriEmbedParams.appendHeaderQuery) {
      return window.ColeebriEmbedParams.appendHeaderQuery(url, options);
    }
    if (options.branding === false) url += '&branding=0';
    else if (options.theme === 'transparent') url += '&chrome=0';
    return url;
  }

  function mount(el) {
    var widget = el.getAttribute('data-coleebri-embed') || 'glossary';
    var base = el.getAttribute('data-coleebri-base') || defaultBase;
    var height = el.getAttribute('data-height') || '480';
    var service = el.getAttribute('data-service') || el.getAttribute('data-section') || '';
    var category = el.getAttribute('data-category') || '';
    var marker = el.getAttribute('data-marker') || '';
    var group = el.getAttribute('data-group') || '';
    var test = el.getAttribute('data-test') || '';
    var tests = el.getAttribute('data-tests') || '';
    var siteBase = el.getAttribute('data-site') || '';
    var integrated = el.getAttribute('data-integrated') === '1' || !!siteBase;
    var transparent =
      el.getAttribute('data-transparent') === '1' ||
      el.getAttribute('data-transparent') === 'true' ||
      (integrated && el.getAttribute('data-transparent') !== '0');
    var headerOpts = { headerPreset: 'partner', branding: true };
    if (window.ColeebriEmbedParams && window.ColeebriEmbedParams.parseHeaderFromElement) {
      var chrome = window.ColeebriEmbedParams.parseHeaderFromElement(el);
      headerOpts = {
        headerPreset: chrome.preset,
        branding: chrome.show,
        brandLogo: chrome.logo,
        brandName: chrome.name,
        brandLink: chrome.link,
      };
    }
    if (integrated) {
      headerOpts.branding = false;
      headerOpts.headerPreset = 'none';
    }
    var title = el.getAttribute('data-title') || WIDGET_LABELS[widget] || 'Coleebri Health catalogue';

    var iframe = document.createElement('iframe');
    iframe.src = buildEmbedUrl(base, widget, {
      service: service,
      category: category,
      marker: marker,
      group: group,
      test: test,
      tests: tests,
      headerPreset: headerOpts.headerPreset,
      branding: headerOpts.branding,
      brandLogo: headerOpts.brandLogo,
      brandName: headerOpts.brandName,
      brandLink: headerOpts.brandLink,
      siteBase: siteBase,
      integrated: integrated,
      transparent: transparent,
    });
    iframe.title = title;
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.style.cssText =
      'width:100%;border:0;border-radius:12px;min-height:' +
      height +
      'px;display:block;background:transparent';
    iframe.setAttribute('data-coleebri-widget', widget);

    el.innerHTML = '';
    el.appendChild(iframe);

    window.addEventListener('message', function (ev) {
      if (!ev.data || ev.data.type !== 'coleebri-embed-resize') return;
      if (ev.source !== iframe.contentWindow) return;
      var h = Number(ev.data.height);
      if (h > 0 && h < 20000) {
        iframe.style.height = Math.ceil(h) + 'px';
        iframe.style.minHeight = Math.ceil(h) + 'px';
      }
    });
  }

  function init() {
    document.querySelectorAll('[data-coleebri-embed]').forEach(mount);
  }

  window.ColeebriEmbed = {
    mount: mount,
    defaultBase: defaultBase,
    buildEmbedUrl: buildEmbedUrl,
    WIDGET_LABELS: WIDGET_LABELS,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
