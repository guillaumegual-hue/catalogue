/* Coleebri — embed hosts using the same UI blocks as the main catalogue. */

function embedCatalogueHref(opts) {
  const embed = window.__COLEEBRI_EMBED__ || {};
  const base = embed.catalogueBase || '../Coleebri%20Patient%20Catalogue.html';
  const hash =
    window.ColeebriEmbedParams && window.ColeebriEmbedParams.buildCatalogueHash
      ? window.ColeebriEmbedParams.buildCatalogueHash(opts || {})
      : '#top';
  return base + hash;
}

function embedNavigate(href) {
  if (window.parent && window.parent !== window) {
    window.parent.location.href = href;
  } else {
    window.location.href = href;
  }
}

function embedTweaks() {
  return window.TWEAK_DEFAULTS || {
    showAnalytesByDefault: false,
    denseCards: false,
    showPriceTier: true,
    showBadges: true,
    primaryAccent: 'teal',
  };
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
      onOpen={(t) => embedNavigate(embedCatalogueHref({ test: t.id }))}
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
      onOpen={(t) => embedNavigate(embedCatalogueHref({ test: t.id }))}
      onCart={cart.toggle}
      inCart={cart.has}
      categoryFilter={embed.category || ''}
      testIdsFilter={embed.testIds && embed.testIds.length ? embed.testIds : null}
    />
  );
}

function EmbedTabNav() {
  const embed = window.__COLEEBRI_EMBED__ || {};
  const CatalogueTabNav = window.CatalogueBlocks?.CatalogueTabNav;
  const activeId = embed.service === 'collection' ? 'collection' : embed.service || 'all';
  if (!CatalogueTabNav) return null;

  return (
    <CatalogueTabNav
      activeId={activeId}
      getTabHref={(tabId) => {
        if (tabId === 'collection') {
          return embedCatalogueHref({ service: 'collection' });
        }
        return embedCatalogueHref({ service: tabId === 'all' ? '' : tabId, category: embed.category });
      }}
      onSelectTab={(tabId) => {
        embedNavigate(
          embedCatalogueHref({
            service: tabId === 'all' ? '' : tabId,
            category: embed.category,
          })
        );
      }}
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
