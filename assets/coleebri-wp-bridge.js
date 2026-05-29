/**
 * WordPress parent bridge: OpnForm enquiry modal, compare drawer, shortlist.
 * Config: window.ColeebriWpBridge (from wp_localize_script).
 */
(function () {
  'use strict';

  var CFG = window.ColeebriWpBridge || {};
  var STORAGE_KEY = CFG.storageKey || 'coleebri-health-embed-state';
  var COMPARE_MAX = CFG.compareMax || 3;
  var ALLOWED = CFG.allowedOrigins || [
    'https://health.coleebri.com',
    'https://www.health.coleebri.com',
    'https://guillaumegual-hue.github.io',
  ];
  var PUBLIC_BASE = (CFG.opnformPublicBase || 'https://app.coleebri.eu').replace(/\/$/, '');
  var ENQUIRY_SLUG = CFG.enquirySlug || 'test-enquiry';
  var PREFILL_KEYS = CFG.prefillKeys || ['test_name', 'test_code', 'test_id', 'source_page', 'category'];

  var state = loadState();
  var iframes = [];

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      /* ignore */
    }
    return { compare: [], list: [] };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
    broadcastState();
    renderDrawer();
  }

  function testKey(t) {
    return (t.code || '') + (t.name || '');
  }

  function isAllowedOrigin(origin) {
    if (!origin) return false;
    for (var i = 0; i < ALLOWED.length; i++) {
      if (origin === ALLOWED[i] || origin.indexOf(ALLOWED[i]) === 0) return true;
    }
    return false;
  }

  function findIframe(win) {
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow === win) return iframes[i];
    }
    return null;
  }

  function broadcastState() {
    var payload = {
      type: 'coleebri-state',
      comparedKeys: state.compare.map(testKey),
      listKeys: state.list.map(testKey),
    };
    for (var i = 0; i < iframes.length; i++) {
      try {
        iframes[i].contentWindow.postMessage(payload, '*');
      } catch (e) {
        /* ignore */
      }
    }
  }

  function toggleIn(arr, test) {
    var k = testKey(test);
    var idx = -1;
    for (var i = 0; i < arr.length; i++) {
      if (testKey(arr[i]) === k) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) {
      arr.splice(idx, 1);
      return;
    }
    arr.push(test);
    while (arr.length > COMPARE_MAX) arr.shift();
  }

  function buildEnquiryUrl(test) {
    var url = PUBLIC_BASE + '/forms/' + encodeURIComponent(ENQUIRY_SLUG);
    var params = new URLSearchParams();
    if (test) {
      if (PREFILL_KEYS.indexOf('test_name') !== -1 && test.name) params.set('test_name', test.name);
      if (PREFILL_KEYS.indexOf('test_code') !== -1 && test.code) params.set('test_code', test.code);
      if (PREFILL_KEYS.indexOf('test_id') !== -1 && test.id) params.set('test_id', test.id);
      if (PREFILL_KEYS.indexOf('category') !== -1) {
        params.set('category', test.section || (test.tracks && test.tracks[0]) || '');
      }
    }
    if (PREFILL_KEYS.indexOf('source_page') !== -1) {
      params.set('source_page', window.location.href);
    }
    var q = params.toString();
    return q ? url + '?' + q : url;
  }

  function openEnquiryModal(test) {
    var modal = document.getElementById('coleebri-enquiry-modal');
    var frame = document.getElementById('coleebri-enquiry-frame');
    var title = document.getElementById('coleebri-enquiry-title');
    if (!modal || !frame) return;
    if (title) {
      title.textContent = test && test.name ? 'Enquire: ' + test.name : 'Test enquiry';
    }
    frame.src = buildEnquiryUrl(test);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeEnquiryModal() {
    var modal = document.getElementById('coleebri-enquiry-modal');
    var frame = document.getElementById('coleebri-enquiry-frame');
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (frame) frame.src = 'about:blank';
  }

  function openCompareEnquiry() {
    if (!state.compare.length) return;
    var names = state.compare.map(function (t) {
      return t.name + ' (' + t.code + ')';
    });
    var pseudo = {
      id: state.compare.map(function (t) {
        return t.id;
      }).join(','),
      code: state.compare.length + ' tests',
      name: names.join('; '),
      section: state.compare[0].section,
      tracks: state.compare[0].tracks,
    };
    openEnquiryModal(pseudo);
  }

  function ensureUi() {
    if (document.getElementById('coleebri-wp-compare-drawer')) return;

    var drawer = document.createElement('div');
    drawer.id = 'coleebri-wp-compare-drawer';
    drawer.className = 'coleebri-wp-compare-drawer';
    drawer.hidden = true;
    drawer.innerHTML =
      '<span class="coleebri-wp-compare-drawer__label">Compare</span>' +
      '<div class="coleebri-wp-compare-drawer__pins" id="coleebri-wp-pins"></div>' +
      '<button type="button" class="coleebri-wp-compare-drawer__open" id="coleebri-wp-compare-enquire" disabled>Enquire about selection</button>' +
      '<button type="button" class="coleebri-wp-compare-drawer__clear" id="coleebri-wp-compare-clear" aria-label="Clear compare">×</button>';
    document.body.appendChild(drawer);

    document.getElementById('coleebri-wp-compare-clear').addEventListener('click', function () {
      state.compare = [];
      saveState();
    });
    document.getElementById('coleebri-wp-compare-enquire').addEventListener('click', openCompareEnquiry);

    var modal = document.createElement('div');
    modal.id = 'coleebri-enquiry-modal';
    modal.className = 'coleebri-wp-enquiry-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<div class="coleebri-wp-enquiry-modal__panel">' +
      '<div class="coleebri-wp-enquiry-modal__head">' +
      '<h2 id="coleebri-enquiry-title">Test enquiry</h2>' +
      '<button type="button" class="coleebri-wp-enquiry-modal__close" id="coleebri-enquiry-close" aria-label="Close">×</button>' +
      '</div>' +
      '<iframe class="coleebri-wp-enquiry-modal__frame" id="coleebri-enquiry-frame" title="Test enquiry form"></iframe>' +
      '</div>';
    document.body.appendChild(modal);

    document.getElementById('coleebri-enquiry-close').addEventListener('click', closeEnquiryModal);
    modal.addEventListener('click', function (ev) {
      if (ev.target === modal) closeEnquiryModal();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closeEnquiryModal();
    });
  }

  function renderDrawer() {
    ensureUi();
    var drawer = document.getElementById('coleebri-wp-compare-drawer');
    var pins = document.getElementById('coleebri-wp-pins');
    var btn = document.getElementById('coleebri-wp-compare-enquire');
    if (!drawer || !pins) return;

    if (!state.compare.length) {
      drawer.hidden = true;
      return;
    }
    drawer.hidden = false;
    pins.innerHTML = '';
    state.compare.forEach(function (t) {
      var el = document.createElement('span');
      el.className = 'coleebri-wp-compare-drawer__pin';
      var label = t.name.length > 28 ? t.name.slice(0, 28) + '…' : t.name;
      el.innerHTML = label + ' <button type="button" aria-label="Remove">×</button>';
      el.querySelector('button').addEventListener('click', function () {
        toggleIn(state.compare, t);
        saveState();
      });
      pins.appendChild(el);
    });
    if (btn) btn.disabled = state.compare.length < 1;
  }

  function trackIframes() {
    document.querySelectorAll('iframe[data-coleebri-widget]').forEach(function (frame) {
      if (iframes.indexOf(frame) === -1) iframes.push(frame);
    });
  }

  function onMessage(ev) {
    if (!isAllowedOrigin(ev.origin)) return;
    var data = ev.data;
    if (!data || typeof data.type !== 'string') return;

    if (data.type === 'coleebri-embed-ready') {
      if (ev.source) {
        var matched = false;
        for (var i = 0; i < iframes.length; i++) {
          if (iframes[i].contentWindow === ev.source) matched = true;
        }
        if (!matched && findIframe(ev.source)) {
          /* already tracked via data attr */
        }
      }
      try {
        ev.source.postMessage(
          {
            type: 'coleebri-state',
            comparedKeys: state.compare.map(testKey),
            listKeys: state.list.map(testKey),
          },
          ev.origin
        );
      } catch (e) {
        /* ignore */
      }
      return;
    }

    if (data.type === 'coleebri-enquire' && data.test) {
      openEnquiryModal(data.test);
      return;
    }

    if (data.type === 'coleebri-compare' && data.test) {
      if (data.action === 'clear') state.compare = [];
      else toggleIn(state.compare, data.test);
      saveState();
      return;
    }

    if (data.type === 'coleebri-list' && data.test) {
      if (data.action === 'clear') state.list = [];
      else toggleIn(state.list, data.test);
      saveState();
      return;
    }

    if (data.type === 'coleebri-open-quiz') {
      var anchor = document.getElementById('coleebri-hub-quiz');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function init() {
    ensureUi();
    renderDrawer();
    trackIframes();
    window.addEventListener('message', onMessage);
    var obs = new MutationObserver(trackIframes);
    obs.observe(document.body, { childList: true, subtree: true });
    window.ColeebriWpBridgeApi = {
      openEnquiry: openEnquiryModal,
      getState: function () {
        return state;
      },
      clearCompare: function () {
        state.compare = [];
        saveState();
      },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
