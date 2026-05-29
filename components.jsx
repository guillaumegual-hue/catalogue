/* Coleebri - shared components (simplified) */

const Icon = {
  search: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  ),
  close: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  clock: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  ),
  sparkles: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 1.9 5.6L20 11l-6.1 2.4L12 19l-1.9-5.6L4 11l6.1-2.4Z" /><path d="M19 4v3M21 5.5h-3M5 18v3M6.5 19.5h-3" />
    </svg>
  ),
  pin: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4h6l-1 5 4 4H6l4-4z" /><path d="M12 13v7" />
    </svg>
  ),
  pinned: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4h6l-1 5 4 4H6l4-4z" /><path d="M12 13v7" stroke="currentColor" fill="none" />
    </svg>
  ),
  info: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" />
    </svg>
  ),
  shield: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5 4 5v6c0 5 3.5 8.5 8 10.5 4.5-2 8-5.5 8-10.5V5z" />
    </svg>
  ),
  arrowRight: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  cart: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" />
      <path d="M3 3h2l1.6 9.6a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L19 7H6" />
    </svg>
  ),
  check: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  pdf: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5M9 13h6M9 17h4" />
    </svg>
  ),
  /* Sample-type icons */
  venous: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c2.5 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2.5-6 5-10Z" />
    </svg>
  ),
  fingerprick: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4v8a4 4 0 0 0 8 0V4M8 8h8" />
      <circle cx="12" cy="20" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  urine: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h10v3l-1 14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2L7 6z" />
      <path d="M7 6h10" />
    </svg>
  ),
  dna: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3c0 6 14 6 14 12s-14 6-14 12" />
      <path d="M19 3c0 6-14 6-14 12s14 6 14 12" />
      <path d="M7 6h10M7 18h10M9 9h6M9 15h6" />
    </svg>
  ),
};

/* Price formatter */
function formatPrice(t) {
  if (t.poa || t.price === null || t.price === undefined) return 'On request';
  if (t.priceUpper) return `£${t.price}-£${t.priceUpper}`;
  return `£${t.price}`;
}

/* Sample type chip */
function SampleChip({ type }) {
  const meta = window.SAMPLE_TYPES[type];
  if (!meta) return null;
  const I = Icon[type];
  return (
    <span className={`s-chip s-chip-${type}`} title={meta.label}>
      {I && <I size={12} />} {meta.short}
    </span>
  );
}

const TC_CODE_PLACEHOLDERS = new Set(['-', 'n/a', 'na']);

/** Inline catalogue test links in blurbs: {{GH013:Well Man Check}} */
const BLURB_TEST_REF_RE = /\{\{([A-Z]+\d+)(?::([^}]+))?\}\}/g;

function findTestByRefId(testId) {
  if (!window.TESTS || !testId) return null;
  return window.TESTS.find((t) => t.id === testId) || null;
}

function blurbToPlainText(blurb) {
  if (!blurb) return '';
  return blurb.replace(BLURB_TEST_REF_RE, (_, id, label) => {
    const t = findTestByRefId(id);
    return label || (t && t.name) || id;
  });
}

function parseBlurbParts(blurb) {
  if (!blurb || blurb.indexOf('{{') === -1) return [{ type: 'text', value: blurb || '' }];
  const parts = [];
  let last = 0;
  let match;
  const re = new RegExp(BLURB_TEST_REF_RE.source, 'g');
  while ((match = re.exec(blurb)) !== null) {
    if (match.index > last) parts.push({ type: 'text', value: blurb.slice(last, match.index) });
    parts.push({ type: 'link', id: match[1], label: match[2] || null });
    last = match.index + match[0].length;
  }
  if (last < blurb.length) parts.push({ type: 'text', value: blurb.slice(last) });
  return parts;
}

function TestBlurb({ text, onTestLink, className = 'tc-blurb' }) {
  const parts = parseBlurbParts(text);

  function handleTestLink(e, testId) {
    e.preventDefault();
    const related = findTestByRefId(testId);
    if (!related) return;
    if (onTestLink) {
      onTestLink(related);
      return;
    }
    if (window.ColeebriEmbedParams && window.ColeebriEmbedParams.buildCatalogueHash) {
      const hash = window.ColeebriEmbedParams.buildCatalogueHash({ test: testId });
      if (window.parent && window.parent !== window) {
        window.parent.location.hash = hash;
      } else {
        location.hash = hash;
      }
    }
  }

  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part.type === 'text') return <React.Fragment key={i}>{part.value}</React.Fragment>;
        const related = findTestByRefId(part.id);
        const label = part.label || (related && related.name) || part.id;
        const hash =
          window.ColeebriEmbedParams && window.ColeebriEmbedParams.buildCatalogueHash
            ? window.ColeebriEmbedParams.buildCatalogueHash({ test: part.id })
            : '#test=' + part.id;
        return (
          <a
            key={i}
            href={hash}
            className="tc-blurb__link"
            onClick={(e) => handleTestLink(e, part.id)}
          >
            {label}
          </a>
        );
      })}
    </p>
  );
}

function displayTestCode(code) {
  if (code == null) return null;
  const s = String(code).trim();
  if (!s || TC_CODE_PLACEHOLDERS.has(s.toLowerCase())) return null;
  return s;
}

/* ── TEST-SPECIFIC REGULATORY NOTICE (PSA, IgG food panel, etc.) ── */
function TestComplianceNoticeBody({ notice }) {
  const n = notice;
  return (
    <>
      {n.paragraphs ? (
        n.paragraphs.map((p, i) => (
          <p key={i} className="test-compliance-notice__para">
            {p}
          </p>
        ))
      ) : (
        <ul className="test-compliance-notice__list">
          {(n.bullets || []).map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {n.links && n.links.length > 0 ? (
        <p className="test-compliance-notice__links">
          {n.links.map((l, i) => (
            <React.Fragment key={l.url}>
              {i > 0 ? ' · ' : null}
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </React.Fragment>
          ))}
        </p>
      ) : null}
    </>
  );
}

function TestComplianceNotice({ noticeKey }) {
  const n = window.ColeebriCompliance.getTestNotice(noticeKey);
  if (!n) return null;

  if (n.collapsible) {
    return (
      <details className="test-compliance-notice test-compliance-notice--disclosure" role="note">
        <summary className="test-compliance-notice__summary">
          <span className="test-compliance-notice__summary-icon" aria-hidden="true">
            <Icon.info size={16} />
          </span>
          <span className="test-compliance-notice__summary-text">{n.title}</span>
          <span className="test-compliance-notice__chevron" aria-hidden="true" />
        </summary>
        <div className="test-compliance-notice__panel">
          <TestComplianceNoticeBody notice={n} />
        </div>
      </details>
    );
  }

  return (
    <aside className="test-compliance-notice" role="note">
      <h4 className="test-compliance-notice__title">{n.title}</h4>
      <TestComplianceNoticeBody notice={n} />
    </aside>
  );
}

/** Collapsible blurb + full marker list in enquiry modals */
function RequestTestDetails({ test, onTestLink }) {
  const markers = test.components || [];
  const markerLabel = markers.length === 1 ? '1 marker' : `${markers.length} markers`;

  return (
    <details className="request-test-details">
      <summary className="request-test-details__summary">
        <span className="request-test-details__summary-text">Description &amp; markers included</span>
        {markers.length > 0 ? (
          <span className="request-test-details__count">{markerLabel}</span>
        ) : null}
      </summary>
      <div className="request-test-details__panel">
        {test.blurb ? (
          <TestBlurb text={test.blurb} onTestLink={onTestLink} className="request-test-details__blurb" />
        ) : null}
        {markers.length > 0 ? (
          <div className="request-test-details__markers">
            <span className="tc-components-label">Includes</span>
            <div className="tc-components-list">
              {markers.map((c, i) => (
                <span key={i} className="tc-comp">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </details>
  );
}

function TestCardServiceNote({ linkToPatientInfo = true }) {
  const text = window.ColeebriCompliance.SHORT_SERVICE_NOTE;
  return (
    <p className="tc-service-note">
      {text}{' '}
      {linkToPatientInfo ? (
        <a href="#about-our-service">More about our service</a>
      ) : null}
    </p>
  );
}

/* ── TEST CARD ───────────────────────────────────────────── */
function TestCard({ test, compared, onCompare, onOpen, onCart, inCart, tweaks }) {
  const [showAll, setShowAll] = React.useState(!!tweaks.showAnalytesByDefault);
  const visible = showAll ? test.components : test.components.slice(0, 4);
  const more = test.components.length - visible.length;
  const codeLabel = displayTestCode(test.code);

  return (
    <article className={`test-card ${compared ? 'is-compared' : ''} ${inCart ? 'in-cart' : ''}`}>
      <header className="tc-head">
        <div className="tc-samples">
          {test.samples.map(s => <SampleChip key={s} type={s} />)}
          {test.homeKit && <span className="s-chip s-chip-kit" title="Self-test home kit available">Home kit</span>}
          {test.legal && <span className="s-chip s-chip-legal" title="Chain-of-custody / court-admissible">Court-admissible</span>}
        </div>
        {codeLabel && <div className="tc-code">{codeLabel}</div>}
      </header>

      <h3 className="tc-name">{test.name}</h3>
      <TestBlurb text={test.blurb} onTestLink={onOpen} />
      {test.notice ? <TestComplianceNotice noticeKey={test.notice} /> : null}

      <div className="tc-components">
        <span className="tc-components-label">Includes</span>
        <div className="tc-components-list">
          {visible.map((c, i) => <span key={i} className="tc-comp">{c}</span>)}
          {more > 0 && (
            <button className="tc-more" onClick={() => setShowAll(true)}>
              +{more} more
            </button>
          )}
          {showAll && test.components.length > 5 && (
            <button className="tc-more" onClick={() => setShowAll(false)}>
              Show less
            </button>
          )}
        </div>
      </div>

      <footer className="tc-foot">
        <div className="tc-foot-row">
          <div className="tc-meta">
            <span className="tc-turn"><Icon.clock /> {test.turnaround}</span>
            <span className="tc-price">
              {test.priceUpper && <span className="from">from </span>}
              {formatPrice(test)}
            </span>
          </div>
          <div className="tc-actions">
            <button
              type="button"
              className={`tc-cart ${inCart ? 'in-list' : ''}`}
              onClick={() => onCart(test)}
              aria-pressed={inCart}
              title={inCart ? 'Remove from your list' : 'Add to your list'}
            >
              {inCart ? <Icon.check /> : <Icon.cart size={15} />}
              <span className="lbl">{inCart ? 'Added' : 'Add to list'}</span>
            </button>
            <button
              type="button"
              className={`tc-pin ${compared ? 'pinned' : ''}`}
              onClick={() => onCompare(test)}
              aria-pressed={compared}
              title={compared ? 'Remove from compare' : 'Compare'}
            >
              {compared ? <Icon.pinned /> : <Icon.pin />}
              <span className="lbl">{compared ? 'Comparing' : 'Compare'}</span>
            </button>
            <button type="button" className="tc-cta" onClick={() => onOpen(test)}>
              Enquire <Icon.arrowRight />
            </button>
          </div>
        </div>
        <TestCardServiceNote />
      </footer>
    </article>
  );
}

/* ── DISCLAIMER — full block (embed / print) or compact footnote ── */
function Disclaimer({ kind = 'general', compact = false }) {
  const d = window.ColeebriCompliance.getDisclaimer(kind);
  if (compact) {
    const line =
      kind === 'general' ? window.ColeebriCompliance.SHORT_SERVICE_NOTE : d.paragraphs[0];
    return (
      <p className="disclaimer-footnote">
        {line}{' '}
        <a href="#about-our-service">About our service</a>.
      </p>
    );
  }
  return (
    <aside className="disclaimer disclaimer--full">
      <span className="icon"><Icon.shield /></span>
      <div className="disclaimer__body">
        <p><strong>{d.title}</strong></p>
        {d.paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </aside>
  );
}

function SectionHint({ sectionId }) {
  const hint = window.ColeebriCompliance.sectionHint(sectionId);
  if (!hint) return null;
  return (
    <p className="section-hint">
      {hint}{' '}
      <a href="#patient-information">Patient information</a>.
    </p>
  );
}

function CatalogueFootnote() {
  return (
    <p className="catalogue-footnote">
      {window.ColeebriCompliance.SHORT_SERVICE_NOTE}{' '}
      <a href="#about-our-service">About our service</a>.
    </p>
  );
}

Object.assign(window, {
  Icon,
  TestCard,
  TestCardServiceNote,
  TestBlurb,
  RequestTestDetails,
  TestComplianceNotice,
  blurbToPlainText,
  findTestByRefId,
  Disclaimer,
  SectionHint,
  CatalogueFootnote,
  formatPrice,
  SampleChip,
});
