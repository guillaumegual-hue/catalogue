/* Shared catalogue sections — used by main app and embed iframes. */

function MostOrderedSection({ tweaks, compared, onCompare, onOpen, onCart, inCart, onBrowseTab, compact }) {
  const slots = window.resolveMostOrdered();

  return (
    <section className="most-ordered-section shell no-print" id="most-ordered" aria-labelledby="most-ordered-title">
      {!compact && (
      <div className="track-intro most-ordered-intro">
        <span className="eyebrow">Patient favourites</span>
        <h2 id="most-ordered-title">Our most ordered tests</h2>
        <p className="lead">
          Extensive panels patients book most often — for men&rsquo;s health, women&rsquo;s health, allergies and sport.
        </p>
      </div>
      )}
      <div className="most-ordered-grid">
        {slots.map(({ id, label, blurb, test, tabId }) => (
          <div key={id} className="most-ordered-slot">
            <div className="most-ordered-slot-head">
              <h3 className="most-ordered-cat">{label}</h3>
              <p className="most-ordered-slot-blurb">{blurb}</p>
              {tabId && onBrowseTab && (
                <button type="button" className="most-ordered-more" onClick={() => onBrowseTab(tabId)}>
                  Browse {label.toLowerCase()} <Icon.arrowRight size={14} />
                </button>
              )}
            </div>
            <TestCard
              test={test}
              tweaks={tweaks}
              compared={compared.includes(test.code + test.name)}
              onCompare={onCompare}
              onOpen={onOpen}
              onCart={onCart}
              inCart={inCart(test)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function CatalogueCategoryList({ onOpenCategory, getCategoryHref, compact }) {
  return (
    <section className="shell catalogue-categories-block" aria-label="Catalogue categories">
      {!compact && (
      <div className="track-intro">
        <span className="eyebrow">Patient catalogue 2026</span>
        <h2>Browse by category</h2>
        <p className="lead">Choose a section to view tests in the full patient catalogue.</p>
        <CatalogueFootnote />
      </div>
      )}
      {window.SECTIONS.map((sec) => (
        <div key={sec.id} className="subsec" data-screen-label={sec.label}>
          <div className="subsec-head">
            <h3>{sec.label}</h3>
            <a
              className="btn btn-outline"
              href={getCategoryHref(sec.id)}
              target="_top"
              rel="noopener"
              onClick={(e) => {
                e.preventDefault();
                onOpenCategory(sec.id);
              }}
            >
              View tests <Icon.arrowRight />
            </a>
          </div>
          <SectionHint sectionId={sec.id} />
          <p className="lead subsec-blurb">{sec.blurb}</p>
        </div>
      ))}
    </section>
  );
}

function CatalogueCtaPanel({ catalogueHref }) {
  return (
    <section className="shell catalogue-cta-block">
      <div className="hero-panels">
        <div className="hero-panel hero-panel-highlight">
          <span className="hero-panel-kicker">Patient catalogue 2026</span>
          <span className="hero-panel-title">Blood, urine &amp; DNA tests</span>
          <span className="hero-panel-desc">
            Browse tests we collect for UKAS-accredited laboratories — plain-English guidance and transparent pricing.
          </span>
          <a className="hero-panel-cta" href={catalogueHref} target="_top" rel="noopener">
            Browse catalogue <Icon.arrowRight />
          </a>
        </div>
        <div className="hero-panel hero-panel-contact">
          <span className="hero-panel-kicker">Questions?</span>
          <p className="hero-panel-desc">
            Email us at <strong>health@coleebri.com</strong> and we will help you choose the right test.
          </p>
          <a
            className="hero-panel-cta"
            href="mailto:health@coleebri.com?subject=Test%20enquiry"
            target="_top"
            rel="noopener"
          >
            Email us <Icon.arrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}

/** Compact title + blurb for WordPress test-list embeds (no logo / footnote). */
function EmbedTrackIntro({ label, blurb }) {
  if (!label) return null;
  return (
    <header className="embed-track-intro">
      <h2 className="embed-track-intro__title">{label}</h2>
      {blurb ? <p className="embed-track-intro__lead">{blurb}</p> : null}
    </header>
  );
}

function CatalogueTestGrid({
  trackId,
  tests,
  tweaks,
  compared,
  onCompare,
  onOpen,
  onCart,
  inCart,
  categoryFilter,
  testIdsFilter,
  hideTrackIntro,
}) {
  const grouped = React.useMemo(() => {
    const map = new Map();
    tests.forEach((t) => {
      if (!map.has(t.section)) map.set(t.section, []);
      map.get(t.section).push(t);
    });
    return [...map.entries()];
  }, [tests]);

  const showEmbedIntro = !!tweaks?.embedShowIntro;
  const hideIntro = !!hideTrackIntro || (!!tweaks?.embedIntegrated && !showEmbedIntro);
  const trackMeta = window.TRACKS.find((t) => t.id === trackId);
  const categoryMeta = categoryFilter ? window.SECTIONS.find((s) => s.id === categoryFilter) : null;
  const groupMeta =
    testIdsFilter &&
    testIdsFilter.length &&
    window.ColeebriTestGroups &&
    window.ColeebriTestGroups.find(function (g) {
      return (
        g.testIds &&
        g.testIds.length === testIdsFilter.length &&
        g.testIds.every(function (id, i) {
          return id === testIdsFilter[i];
        })
      );
    });
  const testFilterLabel = groupMeta
    ? groupMeta.label
    : testIdsFilter && testIdsFilter.length === 1
      ? (window.TESTS.find(function (t) {
          return t.id === testIdsFilter[0];
        }) || {}).name
      : testIdsFilter && testIdsFilter.length > 1
        ? testIdsFilter.length + ' selected tests'
        : null;

  const embedIntroLabel =
    testFilterLabel || (categoryMeta ? categoryMeta.label : trackMeta?.label);
  const embedIntroBlurb =
    testFilterLabel && groupMeta
      ? groupMeta.blurb
      : categoryMeta
        ? categoryMeta.blurb
        : trackMeta?.blurb;

  if (trackId === 'all') {
    return (
      <section className="shell catalogue-test-grid" id="catalogue">
        {showEmbedIntro && (
          <EmbedTrackIntro label={embedIntroLabel} blurb={embedIntroBlurb} />
        )}
        {!hideIntro && !showEmbedIntro && (
        <div className="track-intro">
          <span className="eyebrow">
            {testFilterLabel ? 'Selected tests' : categoryMeta ? 'Catalogue category' : 'Full catalogue'}
          </span>
          <h2>{testFilterLabel || (categoryMeta ? categoryMeta.label : 'Every test we collect, in one place')}</h2>
          <p className="lead">
            {testFilterLabel && groupMeta
              ? groupMeta.blurb
              : testFilterLabel
                ? 'Tests included in this embed.'
                : categoryMeta
                  ? categoryMeta.blurb
                  : 'Browse by catalogue section, or use the tabs above to jump to a service.'}
          </p>
          <CatalogueFootnote />
        </div>
        )}
        {(categoryFilter ? window.SECTIONS.filter((s) => s.id === categoryFilter) : window.SECTIONS).map((sec) => {
          const t = tests.filter((x) => x.section === sec.id);
          if (!t.length) return null;
          return (
            <div className="subsec" key={sec.id} data-screen-label={sec.label}>
              {!hideIntro && (
              <div className="subsec-head">
                <h3>{sec.label}</h3>
                <SectionHint sectionId={sec.id} />
              </div>
              )}
              <div className="card-grid">
                {t.map((test) => (
                  <TestCard
                    key={test.code + test.name}
                    test={test}
                    tweaks={tweaks}
                    compared={compared.includes(test.code + test.name)}
                    onCompare={onCompare}
                    onOpen={onOpen}
                    onCart={onCart}
                    inCart={inCart(test)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    );
  }

  if (!tests.length) {
    return (
      <div className="shell empty">
        <Icon.search size={36} />
        <div className="big">No tests match your filters</div>
        <p>Try a different category or service, or open the full catalogue.</p>
      </div>
    );
  }

  const groupedView = categoryFilter ? grouped.filter(([secId]) => secId === categoryFilter) : grouped;

  return (
    <section className="shell catalogue-test-grid" id="catalogue">
      {showEmbedIntro && (
        <EmbedTrackIntro label={embedIntroLabel} blurb={embedIntroBlurb} />
      )}
      {!hideIntro && !showEmbedIntro && (
      <div className="track-intro">
        <span className="eyebrow">{categoryMeta ? categoryMeta.label : trackMeta?.label}</span>
        <h2>{categoryMeta ? categoryMeta.label : trackMeta?.label}</h2>
        <p className="lead">{categoryMeta ? categoryMeta.blurb : trackMeta?.blurb}</p>
        <CatalogueFootnote />
      </div>
      )}

      {groupedView.length > 1
        ? groupedView.map(([secId, t]) => {
            const sec = window.SECTIONS.find((s) => s.id === secId);
            return (
              <div className="subsec" key={secId} data-screen-label={sec?.label || secId}>
                {!hideIntro && (
                <div className="subsec-head">
                  <h3>{sec?.label || secId}</h3>
                  <SectionHint sectionId={secId} />
                </div>
                )}
                <div className="card-grid">
                  {t.map((test) => (
                    <TestCard
                      key={test.code + test.name}
                      test={test}
                      tweaks={tweaks}
                      compared={compared.includes(test.code + test.name)}
                      onCompare={onCompare}
                      onOpen={onOpen}
                      onCart={onCart}
                      inCart={inCart(test)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        : (
          <div className="card-grid">
            {tests.map((test) => (
              <TestCard
                key={test.code + test.name}
                test={test}
                tweaks={tweaks}
                compared={compared.includes(test.code + test.name)}
                onCompare={onCompare}
                onOpen={onOpen}
                onCart={onCart}
                inCart={inCart(test)}
              />
            ))}
          </div>
        )}
    </section>
  );
}

function CatalogueTabNav({ activeId, onSelectTab, getTabHref }) {
  const tabs = window.CATALOGUE_TABS || [];
  return (
    <nav className="tabnav coleebri-embed-tabnav" aria-label="Browse by category">
      <div className="tabnav-wrap shell">
        <label className="tabnav-select-field">
          <span className="zone-label">Browse by category</span>
          <select
            className="tabnav-select"
            value={activeId}
            onChange={(e) => onSelectTab(e.target.value)}
            aria-label="Choose a category"
          >
            {tabs.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <p className="zone-label tabnav-pills-label">Browse by category</p>
        <div className="tabnav-pills" role="tablist">
          {tabs.map((t) => (
            <a
              key={t.id}
              role="tab"
              className={activeId === t.id ? 'active' : ''}
              href={getTabHref ? getTabHref(t.id) : '#'}
              onClick={(e) => {
                e.preventDefault();
                onSelectTab(t.id);
              }}
            >
              {t.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function CatalogueCollectionView() {
  return (
    <section className="section" id="collection-info" data-screen-label="Collection">
      <div className="shell">
        <div className="track-intro">
          <span className="eyebrow">Phlebotomy &amp; Collection</span>
          <h2>Where would you like us to come?</h2>
          <p className="lead">{window.ColeebriCompliance.COST_TRANSPARENCY.intro}</p>
          <p className="lead lead--sub">
            {window.ColeebriPricing.kitDeliverySummary()} when we post a kit to you. Mobile collection is priced from
            Worthing, West Sussex — see fees below.
          </p>
        </div>
        <div className="coll-grid">
          <div className="coll-card">
            <h4>Mobile collection</h4>
            <p className="sub">Our clinician comes to your home or workplace.</p>
            <ul className="coll-list">
              <li>
                <span className="lbl">Within 2 miles</span>
                <span className="val">£55</span>
              </li>
              <li>
                <span className="lbl">Within 5 miles</span>
                <span className="val">£62</span>
              </li>
              <li>
                <span className="lbl">Within 10 miles</span>
                <span className="val">£70</span>
              </li>
              <li>
                <span className="lbl">Anywhere in the UK</span>
                <span className="val">From £70</span>
              </li>
            </ul>
            <p className="note">
              Includes professional collection, sterile supplies, centrifuge and delivery to the lab.
            </p>
          </div>
          <div className="coll-card">
            <h4>In-clinic appointment</h4>
            <p className="sub">One Wednesday a month at our Worthing clinic.</p>
            <div className="price-big">£50</div>
            <p className="note">
              140 South Street, Worthing BN14 7NB. Includes professional collection and delivery to the lab.{' '}
              <strong>{window.ColeebriPricing.kitDeliveryInClinicNote()}</strong> (kit &amp; delivery).
            </p>
          </div>
          <div className="coll-card">
            <h4>Home finger-prick kit</h4>
            <p className="sub">For selected tests. Posted to you with full instructions.</p>
            <div className="price-big">Included</div>
            <p className="note">
              Self-collection only. Available on tests showing the <strong>Finger-prick</strong> chip.
            </p>
          </div>
          <div className="coll-card">
            <h4>Kit &amp; delivery</h4>
            <p className="sub">When we post a sample kit for your order.</p>
            <div className="price-big">£{window.ColeebriPricing.KIT_DELIVERY_FEE}</div>
            <p className="note">
              Once per order, added to the laboratory total — not per test.{' '}
              {window.ColeebriPricing.kitDeliveryInClinicNote()}
            </p>
          </div>
          <div className="coll-card">
            <h4>Add-ons</h4>
            <ul className="coll-list">
              <li>
                <span className="lbl">Basic health check</span>
                <span className="val">£5</span>
              </li>
              <li>
                <span className="lbl">Enhanced health check</span>
                <span className="val">£15</span>
              </li>
            </ul>
            <p className="note">Basic check sends blood pressure to your GP. Enhanced adds height and weight.</p>
          </div>
        </div>
        <aside className="collection-notes" aria-label="Other pricing notes">
          <h3 className="collection-notes-title">Other notes</h3>
          <ul className="collection-notes-list">
            <li>£5 discount when your GP has requested the test through the NHS.</li>
            <li>Paediatric appointments (under 13) priced individually.</li>
            <li>For remote areas, specialist or paediatric requests, a £15–£40 supplement may apply.</li>
            <li>Outside our area? We&rsquo;ll connect you with one of our partners.</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

function CatalogueComplianceSection() {
  const C = window.ColeebriCompliance;
  return (
    <section className="section compliance-section" id="our-laboratories" aria-labelledby="labs-heading">
      <div className="shell compliance-section-inner">
        <div className="section-head compliance-section-head">
          <div className="hd-left">
            <span className="eyebrow">Our laboratories</span>
            <h2 id="labs-heading">Accredited partner laboratories</h2>
            <p className="lead">
              Coleebri Health works with three specialist laboratory partners — each chosen for accreditation,
              methodology, and analytical quality in their category.
            </p>
            <ul className="lab-accred-badges" aria-label="Accreditation standards">
              <li>UKAS</li>
              <li>ISO 15189</li>
              <li>3 specialist partners</li>
            </ul>
          </div>
        </div>
        <div className="lab-partners-grid">
          {C.LABORATORY_PARTNERS.map((lab) => (
            <article key={lab.id} className="lab-partner-card">
              <h3 className="lab-partner-card__name">{lab.name}</h3>
              <p className="lab-partner-card__meta">{lab.meta}</p>
              <p className="lab-partner-card__tags">{lab.tags}</p>
              <p className="lab-partner-card__body">{lab.body}</p>
            </article>
          ))}
        </div>
        <div className="lab-routing">
          <h3 className="lab-routing__title">Which partner processes which tests?</h3>
          <div className="lab-routing-table-wrap">
            <table className="lab-routing-table">
              <thead>
                <tr>
                  <th scope="col">Test category</th>
                  <th scope="col">Laboratory</th>
                  <th scope="col">Typical turnaround</th>
                </tr>
              </thead>
              <tbody>
                {C.LAB_ROUTING_TABLE.map((row) => (
                  <tr key={row.category}>
                    <td>{row.category}</td>
                    <td>{row.lab}</td>
                    <td>{row.turnaround}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="accred-row">
          <div className="accred-card">
            <h4>Professional collection</h4>
            <p>
              Home visits, in-clinic days and postal kits — samples taken by qualified clinicians and sent to accredited
              laboratories.
            </p>
          </div>
          <div className="accred-card">
            <h4>Qualified, DBS-checked clinicians</h4>
            <p>
              Every sample is taken by a qualified phlebotomist or healthcare practitioner with an enhanced DBS check.
            </p>
          </div>
          <div className="accred-card">
            <h4>Legal DNA accreditations</h4>
            <p>
              Our DNA partners hold MoJ accreditation for court-directed parentage tests, plus ISO/IEC 17025 and ANAB.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogueHowResultsWork() {
  const block = window.ColeebriCompliance.HOW_RESULTS;
  return (
    <section className="section info-content-section" id="how-results-work" aria-labelledby="how-results-heading">
      <div className="shell">
        <span className="eyebrow">Your results</span>
        <h2 id="how-results-heading">{block.title}</h2>
        {block.sections.map((sec) => (
          <div key={sec.heading} className="info-content-block">
            <h3>{sec.heading}</h3>
            {sec.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function CatalogueCostTransparency() {
  const cost = window.ColeebriCompliance.COST_TRANSPARENCY;
  return (
    <section className="section info-content-section" id="cost-transparency" aria-labelledby="cost-transparency-heading">
      <div className="shell">
        <span className="eyebrow">Pricing</span>
        <h2 id="cost-transparency-heading">{cost.title}</h2>
        <p className="lead">{cost.intro}</p>
        <h3 className="info-content-subhead">{cost.collectionTitle}</h3>
        <div className="cost-table-wrap">
          <table className="cost-table">
            <thead>
              <tr>
                <th scope="col">Collection method</th>
                <th scope="col">Fee</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {cost.rows.map((row) => (
                <tr key={row.method}>
                  <td>{row.method}</td>
                  <td>{row.fee}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="info-content-footnote">{cost.footnote}</p>
      </div>
    </section>
  );
}

function CatalogueConsumerRights() {
  const block = window.ColeebriCompliance.CONSUMER_RIGHTS;
  return (
    <section
      className="section info-content-section patient-info-section"
      id="terms-cancellation"
      aria-labelledby="terms-heading"
    >
      <div className="shell">
        <span className="eyebrow">Your rights</span>
        <h2 id="terms-heading">{block.title}</h2>
        {block.sections.map((sec) => (
          <div key={sec.heading} className="info-content-block">
            <h3>{sec.heading}</h3>
            {sec.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function CatalogueLegalDisclaimer() {
  const block = window.ColeebriCompliance.LEGAL_DISCLAIMER;
  return (
    <section className="section info-content-section legal-section" id="legal-information" aria-labelledby="legal-heading">
      <div className="shell">
        <span className="eyebrow">Legal</span>
        <h2 id="legal-heading">{block.title}</h2>
        {block.sections.map((sec) => (
          <div key={sec.heading} className="info-content-block">
            <h3>{sec.heading}</h3>
            {sec.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function CataloguePatientInformation({ onOpenMarkerCheck }) {
  const notice = window.ColeebriCompliance.ADVERTISING_NOTICE;
  const general = window.ColeebriCompliance.getDisclaimer('general');
  const extraKinds = ['sexual', 'allergy', 'paternity', 'dna', 'fitness', 'specialist'];

  return (
    <section className="section patient-info-section" id="patient-information" aria-labelledby="patient-info-heading">
      <div className="shell">
        <span className="eyebrow">Patient information</span>
        <h2 id="patient-info-heading">Understanding your tests</h2>
        <p className="lead">
          Plain-language guides to what we collect, what laboratories measure, and how to use this catalogue
          responsibly.
        </p>
        <aside className="patient-info-service" id="about-our-service" aria-labelledby="about-our-service-heading">
          <h3 id="about-our-service-heading">What Coleebri Health is</h3>
          <p className="patient-info-service__lead">{window.ColeebriCompliance.SERVICE_DEFINITION}</p>
          {window.ColeebriCompliance.SERVICE_INTRO.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </aside>
        {onOpenMarkerCheck ? (
          <div className="patient-info-actions no-print">
            <button type="button" className="btn btn-outline marker-check-open" onClick={onOpenMarkerCheck}>
              <Icon.info size={18} /> Check a marker
            </button>
            <p className="patient-info-actions__hint">
              Look up a biomarker — plain-language summary and trusted UK links for further reading.
            </p>
          </div>
        ) : null}
        <details className="patient-info-legal">
          <summary>{general.title}</summary>
          <div className="patient-info-legal__body">
            {general.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <h4>{notice.title}</h4>
            <ul className="patient-info-list">
              {notice.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="patient-info-legal__cap">{window.ColeebriCompliance.CAP_HEALTH_CLAIMS}</p>
          </div>
        </details>
        <details className="patient-info-legal patient-info-legal--sub">
          <summary>Notes for sexual health, allergy, DNA and wellbeing tests</summary>
          <div className="patient-info-legal__body patient-info-legal__body--stacked">
            {extraKinds.map((kind) => {
              const d = window.ColeebriCompliance.getDisclaimer(kind);
              return (
                <div key={kind} className="patient-info-legal__topic">
                  <h4>{d.title}</h4>
                  {d.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              );
            })}
          </div>
        </details>
        <BiomarkerGlossary />
      </div>
    </section>
  );
}

window.CatalogueBlocks = {
  MostOrderedSection,
  CatalogueCategoryList,
  CatalogueCtaPanel,
  CatalogueTestGrid,
  CatalogueTabNav,
  CatalogueCollectionView,
  CatalogueComplianceSection,
  CatalogueHowResultsWork,
  CatalogueCostTransparency,
  CatalogueConsumerRights,
  CatalogueLegalDisclaimer,
  CataloguePatientInformation,
};
