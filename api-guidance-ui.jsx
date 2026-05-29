/* Outbound links only — no reproduced NHS/NICE text */

function GlossaryFurtherLinks({ nice, nhs }) {
  if ((!nice || !nice.length) && (!nhs || !nhs.length)) return null;
  return (
    <div className="glossary-further-links">
      <h4 className="glossary-further-links__title">Read more on official sites</h4>
      <p className="glossary-further-links__note">
        These links open NHS.uk or NICE in a new tab. We do not copy their content onto this page.
      </p>
      {nice && nice.length > 0 ? (
        <div className="glossary-sources glossary-sources--nice">
          <h5 className="glossary-sources__heading">NICE</h5>
          <ul className="glossary-sources__list">
            {nice.map(function (s) {
              return (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {nhs && nhs.length > 0 ? (
        <div className="glossary-sources glossary-sources--nhs">
          <h5 className="glossary-sources__heading">NHS.uk</h5>
          <ul className="glossary-sources__list">
            {nhs.map(function (s) {
              return (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function GlossaryComplianceNote() {
  const notice = window.ColeebriCompliance.GLOSSARY_NOTICE;
  return (
    <aside className="glossary-compliance-note disclaimer-block">
      <h4>{notice.title}</h4>
      {notice.paragraphs.map(function (p) {
        return <p key={p}>{p}</p>;
      })}
    </aside>
  );
}
