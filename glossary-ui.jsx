/* Biomarker glossary — Coleebri plain language + outbound links only (ASA/CAP safe) */

function BiomarkerMarkerCard({ entry, defaultOpen }) {
  const label = entry.also ? entry.term + ' (' + entry.also + ')' : entry.term;
  const g = entry.guidance;
  return (
    <details className="glossary-item glossary-item--single" data-slug={entry.slug} open={defaultOpen || undefined}>
      <summary>{label}</summary>
      <p className="glossary-plain">{entry.plain}</p>
      {g ? <GlossaryFurtherLinks nice={g.nice} nhs={g.nhs} /> : null}
    </details>
  );
}

function BiomarkerGlossarySingle({ slug }) {
  const entry = React.useMemo(function () {
    return window.ColeebriGlossary.getEntry(slug);
  }, [slug]);

  if (!entry) {
    return (
      <div className="biomarker-glossary biomarker-glossary--single">
        <p className="glossary-plain">We could not find that biomarker. Try the full glossary or check the spelling.</p>
      </div>
    );
  }

  const label = entry.also ? entry.term + ' (' + entry.also + ')' : entry.term;
  return (
    <div className="biomarker-glossary biomarker-glossary--single">
      <h3 className="biomarker-glossary__title">{label}</h3>
      <p className="biomarker-glossary__intro">
        General information about what laboratories may measure — not personal medical advice.
      </p>
      <BiomarkerMarkerCard entry={entry} defaultOpen />
    </div>
  );
}

function BiomarkerGlossary({ markerSlug }) {
  const entries = React.useMemo(function () {
    return window.ColeebriGlossary.getEntries();
  }, []);

  if (markerSlug) {
    return <BiomarkerGlossarySingle slug={markerSlug} />;
  }

  return (
    <div className="biomarker-glossary">
      <h3 className="biomarker-glossary__title">Biomarker glossary</h3>
      <p className="biomarker-glossary__intro">
        Short explanations in everyday language, written by Coleebri Health — general information
        about what a test may measure, not personal medical advice.{' '}
        <a href="#patient-information">Full patient information</a>.
      </p>
      <div className="glossary-list">
        {entries.map(function (entry) {
          const label = entry.also ? entry.term + ' (' + entry.also + ')' : entry.term;
          const g = entry.guidance;
          return (
            <details key={entry.slug} className="glossary-item" data-slug={entry.slug}>
              <summary>{label}</summary>
              <p className="glossary-plain">{entry.plain}</p>
              {g ? <GlossaryFurtherLinks nice={g.nice} nhs={g.nhs} /> : null}
            </details>
          );
        })}
      </div>
    </div>
  );
}
