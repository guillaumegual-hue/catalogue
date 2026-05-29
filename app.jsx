/* Coleebri Health - Patient Catalogue (simplified, live-site aligned) */

const { useState, useEffect, useMemo, useRef } = React;

const TABS = window.CATALOGUE_TABS || [
  { id: 'all', label: 'All tests' },
  { id: 'general', label: 'General Health' },
  { id: 'women', label: "Women's Health" },
  { id: 'men', label: "Men's Health" },
  { id: 'sexual', label: 'Sexual Health' },
  { id: 'fitness', label: 'Fitness & wellbeing' },
  { id: 'allergies', label: 'Allergies & sensitivities' },
  { id: 'dna', label: 'DNA Tests' },
  { id: 'collection', label: 'Phlebotomy & Collection' },
];

function applyCatalogueHash() {
  const parse = window.ColeebriEmbedParams && window.ColeebriEmbedParams.parseCatalogueHash;
  if (!parse) return null;
  return parse(location.hash);
}

function readPageBoot() {
  return window.COLEEBRI_CATALOGUE_PAGE || null;
}

function bootInitialActive(boot) {
  if (!boot) return 'all';
  if (boot.scroll) return 'all';
  if (boot.service === 'collection') return 'collection';
  if (boot.service && boot.service !== 'all') return boot.service;
  return 'all';
}

function categoryPageMeta(boot) {
  if (!boot) return { title: '', blurb: '' };
  if (boot.category) {
    const sec = (window.SECTIONS || []).find((s) => s.id === boot.category);
    return { title: boot.title || sec?.label || '', blurb: sec?.blurb || '' };
  }
  const track = (window.TRACKS || []).find((t) => t.id === boot.service);
  return { title: boot.title || track?.label || '', blurb: track?.blurb || '' };
}

function CategoryPageHeader({ boot }) {
  const meta = categoryPageMeta(boot);
  const hubHref = '../';
  const catalogueHref = '../../Coleebri%20Patient%20Catalogue.html';
  const Footnote = window.CatalogueFootnote;
  return (
    <section className="shell category-page-header">
      <nav className="category-page-header__crumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <a href={hubHref}>Browse all categories</a>
          </li>
          <li aria-current="page">{meta.title}</li>
        </ol>
      </nav>
      <h1 className="category-page-header__title">{meta.title}</h1>
      {meta.blurb ? <p className="category-page-header__lead">{meta.blurb}</p> : null}
      {Footnote ? <Footnote /> : null}
      <p className="category-page-header__tools">
        <a href={catalogueHref}>Full catalogue</a>
        <span className="category-page-header__tools-note"> — search, compare, quiz</span>
      </p>
    </section>
  );
}

/* ─── HERO ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero-coleebri" data-screen-label="01 Hero">
      <div className="inner">
        <div className="logo-row">
          <img src="https://health.coleebri.com/wp-content/uploads/sites/12/2025/02/Fichier-7@2x.png" alt="Coleebri Health" />
        </div>
        <h1>Your partner in health and wellness.</h1>
        <div className="hero-panels">
          <div className="hero-panel hero-panel-highlight">
            <span className="hero-panel-kicker">Patient catalogue 2026</span>
            <span className="hero-panel-title">+200 tests available</span>
            <span className="hero-panel-desc">Blood, urine and DNA wellness &amp; screening tests</span>
          </div>
          <div className="hero-panel hero-panel-contact">
            <span className="hero-panel-kicker">Need something else?</span>
            <p className="hero-panel-desc">
              Can&rsquo;t find your test? <strong>Contact us</strong> - we can often arrange other markers through our partner laboratories.
            </p>
            <a className="hero-panel-cta" href="mailto:health@coleebri.com?subject=Test%20enquiry">
              Contact us <Icon.arrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TOPBAR ─────────────────────────────────────────────── */
function Topbar({ query, setQuery, onQuiz, onCheckMarker, onScrollTop, cartCount, onOpenCart, onExportPdf }) {
  return (
    <header className="topbar no-print">
      <div className="topbar-inner shell">
        <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); onScrollTop(); }}>
          <img src="https://health.coleebri.com/wp-content/uploads/sites/12/2025/02/Fichier-7@2x.png" alt="Coleebri Health" />
        </a>
        <div className="search">
          <Icon.search />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, marker or code…"
            aria-label="Search the catalogue"
          />
          {query && (
            <button type="button" className="clear" onClick={() => setQuery('')} aria-label="Clear search">
              <Icon.close size={16} />
            </button>
          )}
        </div>
        <div className="topbar-actions" aria-label="Catalogue actions">
          <button type="button" className="topbar-action-btn" onClick={onQuiz} title="Help me choose a test">
            <Icon.sparkles size={20} />
            <span className="topbar-action-label">Help me choose</span>
          </button>
          <button type="button" className="topbar-action-btn" onClick={onCheckMarker} title="Check a biomarker against UK guidance">
            <Icon.info size={20} />
            <span className="topbar-action-label">Check marker</span>
          </button>
          <button type="button" className="topbar-action-btn" onClick={onExportPdf} title="Export full catalogue PDF">
            <Icon.pdf size={20} />
            <span className="topbar-action-label">Export PDF</span>
          </button>
          <button type="button" className="topbar-action-btn topbar-action-btn--solid" onClick={onOpenCart} title="View your test list">
            <Icon.cart size={20} />
            <span className="topbar-action-label">My list</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ─── TAB NAV ────────────────────────────────────────────── */
function TabNav({ active, setActive }) {
  return (
    <nav className="tabnav no-print" aria-label="Browse by category">
      <div className="tabnav-wrap shell">
        <label className="tabnav-select-field">
          <span className="zone-label">Browse by category</span>
          <select
            className="tabnav-select"
            value={active}
            onChange={(e) => setActive(e.target.value)}
            aria-label="Choose a category"
          >
            {TABS.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>
        <p className="zone-label tabnav-pills-label">Browse by category</p>
        <div className="tabnav-pills" role="tablist">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              className={active === t.id ? 'active' : ''}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ─── COLLECTION TAB ─────────────────────────────────────── */
function TrackSection(props) {
  const Grid = window.CatalogueBlocks?.CatalogueTestGrid;
  if (!Grid) return null;
  return <Grid {...props} />;
}

function CollectionView() {
  const View = window.CatalogueBlocks?.CatalogueCollectionView;
  return View ? <View /> : null;
}

function Compliance() {
  const Section = window.CatalogueBlocks?.CatalogueComplianceSection;
  return Section ? <Section /> : null;
}

function HowResultsWork() {
  const Section = window.CatalogueBlocks?.CatalogueHowResultsWork;
  return Section ? <Section /> : null;
}

function CostTransparency() {
  const Section = window.CatalogueBlocks?.CatalogueCostTransparency;
  return Section ? <Section /> : null;
}

function ConsumerRights() {
  const Section = window.CatalogueBlocks?.CatalogueConsumerRights;
  return Section ? <Section /> : null;
}

function LegalDisclaimer() {
  const Section = window.CatalogueBlocks?.CatalogueLegalDisclaimer;
  return Section ? <Section /> : null;
}

function PatientInformation({ onOpenMarkerCheck }) {
  const Section = window.CatalogueBlocks?.CataloguePatientInformation;
  return Section ? <Section onOpenMarkerCheck={onOpenMarkerCheck} /> : null;
}

/* ─── FOOTER ────────────────────────────────────────────── */
function Foot() {
  return (
    <footer className="foot">
      <div className="shell">
        <div className="foot-grid">
          <div>
            <img src="https://health.coleebri.com/wp-content/uploads/sites/12/2025/02/Fichier-7@2x.png" alt="Coleebri Health" style={{height: 40, marginBottom: 14, filter: 'brightness(0) invert(1)'}} />
            <p>Your partner in health and wellness. A professional sample collection service operating from Worthing, West Sussex.</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>
              <a href="mailto:health@coleebri.com">health@coleebri.com</a><br/>
              140 South Street<br/>
              Worthing BN14 7NB<br/>
              <a href="https://health.coleebri.com">health.coleebri.com</a>
            </p>
          </div>
          <div>
            <h4>Healthcare professionals</h4>
            <p>For ad-hoc tests including phlebotomy for your patients, please contact us via <a href="mailto:health@coleebri.com">health@coleebri.com</a>.</p>
          </div>
          <div>
            <h4>Important</h4>
            <p>
              {window.ColeebriCompliance.SHORT_SERVICE_NOTE}{' '}
              <a href="#about-our-service">About our service</a> ·{' '}
              <a href="#terms-cancellation">Cancellation</a> ·{' '}
              <a href="#legal-information">Legal</a> ·{' '}
              <a href="#patient-information">Patient information</a> ·{' '}
              <a href="integrate.html">Embed catalogue</a>. Need urgent help? Call NHS 111; emergencies 999.
            </p>
          </div>
        </div>
        <div className="copyright">
          <span>© 2026 Coleebri Groupe. All rights reserved.</span>
          <span>Catalogue v2026 · Patient edition</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── COMPARE TABLE ─────────────────────────────────────── */
function CompareTable({ tests, onClose, onUnpin }) {
  if (!tests.length) return null;
  const rows = [
    { lbl: 'Sample type', val: (t) => t.samples.map(s => window.SAMPLE_TYPES[s]?.short || s).join(' · ') },
    { lbl: 'Price', val: (t) => <span className="price-cell">{window.formatPrice(t)}</span> },
    { lbl: 'Turnaround', val: (t) => t.turnaround },
    { lbl: 'What it checks', val: (t) => (window.blurbToPlainText ? window.blurbToPlainText(t.blurb) : t.blurb) },
    { lbl: 'Components', val: (t) => `${t.components.length} marker${t.components.length !== 1 ? 's' : ''}: ${t.components.slice(0, 8).join(', ')}${t.components.length > 8 ? `, +${t.components.length - 8} more` : ''}` },
    { lbl: 'Code', val: (t) => <span style={{fontFamily:'var(--font-display)', color:'var(--ink-3)'}}>{t.code}</span> },
  ];
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal compare-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icon.close /></button>
        <span className="eyebrow" style={{display:'block', marginBottom: 8}}>Side-by-side comparison</span>
        <h3 style={{fontSize: '1.5rem', marginBottom: 4, fontFamily: 'var(--font-display)'}}>Compare {tests.length} test{tests.length !== 1 ? 's' : ''}</h3>
        <p className="disclaimer-footnote" style={{ marginBottom: 12 }}>
          {window.ColeebriCompliance.SHORT_SERVICE_NOTE}{' '}
          <a href="#about-our-service">About our service</a>.
        </p>
        <button type="button" className="btn btn-outline" style={{marginBottom: 16}} onClick={() => window.ColeebriPdf.exportCompare(tests)}>
          <Icon.pdf /> Export comparison PDF
        </button>
        <div style={{overflowX: 'auto'}}>
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                {tests.map(t => (
                  <th key={t.code + t.name} style={{minWidth: 200}}>
                    <span className="test-name">{t.name}</span>
                    <button
                      onClick={() => onUnpin(t.code + t.name)}
                      style={{background:'none', border:'none', color:'var(--ink-3)', fontSize: '0.75rem', cursor:'pointer', padding:0, marginTop: 4}}
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="feature">{r.lbl}</td>
                  {tests.map(t => <td key={t.code + t.name}>{r.val(t)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function disclaimerKindForTest(test) {
  if (test.section === 'sexual') return 'sexual';
  if (test.section === 'paternity') return 'paternity';
  if (test.section === 'allergies') return 'allergy';
  if (test.tracks?.includes('fitness')) return 'fitness';
  return 'general';
}

/* ─── REQUEST MODAL ─────────────────────────────────────── */
function RequestModal({ test, onClose, onOpenTest, enquirySource, quizAnswers }) {
  const venous = window.ColeebriPhlebotomy.needsVenous(test);
  const Q = window.ColeebriQuiz;
  const fromQuiz = enquirySource === 'quiz' && quizAnswers;
  const includeGoal = !!fromQuiz;

  const [prefs, setPrefs] = React.useState(() => {
    const stored = Q.loadStoredQuizAnswers();
    if (fromQuiz) return quizAnswers;
    return Q.mergePrefsForEnquiry(stored, 'direct');
  });
  const [editingQuiz, setEditingQuiz] = React.useState(false);

  React.useEffect(() => {
    if (Q.hasRequiredQuizAnswers(prefs, includeGoal)) {
      Q.saveStoredQuizAnswers({ ...prefs, fromQuiz: includeGoal || prefs.fromQuiz });
    }
  }, [prefs, includeGoal]);

  const enquirySteps = Q.getEnquirySteps(includeGoal);
  const prefsComplete = Q.hasRequiredQuizAnswers(prefs, includeGoal);
  const showQuizSummary = prefsComplete && !editingQuiz;
  const { EnquiryQuizFields, EnquiryQuizSummary } = Q;

  const mailBody = React.useMemo(() => {
    const lines = [
      'Hello Coleebri Health,',
      '',
      'I would like to enquire about the following test from your patient catalogue:',
      '',
      `${test.name} (${test.code}) - ${window.formatPrice(test)}`,
      `${window.ColeebriPricing.kitDeliveryLabel()}: £${window.ColeebriPricing.KIT_DELIVERY_FEE} (${window.ColeebriPricing.kitDeliveryInClinicNote().toLowerCase()})`,
      `Turnaround: ${test.turnaround}`,
      '',
    ];
    if (prefsComplete) {
      lines.push(...Q.buildQuizEnquiryMailLines(prefs, includeGoal));
    }
    if (venous && !(prefsComplete && prefs.sample?.collectionId)) {
      lines.push(window.ColeebriPhlebotomy.buildPhlebotomyMailSection());
    }
    lines.push('', 'Please advise on next steps.', '', 'Kind regards,');
    return lines.join('\n');
  }, [test, venous, prefs, includeGoal, prefsComplete]);

  const mailHref = `mailto:health@coleebri.com?subject=${encodeURIComponent('Test request: ' + test.name)}&body=${encodeURIComponent(mailBody)}`;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal request-modal" style={{ padding: '32px 28px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icon.close /></button>
        <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Request a test</span>
        <h3 style={{ fontSize: '1.4rem', marginBottom: 4, fontFamily: 'var(--font-display)' }}>{test.name}</h3>
        <div style={{ color: 'var(--ink-3)', marginBottom: 12, fontSize: '0.88rem' }}>{test.code} · {test.turnaround}</div>

        <RequestTestDetails test={test} onTestLink={onOpenTest} />

        {test.notice ? <TestComplianceNotice noticeKey={test.notice} /> : null}

        {venous && prefsComplete && <PhlebotomyRequiredNotice />}

        <EnquiryPriceBreakdown
          labTotal={test.poa || test.price == null ? 0 : Number(test.price)}
          pricedCount={test.poa || test.price == null ? 0 : 1}
          kitFee={window.ColeebriPricing.kitDeliveryTotal(1)}
          venous={venous}
        />

        {showQuizSummary ? (
          <EnquiryQuizSummary
            prefs={prefs}
            includeGoal={includeGoal}
            onEdit={() => setEditingQuiz(true)}
          />
        ) : (
          <EnquiryQuizFields
            steps={enquirySteps}
            value={prefs}
            onChange={setPrefs}
            tests={test}
            lead="Please answer these questions so we can advise you — they will be included in your email."
          />
        )}

        <p style={{ color: 'var(--ink-2)', marginTop: 16 }}>
          To book, get in touch with us in whichever way is easiest:
        </p>

        <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
          {prefsComplete ? (
            <a className="btn btn-solid" href={mailHref} style={{ justifyContent: 'flex-start' }}>
              Email health@coleebri.com
            </a>
          ) : (
            <button type="button" className="btn btn-solid" disabled style={{ justifyContent: 'flex-start', opacity: 0.55 }}>
              Answer the questions above to email us
            </button>
          )}
          <a className="btn btn-outline" href="https://health.coleebri.com" target="_blank" rel="noopener" style={{ justifyContent: 'flex-start' }}>
            health.coleebri.com
          </a>
        </div>

        <Disclaimer kind={disclaimerKindForTest(test)} compact />
      </div>
    </div>
  );
}

/* ─── COMPARE DRAWER ────────────────────────────────────── */
function CompareDrawer({ pinned, onUnpin, onClear, onOpen }) {
  if (pinned.length === 0) return null;
  return (
    <div className="compare-drawer no-print">
      <span style={{fontFamily:'var(--font-display)', fontSize:'0.82rem', opacity: 0.7}}>Compare</span>
      <div className="pinned-list">
        {pinned.map(p => (
          <span className="pin" key={p.code + p.name}>
            {p.name.length > 22 ? p.name.slice(0, 22) + '…' : p.name}
            <button onClick={() => onUnpin(p.code + p.name)} aria-label="Remove">×</button>
          </span>
        ))}
      </div>
      <button type="button" className="open-btn" onClick={onOpen} disabled={pinned.length < 2}>
        View compare ({pinned.length})
      </button>
      <button className="close-all" onClick={onClear} aria-label="Clear all">×</button>
    </div>
  );
}

/* ─── TWEAKS ────────────────────────────────────────────── */
function Tweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection title="Display">
        <TweakToggle
          label="Expand all components by default"
          value={tweaks.showAnalytesByDefault}
          onChange={(v) => setTweak('showAnalytesByDefault', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

/* ─── ROOT APP ──────────────────────────────────────────── */
function App() {
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const cart = useCart();
  const [query, setQuery] = useState('');
  const pageBoot = readPageBoot();
  const standalonePage = !!(pageBoot && pageBoot.standalone && !pageBoot.scroll);
  const [active, setActive] = useState(() => bootInitialActive(pageBoot));
  const [pinned, setPinned] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMarkerCheck, setShowMarkerCheck] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [requestTest, setRequestTest] = useState(null);
  const [enquirySource, setEnquirySource] = useState('direct');
  const [quizAnswersForEnquiry, setQuizAnswersForEnquiry] = useState(null);
  const MostOrderedSection = window.CatalogueBlocks?.MostOrderedSection;

  const openEnquiry = (test, source, answers) => {
    setRequestTest(test);
    setEnquirySource(source || 'direct');
    setQuizAnswersForEnquiry(answers || null);
  };

  const closeEnquiry = () => {
    setRequestTest(null);
    setEnquirySource('direct');
    setQuizAnswersForEnquiry(null);
  };
  const [categoryFilter, setCategoryFilter] = useState(() => (pageBoot?.category ? pageBoot.category : ''));
  const [testIdsFilter, setTestIdsFilter] = useState(null);
  const [markerCheckQuery, setMarkerCheckQuery] = useState('');

  useEffect(function () {
    if (pageBoot?.scroll) {
      const scrollIds = {
        'patient-information': 'patient-information',
        'about-our-service': 'about-our-service',
        'how-results-work': 'how-results-work',
        'our-laboratories': 'our-laboratories',
        'cost-transparency': 'cost-transparency',
        'terms-cancellation': 'terms-cancellation',
        'legal-information': 'legal-information',
      };
      const id = scrollIds[pageBoot.scroll];
      if (id) {
        window.setTimeout(function () {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, [pageBoot]);

  useEffect(function () {
    if (standalonePage) return undefined;
    function syncFromHash() {
      const parsed = applyCatalogueHash() || {};
      const scrollIds = {
        'patient-information': 'patient-information',
        'about-our-service': 'about-our-service',
        'how-results-work': 'how-results-work',
        'our-laboratories': 'our-laboratories',
        'cost-transparency': 'cost-transparency',
        'terms-cancellation': 'terms-cancellation',
        'legal-information': 'legal-information',
      };
      if (scrollIds[parsed.scroll]) {
        document.getElementById(scrollIds[parsed.scroll])?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (parsed.service) {
        if (parsed.service === 'collection') setActive('collection');
        else if (parsed.service === 'all' || parsed.service === 'top') setActive('all');
        else if (TABS.some(function (t) { return t.id === parsed.service; })) setActive(parsed.service);
      }
      setCategoryFilter(parsed.category || '');
      const ids = parsed.testIds && parsed.testIds.length
        ? parsed.testIds
        : (window.ColeebriEmbedParams && window.ColeebriEmbedParams.resolveTestIds
            ? window.ColeebriEmbedParams.resolveTestIds(parsed)
            : []);
      setTestIdsFilter(ids.length ? ids : null);
      if ((ids.length || parsed.category) && !parsed.service) setActive('all');
      if (parsed.marker) {
        setMarkerCheckQuery(parsed.marker);
        setShowMarkerCheck(true);
      }
      if (ids.length === 1) {
        const single = window.TESTS.find(function (t) { return t.id === ids[0]; });
        if (single) openEnquiry(single, 'direct');
      }
      if (parsed.service || parsed.category || ids.length) scrollTop();
    }
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return function () {
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [standalonePage]);

  /* Search/filter pipeline */
  const baseFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return window.TESTS.filter(t => {
      if (q) {
        const hay = [t.name, t.code, t.blurb, ...(t.components||[]), ...(t.tracks||[])].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query]);

  /* Filter to active tab */
  const tabFiltered = useMemo(() => {
    let list = baseFiltered;
    if (active === 'fitness') {
      list = list.filter((t) => t.section === 'fitness');
    } else if (active === 'allergies') {
      list = list.filter((t) => t.section === 'allergies');
    } else if (active !== 'all' && active !== 'collection') {
      list = list.filter((t) => t.tracks && t.tracks.includes(active));
    }
    if (categoryFilter) {
      list = list.filter((t) => t.section === categoryFilter);
    }
    if (testIdsFilter && testIdsFilter.length) {
      const allowed = new Set(testIdsFilter.map(function (id) { return String(id).toUpperCase(); }));
      list = list.filter((t) => allowed.has(t.id));
    }
    return list;
  }, [active, baseFiltered, categoryFilter, testIdsFilter]);

  /* Compare pinning */
  const compareKey = (t) => t.code + t.name;
  const handleCompare = (test) => {
    setPinned(prev => {
      const k = compareKey(test);
      if (prev.find(p => compareKey(p) === k)) return prev.filter(p => compareKey(p) !== k);
      if (prev.length >= 3) return [...prev.slice(1), test];
      return [...prev, test];
    });
  };
  const handleUnpin = (key) => setPinned(prev => prev.filter(p => compareKey(p) !== key));
  const compareKeys = pinned.map(compareKey);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* Scroll to top of catalogue when tab changes */
  useEffect(() => {
    const el = document.getElementById('catalogue') || document.getElementById('collection-info');
    if (el) {
      const off = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: off, behavior: 'smooth' });
    }
  }, [active]);

  return (
    <>
      <Topbar
        query={query}
        setQuery={setQuery}
        onQuiz={() => setShowQuiz(true)}
        onCheckMarker={() => setShowMarkerCheck(true)}
        onScrollTop={scrollTop}
        cartCount={cart.count}
        onOpenCart={() => setShowCart(true)}
        onExportPdf={() => window.ColeebriPdf.exportFull()}
      />

      <main id="top">
        {!standalonePage && <Hero />}

        {standalonePage && pageBoot ? <CategoryPageHeader boot={pageBoot} /> : null}

        {!standalonePage && <TabNav active={active} setActive={setActive} />}

        {MostOrderedSection && !standalonePage && active === 'all' && !query.trim() && !testIdsFilter && (
          <MostOrderedSection
            tweaks={tweaks}
            compared={compareKeys}
            onCompare={handleCompare}
            onOpen={(t) => openEnquiry(t, 'direct')}
            onCart={cart.toggle}
            inCart={cart.has}
            onBrowseTab={setActive}
          />
        )}

        {active === 'collection' ? (
          <CollectionView />
        ) : (
          <TrackSection
            trackId={active}
            tests={tabFiltered}
            categoryFilter={categoryFilter}
            testIdsFilter={testIdsFilter}
            tweaks={tweaks}
            hideTrackIntro={standalonePage}
            compared={compareKeys}
            onCompare={handleCompare}
            onOpen={(t) => openEnquiry(t, 'direct')}
            onCart={cart.toggle}
            inCart={cart.has}
          />
        )}

        <Compliance />
        <HowResultsWork />
        <CostTransparency />
        <PatientInformation onOpenMarkerCheck={() => setShowMarkerCheck(true)} />
        <ConsumerRights />
        <LegalDisclaimer />
      </main>

      <Foot />

      <CompareDrawer
        pinned={pinned}
        onUnpin={handleUnpin}
        onClear={() => setPinned([])}
        onOpen={() => setShowCompare(true)}
      />

      {showCompare && (
        <CompareTable
          tests={pinned}
          onClose={() => setShowCompare(false)}
          onUnpin={handleUnpin}
        />
      )}

      {showQuiz && (
        <div className="overlay" onClick={() => setShowQuiz(false)}>
          <div className="modal quiz-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQuiz(false)} aria-label="Close"><Icon.close /></button>
            <Quiz
              onClose={() => setShowQuiz(false)}
              onSelectTest={(t, answers) => {
                setShowQuiz(false);
                openEnquiry(t, 'quiz', answers);
              }}
              onCompareTest={handleCompare}
              onCartTest={cart.add}
            />
          </div>
        </div>
      )}

      {showMarkerCheck && (
        <MarkerCheckModal
          initialQuery={markerCheckQuery}
          onClose={() => {
            setShowMarkerCheck(false);
            setMarkerCheckQuery('');
          }}
        />
      )}

      {requestTest && (
        <RequestModal
          test={requestTest}
          onClose={closeEnquiry}
          onOpenTest={(t) => openEnquiry(t, enquirySource, quizAnswersForEnquiry)}
          enquirySource={enquirySource}
          quizAnswers={quizAnswersForEnquiry}
        />
      )}

      <CartDrawer
        cart={cart}
        open={showCart}
        onClose={() => setShowCart(false)}
        onOpenTest={(t) => { setShowCart(false); openEnquiry(t, 'direct'); }}
      />

      <Tweaks tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
