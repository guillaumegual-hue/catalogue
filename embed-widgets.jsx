/* Coleebri — embed hosts using the same UI blocks as the main catalogue. */

function embedConfig() {
  return window.__COLEEBRI_EMBED__ || {};
}

function embedIsIntegrated() {
  const embed = embedConfig();
  return (
    !!embed.integrated ||
    !!(window.ColeebriEmbedParams && window.ColeebriEmbedParams.isIntegratedEmbed(embed))
  );
}

function embedIsDisplayOnly() {
  const embed = embedConfig();
  return (
    !!embed.displayOnly ||
    !!(window.ColeebriEmbedParams && window.ColeebriEmbedParams.isDisplayOnlyEmbed(embed))
  );
}

function embedSerializeTest(test) {
  if (window.ColeebriEmbedParams && window.ColeebriEmbedParams.serializeTestForParent) {
    return window.ColeebriEmbedParams.serializeTestForParent(test);
  }
  return test
    ? {
        id: test.id,
        code: test.code,
        name: test.name,
        section: test.section,
        tracks: test.tracks || [],
        turnaround: test.turnaround,
        price: test.price,
      }
    : null;
}

function embedPostToParent(type, payload) {
  const msg = { type: type, ...payload };
  if (window.ColeebriEmbedParams && window.ColeebriEmbedParams.postToEmbedParent) {
    return window.ColeebriEmbedParams.postToEmbedParent(msg);
  }
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(msg, '*');
    return true;
  }
  return false;
}

function embedCatalogueHref(opts) {
  const embed = embedConfig();
  if (embedIsIntegrated() && window.ColeebriEmbedParams?.resolveParentNavigateUrl) {
    const wpUrl = window.ColeebriEmbedParams.resolveParentNavigateUrl(embed, opts || {});
    if (wpUrl) return wpUrl;
  }
  const base = embed.catalogueBase || '../Coleebri%20Patient%20Catalogue.html';
  const hash =
    window.ColeebriEmbedParams && window.ColeebriEmbedParams.buildCatalogueHash
      ? window.ColeebriEmbedParams.buildCatalogueHash(opts || {})
      : '#top';
  return base + hash;
}

function embedNavigate(href) {
  if (!href) return;
  if (/^mailto:/i.test(href)) {
    if (window.parent && window.parent !== window) {
      window.parent.location.href = href;
    } else {
      window.location.href = href;
    }
    return;
  }
  if (embedIsIntegrated() && /github\.io\/catalogue/i.test(href)) {
    return;
  }
  if (window.parent && window.parent !== window) {
    window.parent.location.href = href;
  } else {
    window.location.href = href;
  }
}

function embedOpenEnquiry(test) {
  if (embedIsDisplayOnly()) {
    embedPostToParent('coleebri-enquire', { test: embedSerializeTest(test) });
    return;
  }
  const subject = encodeURIComponent('Test request: ' + test.name);
  const lines = [
    'Hello Coleebri Health,',
    '',
    'I would like to enquire about the following test from your patient catalogue:',
    '',
    test.name + ' (' + test.code + ')',
    'Turnaround: ' + (test.turnaround || '—'),
    '',
    'Please advise on next steps.',
    '',
    'Kind regards,',
  ];
  const body = encodeURIComponent(lines.join('\n'));
  embedNavigate('mailto:health@coleebri.com?subject=' + subject + '&body=' + body);
}

function embedTweaks() {
  const base = window.TWEAK_DEFAULTS || {
    showAnalytesByDefault: false,
    denseCards: false,
    showPriceTier: true,
    showBadges: true,
    primaryAccent: 'teal',
  };
  if (embedIsIntegrated()) {
    return {
      ...base,
      embedIntegrated: true,
      embedDisplayOnly: embedIsDisplayOnly(),
    };
  }
  return base;
}

function embedParentCompareToggle(test) {
  embedPostToParent('coleebri-compare', { action: 'toggle', test: embedSerializeTest(test) });
}

function embedParentListToggle(test) {
  embedPostToParent('coleebri-list', { action: 'toggle', test: embedSerializeTest(test) });
}

function EmbedMostOrdered() {
  const cart = useCart();
  const [pinned, setPinned] = React.useState([]);
  const MostOrderedSection = window.CatalogueBlocks?.MostOrderedSection;

  const compareKey = (t) => t.code + t.name;
  const handleCompare = (test) => {
    setPinned((prev) => {
      const k = compareKey(test);
      if (prev.find((p) => compareKey(p) === k)) return prev.filter((p) => compareKey(p) !== k);
      if (prev.length >= 3) return [...prev.slice(1), test];
      return [...prev, test];
    });
  };

  if (!MostOrderedSection || !window.resolveMostOrdered) {
    return <p className="glossary-plain">Most ordered tests are not available.</p>;
  }

  return (
    <MostOrderedSection
      tweaks={embedTweaks()}
      compared={pinned.map(compareKey)}
      onCompare={handleCompare}
      onOpen={(t) => (embedIsIntegrated() ? embedOpenEnquiry(t) : embedNavigate(embedCatalogueHref({ test: t.id })))}
      onCart={cart.toggle}
      inCart={cart.has}
      onBrowseTab={(tabId) => embedNavigate(embedCatalogueHref({ service: tabId }))}
    />
  );
}

function EmbedCategoryList() {
  const CatalogueCategoryList = window.CatalogueBlocks?.CatalogueCategoryList;
  if (!CatalogueCategoryList) {
    return <p className="glossary-plain">Category list is not available.</p>;
  }

  return (
    <CatalogueCategoryList
      getCategoryHref={(sectionId) => embedCatalogueHref({ category: sectionId, service: 'all' })}
      onOpenCategory={(sectionId) => embedNavigate(embedCatalogueHref({ category: sectionId, service: 'all' }))}
    />
  );
}

function EmbedCta() {
  const embed = window.__COLEEBRI_EMBED__ || {};
  const CatalogueCtaPanel = window.CatalogueBlocks?.CatalogueCtaPanel;
  if (!CatalogueCtaPanel) {
    return <p className="glossary-plain">Catalogue call-to-action is not available.</p>;
  }
  const catalogueHref = embedCatalogueHref({
    service: embed.service,
    category: embed.category,
    group: embed.group,
    test: embed.test,
    tests: embed.tests,
  });
  return <CatalogueCtaPanel catalogueHref={catalogueHref} />;
}

function EmbedDisclaimer() {
  return (
    <div className="shell">
      <Disclaimer kind="general" />
    </div>
  );
}

function embedTrackId(service) {
  if (!service || service === 'all' || service === 'top') return 'all';
  if (service === 'collection') return 'collection';
  return service;
}

function EmbedTestGrid() {
  const embed = window.__COLEEBRI_EMBED__ || {};
  const displayOnly = embedIsDisplayOnly();
  const cart = useCart();
  const [pinned, setPinned] = React.useState([]);
  const [comparedKeys, setComparedKeys] = React.useState([]);
  const [listKeys, setListKeys] = React.useState([]);
  const CatalogueTestGrid = window.CatalogueBlocks?.CatalogueTestGrid;
  const filter = window.ColeebriEmbedParams?.filterCatalogueTests;
  const tests = filter
    ? filter({
        service: embed.service,
        category: embed.category,
        group: embed.group,
        test: embed.test,
        tests: embed.tests,
      })
    : [];
  const trackId = embedTrackId(embed.service);
  const compareKey = (t) => t.code + t.name;

  React.useEffect(() => {
    if (!displayOnly) return;
    const onMessage = (ev) => {
      if (!ev.data || ev.data.type !== 'coleebri-state') return;
      if (Array.isArray(ev.data.comparedKeys)) setComparedKeys(ev.data.comparedKeys);
      if (Array.isArray(ev.data.listKeys)) setListKeys(ev.data.listKeys);
    };
    window.addEventListener('message', onMessage);
    embedPostToParent('coleebri-embed-ready', {});
    return () => window.removeEventListener('message', onMessage);
  }, [displayOnly]);

  const handleCompare = (test) => {
    if (displayOnly) {
      embedParentCompareToggle(test);
      return;
    }
    setPinned((prev) => {
      const k = compareKey(test);
      if (prev.find((p) => compareKey(p) === k)) return prev.filter((p) => compareKey(p) !== k);
      if (prev.length >= 3) return [...prev.slice(1), test];
      return [...prev, test];
    });
  };

  const handleCart = (test) => {
    if (displayOnly) {
      embedParentListToggle(test);
      return;
    }
    cart.toggle(test);
  };

  const inCartFn = (test) => {
    if (displayOnly) return listKeys.indexOf(compareKey(test)) !== -1;
    return cart.has(test);
  };

  if (!CatalogueTestGrid) {
    return <p className="glossary-plain shell">Test catalogue grid is not available.</p>;
  }

  const compared = displayOnly ? comparedKeys : pinned.map(compareKey);

  return (
    <CatalogueTestGrid
      trackId={trackId}
      tests={tests}
      tweaks={embedTweaks()}
      compared={compared}
      onCompare={handleCompare}
      onOpen={(t) =>
        embedIsIntegrated() || displayOnly
          ? embedOpenEnquiry(t)
          : embedNavigate(embedCatalogueHref({ test: t.id }))
      }
      onCart={handleCart}
      inCart={inCartFn}
      categoryFilter={embed.category || ''}
      testIdsFilter={embed.testIds && embed.testIds.length ? embed.testIds : null}
    />
  );
}

function EmbedTabNav() {
  const embed = embedConfig();
  const CatalogueTabNav = window.CatalogueBlocks?.CatalogueTabNav;
  const activeId = embed.service === 'collection' ? 'collection' : embed.service || 'all';
  if (!CatalogueTabNav) return null;

  const navigateTab = (tabId) => {
    const url = embedCatalogueHref({
      tabId,
      service: tabId === 'all' ? '' : tabId,
      category: embed.category,
    });
    embedNavigate(url);
  };

  return (
    <CatalogueTabNav
      activeId={activeId}
      getTabHref={embedIsIntegrated() ? null : (tabId) => embedCatalogueHref({ tabId, service: tabId === 'all' ? '' : tabId })}
      onSelectTab={navigateTab}
    />
  );
}

function EmbedCollection() {
  const View = window.CatalogueBlocks?.CatalogueCollectionView;
  return View ? <View /> : <p className="glossary-plain shell">Collection information is not available.</p>;
}

function EmbedCompliance() {
  const Section = window.CatalogueBlocks?.CatalogueComplianceSection;
  return Section ? <Section /> : <p className="glossary-plain shell">Compliance section is not available.</p>;
}

function EmbedPatientInfo() {
  const Section = window.CatalogueBlocks?.CataloguePatientInformation;
  if (!Section) return <p className="glossary-plain shell">Patient information is not available.</p>;
  return (
    <Section
      onOpenMarkerCheck={() => {
        const u = window.location.href.replace(/embed\/?(\?.*)?$/, 'embed/?widget=marker-check&branding=none');
        embedNavigate(u);
      }}
    />
  );
}

function EmbedQuiz() {
  const cart = useCart();
  if (!window.Quiz) {
    return <p className="glossary-plain shell">Help me choose is not available.</p>;
  }
  return (
    <div className="shell embed-quiz-wrap">
      <Quiz
        onClose={() => embedNavigate(embedCatalogueHref({}))}
        onSelectTest={(t, answers) => {
          if (answers && window.ColeebriQuiz?.saveStoredQuizAnswers) {
            window.ColeebriQuiz.saveStoredQuizAnswers({ ...answers, fromQuiz: true });
          }
          embedNavigate(embedCatalogueHref({ test: t.id }));
        }}
        onCompareTest={() => {}}
        onCartTest={cart.toggle}
      />
    </div>
  );
}
