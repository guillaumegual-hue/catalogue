/* Check a biomarker — Coleebri plain language + outbound links (no NHS/NICE reproduced text) */

function MarkerCheckPanel({ initialQuery, embedded }) {
  const allEntries = React.useMemo(function () {
    return window.ColeebriGlossary.getEntries();
  }, []);

  const [query, setQuery] = React.useState(initialQuery || '');
  const [selectedSlug, setSelectedSlug] = React.useState(null);
  const [report, setReport] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const inputRef = React.useRef(null);

  const suggestions = React.useMemo(
    function () {
      return window.ColeebriGlossaryApi.searchMarkers(query).slice(0, 8);
    },
    [query]
  );

  React.useEffect(function () {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  function pickEntry(entry) {
    setQuery(entry.also ? entry.term + ' (' + entry.also + ')' : entry.term);
    setSelectedSlug(entry.slug);
    setReport(null);
    setError(null);
  }

  function runLookup(slugOrQuery) {
    const target = slugOrQuery || selectedSlug || query;
    if (!String(target).trim()) {
      setError('Type or choose a marker first.');
      return;
    }
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const result = window.ColeebriGlossaryApi.lookupMarker(target);
      if (!result.ok) {
        setError(result.error);
        setSelectedSlug(null);
      } else {
        setReport(result);
        setSelectedSlug(result.slug);
        setQuery(result.also ? result.term + ' (' + result.also + ')' : result.term);
      }
    } catch (_e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    runLookup();
  }

  return (
    <div
      className={embedded ? 'marker-check-panel marker-check-panel--embedded' : 'marker-check-modal-inner'}
      role={embedded ? 'region' : undefined}
      aria-labelledby="marker-check-title"
    >
      <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
        General information
      </span>
      <h2 id="marker-check-title" className="marker-check-title">
        Check a marker
      </h2>
      <p className="marker-check-lead">
        Type or choose a marker to see what laboratories usually measure, explained in everyday
        language, with optional links to NHS.uk and NICE if you want to read more. For general
        background only — your clinician interprets your own results.
      </p>

      <form className="marker-check-form" onSubmit={onSubmit}>
        <label className="marker-check-label" htmlFor="marker-check-input">
          Marker name
        </label>
        <div className="marker-check-input-row">
          <input
            id="marker-check-input"
            ref={inputRef}
            type="text"
            className="marker-check-input"
            value={query}
            onChange={function (e) {
              setQuery(e.target.value);
              setSelectedSlug(null);
              setReport(null);
              setError(null);
            }}
            placeholder="e.g. HbA1c, PSA, ferritin…"
            list="marker-check-datalist"
            autoComplete="off"
            aria-describedby="marker-check-hint"
          />
          <button type="submit" className="btn btn-solid marker-check-submit" disabled={loading}>
            {loading ? 'Looking up…' : 'Look up'}
          </button>
        </div>
        <p id="marker-check-hint" className="marker-check-hint">
          General information only. Discuss results with a GP or other registered clinician.
        </p>

        <datalist id="marker-check-datalist">
          {allEntries.map(function (e) {
            const label = e.also ? e.term + ' (' + e.also + ')' : e.term;
            return <option key={e.slug} value={label} />;
          })}
        </datalist>

        {suggestions.length > 0 && query.trim() && !report ? (
          <ul className="marker-check-suggestions" role="listbox" aria-label="Matching markers">
            {suggestions.map(function (e) {
              const label = e.also ? e.term + ' (' + e.also + ')' : e.term;
              return (
                <li key={e.slug}>
                  <button
                    type="button"
                    className={
                      'marker-check-suggestion' + (selectedSlug === e.slug ? ' is-selected' : '')
                    }
                    onClick={function () {
                      pickEntry(e);
                      runLookup(e.slug);
                    }}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </form>

      {error ? (
        <p className="marker-check-error" role="alert">
          {error}
        </p>
      ) : null}

      {report && report.ok ? (
        <article className="marker-check-result">
          <header className="marker-check-result__head">
            <h3>{report.also ? report.term + ' (' + report.also + ')' : report.term}</h3>
          </header>

          <section className="marker-check-section">
            <h4>What this test may measure</h4>
            <p>{report.plain}</p>
          </section>

          <GlossaryFurtherLinks nice={report.nice} nhs={report.nhs} />

          <p className="disclaimer-footnote">
            {window.ColeebriCompliance.SHORT_SERVICE_NOTE}{' '}
            <a href="#about-our-service">About our service</a>.
          </p>
        </article>
      ) : null}
    </div>
  );
}

function MarkerCheckModal({ onClose, initialQuery }) {
  React.useEffect(function () {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return function () {
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="overlay marker-check-overlay" onClick={onClose} role="presentation">
      <div
        className="modal marker-check-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="marker-check-title"
        onClick={function (e) {
          e.stopPropagation();
        }}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <Icon.close />
        </button>
        <MarkerCheckPanel initialQuery={initialQuery} embedded={false} />
      </div>
    </div>
  );
}
