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

function embedWidgetName() {
  const embed = embedConfig();
  const norm = window.ColeebriEmbedParams?.normalizeWidget;
  return norm ? norm(embed.widget || 'glossary') : embed.widget || 'glossary';
}

/** Homepage showcase widgets — always deep-link into full catalogue (not mailto / WP service pages). */
function embedIsHomeWidget() {
  const w = embedWidgetName();
  return w === 'most-ordered' || w === 'categories' || w === 'category-list';
}

function embedTweaks() {
  const base = window.TWEAK_DEFAULTS || {
    showAnalytesByDefault: false,
    denseCards: false,
    showPriceTier: true,
    showBadges: true,
    primaryAccent: 'teal',
  };
  const embed = embedConfig();
  if (embedIsHomeWidget()) {
    return { ...base, embedIntegrated: true, embedHomeWidget: true };
  }
  if (embedIsIntegrated() || embed.cardsOnly) {
    const service = embed.service || embed.category || '';
    const showIntro =
      !!embed.cardsOnly &&
      !!service &&
      service !== 'all' &&
      service !== 'top';
    return { ...base, embedIntegrated: true, embedShowIntro: showIntro };
  }
  return base;
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

  const homeWidget = embedIsHomeWidget();
  return (
    <MostOrderedSection
      tweaks={embedTweaks()}
      compact={homeWidget}
      compared={pinned.map(compareKey)}
      onCompare={handleCompare}
      onOpen={(t) =>
        homeWidget || !embedIsIntegrated()
          ? embedNavigate(embedCatalogueHref({ test: t.id }))
          : embedOpenEnquiry(t)
      }
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

  const mapCategory = (sectionId) => {
    if (sectionId === 'fitness' || sectionId === 'allergies') {
      return embedCatalogueHref({ service: sectionId });
    }
    return embedCatalogueHref({ category: sectionId, service: 'all' });
  };

  return (
    <CatalogueCategoryList
      compact={embedIsHomeWidget()}
      getCategoryHref={mapCategory}
      onOpenCategory={(sectionId) => embedNavigate(mapCategory(sectionId))}
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
  const cart = useCart();
  const [pinned, setPinned] = React.useState([]);
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
  const handleCompare = (test) => {
    setPinned((prev) => {
      const k = compareKey(test);
      if (prev.find((p) => compareKey(p) === k)) return prev.filter((p) => compareKey(p) !== k);
      if (prev.length >= 3) return [...prev.slice(1), test];
      return [...prev, test];
    });
  };

  if (!CatalogueTestGrid) {
    return <p className="glossary-plain shell">Test catalogue grid is not available.</p>;
  }

  return (
    <CatalogueTestGrid
      trackId={trackId}
      tests={tests}
      tweaks={embedTweaks()}
      compared={pinned.map(compareKey)}
      onCompare={handleCompare}
      onOpen={(t) => (embedIsIntegrated() ? embedOpenEnquiry(t) : embedNavigate(embedCatalogueHref({ test: t.id })))}
      onCart={cart.toggle}
      inCart={cart.has}
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
