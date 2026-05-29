/* Coleebri Health — full catalogue PDF / print (generated from data.js) */

(function () {
  const CODE_PLACEHOLDERS = new Set(['-', 'n/a', 'na']);
  const LOGO_URL = 'https://health.coleebri.com/wp-content/uploads/sites/12/2025/02/Fichier-7@2x.png';

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function displayCode(code) {
    if (code == null) return '';
    const s = String(code).trim();
    if (!s || CODE_PLACEHOLDERS.has(s.toLowerCase())) return '';
    return s;
  }

  function formatPrice(t) {
    if (t.poa || t.price == null || t.price === undefined) return 'On request';
    if (t.priceUpper) return `£${t.price}-£${t.priceUpper}`;
    return `£${t.price}`;
  }

  function componentsHtml(t, maxLen = 260) {
    const raw = (t.components || []).join(' · ');
    if (!raw) return '';
    const text = raw.length > maxLen ? `${raw.slice(0, maxLen).trim()}…` : raw;
    return escapeHtml(text);
  }

  function sampleChipsHtml(test) {
    const chips = (test.samples || []).map((s) => {
      const meta = window.SAMPLE_TYPES[s];
      return `<span class="chip chip-${escapeHtml(s)}">${escapeHtml(meta?.short || s)}</span>`;
    });
    if (test.homeKit) chips.push('<span class="chip chip-kit">Home kit</span>');
    if (test.legal) chips.push('<span class="chip chip-legal">Court-admissible</span>');
    return chips.join('');
  }

  function cardHtml(t) {
    const code = displayCode(t.code);
    const priceInner = t.priceUpper ? '<span class="from">from </span>' : '';
    const comp = componentsHtml(t);
    return `<article class="card">
      <div class="card-top">
        <div class="chips">${sampleChipsHtml(t)}</div>
        ${code ? `<span class="code">${escapeHtml(code)}</span>` : ''}
      </div>
      <h3>${escapeHtml(t.name)}</h3>
      <p class="blurb">${escapeHtml(t.blurb || '')}</p>
      ${comp ? `<div class="components"><span class="label">Includes</span>${comp}</div>` : ''}
      <div class="card-foot">
        <span class="turn">${escapeHtml(t.turnaround || '')}</span>
        <span class="price">${priceInner}${formatPrice(t)}</span>
      </div>
      <p class="card-service-note">${escapeHtml(window.ColeebriCompliance?.SERVICE_DESCRIPTION || '')}</p>
    </article>`;
  }

  function sectionDisclaimer(secId) {
    if (!window.ColeebriCompliance) return '';
    const html = window.ColeebriCompliance.sectionDisclaimerHtml(secId);
    return html ? html.replace('disclaimer-block', 'disclaimer') : '';
  }

  function renderPatientInformation() {
    if (!window.ColeebriCompliance || !window.ColeebriGlossary) return '';
    const notice = window.ColeebriCompliance.ADVERTISING_NOTICE;
    const d = window.ColeebriCompliance.getDisclaimer('general');
    return `<section class="print-page print-legal">
      ${secHead('Information', 'Understanding your tests', 'Please read')}
      <p class="sec-blurb">${escapeHtml(window.ColeebriCompliance.SERVICE_DESCRIPTION)}</p>
      <h3 class="legal-sub">${escapeHtml(notice.title)}</h3>
      <ul class="legal-list">${notice.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
      <h3 class="legal-sub">${escapeHtml(d.title)}</h3>
      ${d.paragraphs.map((p) => `<p class="legal-p">${escapeHtml(p)}</p>`).join('')}
      ${window.ColeebriGlossary.glossaryHtml({ forPrint: true })}
    </section>`;
  }

  function secHead(num, title, meta) {
    return `<div class="sec-head">
      <div><div class="num">${escapeHtml(num)}</div><h2>${escapeHtml(title)}</h2></div>
      ${meta ? `<span class="sec-meta">${escapeHtml(meta)}</span>` : ''}
    </div>`;
  }

  function renderMostOrdered() {
    if (!window.resolveMostOrdered) return '';
    const slots = window.resolveMostOrdered();
    if (!slots.length) return '';
    return `<section class="print-page print-featured">
      ${secHead('Featured', 'Our most ordered tests', `${slots.length} highlights`)}
      <p class="sec-blurb">Extensive panels patients book most often — women's health, men's health, allergies and sport.</p>
      <div class="featured-grid">
        ${slots
          .map(
            (s) => `<div class="featured-slot">
          <h4>${escapeHtml(s.label)}</h4>
          <p class="featured-blurb">${escapeHtml(s.blurb)}</p>
          ${cardHtml(s.test)}
        </div>`
          )
          .join('')}
      </div>
    </section>`;
  }

  function renderCollection() {
    const fee = window.ColeebriPricing?.KIT_DELIVERY_FEE ?? 7;
    const sections = window.SECTIONS || [];
    const num = String(sections.length + 2).padStart(2, '0');
    return `<section class="print-page print-collection">
      ${secHead(`Section ${num}`, 'Phlebotomy &amp; Collection', 'Pricing guide')}
      <p class="sec-blurb">Laboratory prices are per test. £${fee} kit &amp; delivery once per order when we post a kit to you (free for in-clinic appointments). Collection fees are additional and calculated from Worthing, West Sussex.</p>
      <div class="coll-grid">
        <div class="coll-card">
          <h4>Mobile collection</h4>
          <p class="sub">Our clinician comes to your home or workplace.</p>
          <ul class="coll-list">
            <li><span>Within 2 miles</span><span class="val">£55</span></li>
            <li><span>Within 5 miles</span><span class="val">£62</span></li>
            <li><span>Within 10 miles</span><span class="val">£70</span></li>
            <li><span>Anywhere in the UK</span><span class="val">From £70</span></li>
          </ul>
          <p class="note">Includes professional collection, sterile supplies, centrifuge and delivery to the lab.</p>
        </div>
        <div class="coll-card">
          <h4>In-clinic appointment</h4>
          <p class="sub">Monthly clinic day, Worthing</p>
          <div class="price-big">£50</div>
          <p class="note">140 South Street, Worthing BN14 7NB. Includes professional collection and delivery to the lab. <strong>Free kit &amp; delivery</strong> for in-clinic appointments.</p>
        </div>
        <div class="coll-card">
          <h4>Home finger-prick kit</h4>
          <p class="sub">For selected tests. Posted to you with full instructions.</p>
          <div class="price-big">Included</div>
          <p class="note">Self-collection only. Available on tests showing the <strong>Finger-prick</strong> chip.</p>
        </div>
        <div class="coll-card">
          <h4>Kit &amp; delivery</h4>
          <p class="sub">When we post a sample kit for your order.</p>
          <div class="price-big">£${fee}</div>
          <p class="note">Once per order, added to the laboratory total — not per test. Free for in-clinic appointments.</p>
        </div>
        <div class="coll-card coll-card--wide">
          <h4>Add-ons</h4>
          <ul class="coll-list">
            <li><span>Basic health check</span><span class="val">£5</span></li>
            <li><span>Enhanced health check</span><span class="val">£15</span></li>
          </ul>
          <p class="note">Basic check sends blood pressure to your GP. Enhanced adds height and weight.</p>
        </div>
      </div>
      <aside class="collection-notes">
        <h3 class="collection-notes-title">Other notes</h3>
        <ul>
          <li>£5 discount when your GP has requested the test through the NHS.</li>
          <li>Paediatric appointments (under 13) priced individually.</li>
          <li>For remote areas, specialist or paediatric requests, a £15–£40 supplement may apply.</li>
          <li>Outside our area? We'll connect you with one of our partners.</li>
        </ul>
      </aside>
    </section>`;
  }

  function renderCompliance() {
    const sections = window.SECTIONS || [];
    const num = String(sections.length + 4).padStart(2, '0');
    return `<section class="print-page print-compliance">
      <div class="num">Section ${num}</div>
      <h2>Standards, safety &amp; accreditations</h2>
      <p class="lead">${escapeHtml(window.ColeebriCompliance?.SERVICE_LEAD || 'Coleebri Health collects samples for accredited laboratories. We do not diagnose or interpret results.')}</p>
      <div class="accred">
        <div class="card2"><h4>Professional collection</h4><p>Home visits, in-clinic days and postal kits — samples taken by qualified clinicians and sent to accredited laboratories.</p></div>
        <div class="card2"><h4>UKAS / ISO 15189 partner labs</h4><p>All medical testing is carried out by UKAS-accredited laboratories meeting ISO 15189 standards for medical testing.</p></div>
        <div class="card2"><h4>Legal DNA accreditations</h4><p>Our DNA partner laboratories are MoJ-accredited for parentage tests directed by civil courts in England and Wales, with ISO/IEC 17025 and ANAB certifications.</p></div>
        <div class="card2"><h4>Qualified, DBS-checked clinicians</h4><p>Every sample is collected by a qualified phlebotomist or healthcare practitioner with an enhanced DBS check.</p></div>
      </div>
      <div class="footer-grid">
        <div><h5>Contact</h5><p><a href="mailto:health@coleebri.com">health@coleebri.com</a><br/>140 South Street<br/>Worthing BN14 7NB<br/><a href="https://health.coleebri.com">health.coleebri.com</a></p></div>
        <div><h5>Healthcare professionals</h5><p>For ad-hoc tests including phlebotomy for your patients, please contact us via health@coleebri.com.</p></div>
        <div><h5>Important</h5><p>${escapeHtml(window.ColeebriCompliance?.URGENT || 'Contact your GP if you are concerned about your health.')}</p></div>
      </div>
      <div class="compliance-foot">
        <span>© 2026 Coleebri Groupe. All rights reserved.</span>
        <span>Catalogue 2026</span>
      </div>
    </section>`;
  }

  function renderPrintCatalogue() {
    const sections = window.SECTIONS || [];
    const tests = window.TESTS || [];

    const cover = `<section class="print-page print-cover">
      <div class="cover-head">
        <img src="${LOGO_URL}" alt="Coleebri Health" class="cover-logo" width="180" height="40"/>
        <span class="cover-yr">Test catalogue · 2026</span>
      </div>
      <h1>Your partner in health and wellness.</h1>
      <p class="cover-sub">A simple guide to every blood, urine and DNA test we collect on your behalf — sent securely to UKAS-accredited partner laboratories.</p>
      <div class="cover-badges">
        <span class="cover-badge">Professional collection</span>
        <span class="cover-badge">UKAS / ISO 15189 partner labs</span>
        <span class="cover-badge">MoJ-accredited DNA partner</span>
        <span class="cover-badge">DBS-checked clinicians</span>
      </div>
      <div class="cover-panels">
        <div class="cover-panel"><span class="kicker">Catalogue 2026</span><span class="big">+200 tests available</span><p>Blood, urine and DNA wellness &amp; screening tests</p></div>
        <div class="cover-panel"><span class="kicker">Need something else?</span><p>Can't find your test? Contact us — we can often arrange other markers through our partner laboratories.</p></div>
      </div>
      <div class="cover-foot">
        <div><div>Coleebri Health</div><div>140 South Street · Worthing BN14 7NB</div></div>
        <div class="cover-contact"><div><a href="mailto:health@coleebri.com">health@coleebri.com</a></div><div><a href="https://health.coleebri.com">health.coleebri.com</a></div></div>
      </div>
    </section>`;

    const tocItems = [
      { num: '01', label: 'Featured — most ordered', count: '4 highlights' },
      ...sections.map((s, i) => {
        const n = tests.filter((t) => t.section === s.id).length;
        return {
          num: String(i + 2).padStart(2, '0'),
          label: s.label,
          count: `${n} test${n === 1 ? '' : 's'}`,
        };
      }),
      {
        num: String(sections.length + 2).padStart(2, '0'),
        label: 'Phlebotomy & Collection',
        count: 'Pricing',
      },
      {
        num: String(sections.length + 3).padStart(2, '0'),
        label: 'Standards, safety & accreditations',
        count: '—',
      },
    ];

    const toc = `<section class="print-page print-toc">
      <h2>Contents</h2>
      <p class="sec-blurb">Every test grouped as in the online catalogue. Sample-type tags show whether a venous draw, finger-prick kit, urine or DNA sample is needed.</p>
      <ol class="toc-list">
        ${tocItems
          .map(
            (item) => `<li>
          <span class="num">${item.num}</span>
          <span class="lbl">${escapeHtml(item.label)}</span>
          <span class="count">${escapeHtml(item.count)}</span>
        </li>`
          )
          .join('')}
      </ol>
    </section>`;

    const testSections = sections
      .map((sec, idx) => {
        const sectionTests = tests.filter((t) => t.section === sec.id);
        if (!sectionTests.length) return '';
        const n = sectionTests.length;
        return `<section class="print-page print-section">
        ${secHead(`Section ${String(idx + 2).padStart(2, '0')}`, sec.label, `${n} test${n === 1 ? '' : 's'}`)}
        <p class="sec-blurb">${escapeHtml(sec.blurb)}</p>
        <div class="card-grid">${sectionTests.map(cardHtml).join('')}</div>
        ${sectionDisclaimer(sec.id)}
      </section>`;
      })
      .join('');

    return (
      cover +
      toc +
      renderMostOrdered() +
      testSections +
      renderCollection() +
      renderPatientInformation() +
      renderCompliance()
    );
  }

  function cataloguePrintStyles() {
    return `
  :root {
    --vital: #00889a;
    --deep-cove: #00525c;
    --harbour: #006d7b;
    --breathe: #cce7eb;
    --calm: #e6f3f5;
    --paper: #fafafa;
    --paper-2: #ffffff;
    --paper-inset: #e6f3f5;
    --ink: #1a1f23;
    --ink-2: #4a544f;
    --ink-3: #8a8f8c;
    --border: rgba(0, 136, 154, 0.14);
    --hope: #f5c518;
    --font-display: Poppins, system-ui, sans-serif;
    --font-body: "Work Sans", system-ui, sans-serif;
  }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: var(--paper); color: var(--ink); font-family: var(--font-body); font-size: 10.5pt; line-height: 1.45; }
  h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 600; margin: 0; line-height: 1.15; letter-spacing: -0.01em; }
  a { color: inherit; }

  .print-page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 16mm 14mm 18mm;
    background: var(--paper);
    position: relative;
    break-after: page;
    page-break-after: always;
  }
  .print-page:last-child { break-after: auto; page-break-after: auto; }

  .print-cover {
    min-height: 297mm;
    padding: 22mm 18mm 20mm;
    color: #fff;
    background: linear-gradient(165deg, var(--deep-cove) 0%, var(--harbour) 42%, #004a54 100%);
    display: flex;
    flex-direction: column;
    break-after: page;
    page-break-after: always;
  }
  .cover-head { display: flex; align-items: center; gap: 12pt; margin-bottom: 28mm; }
  .cover-logo { height: 11mm; width: auto; filter: brightness(0) invert(1); display: block; }
  .cover-yr {
    margin-left: auto;
    font-family: var(--font-display);
    font-size: 8pt;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 5pt 10pt;
    border: 1px solid rgba(255,255,255,.32);
    border-radius: 999px;
    color: rgba(255,255,255,.9);
  }
  .print-cover h1 { font-size: 36pt; max-width: 14ch; margin-bottom: 0; color: #fff; }
  .cover-sub { font-size: 12pt; max-width: 50ch; margin-top: 12pt; color: rgba(255,255,255,.88); line-height: 1.55; }
  .cover-badges { display: flex; flex-wrap: wrap; gap: 6pt; margin-top: 16pt; }
  .cover-badge {
    font-family: var(--font-display);
    font-size: 8pt;
    font-weight: 500;
    padding: 5pt 10pt;
    border: 1px solid rgba(255,255,255,.3);
    border-radius: 999px;
    color: rgba(255,255,255,.92);
  }
  .cover-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; margin-top: 18pt; }
  .cover-panel { border: 1px solid rgba(255,255,255,.25); border-radius: 12pt; padding: 11pt 13pt; background: rgba(255,255,255,.08); }
  .cover-panel .kicker { font-size: 7pt; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.72); display: block; margin-bottom: 4pt; }
  .cover-panel .big { font-size: 17pt; font-weight: 600; display: block; font-family: var(--font-display); }
  .cover-panel p { margin: 6pt 0 0; font-size: 9pt; color: rgba(255,255,255,.86); line-height: 1.45; }
  .cover-foot { margin-top: auto; display: flex; justify-content: space-between; gap: 12pt; flex-wrap: wrap; font-size: 9pt; color: rgba(255,255,255,.72); padding-top: 16pt; }
  .cover-contact { text-align: right; }
  .cover-contact a { color: rgba(255,255,255,.92); text-decoration: none; }

  .print-toc h2 { font-size: 24pt; color: var(--deep-cove); margin-bottom: 6pt; }
  .toc-list { list-style: none; padding: 0; margin: 14pt 0 0; }
  .toc-list li {
    display: grid;
    grid-template-columns: 2.2em 1fr auto;
    align-items: baseline;
    gap: 8pt;
    padding: 9pt 0;
    border-bottom: 1px dotted var(--border);
    font-family: var(--font-display);
    font-size: 11pt;
  }
  .toc-list .num { font-size: 8pt; color: var(--ink-3); letter-spacing: 0.1em; }
  .toc-list .count { font-size: 9pt; color: var(--ink-3); font-variant-numeric: tabular-nums; }

  .sec-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12pt;
    margin-bottom: 10pt;
    border-bottom: 2px solid var(--vital);
    padding-bottom: 8pt;
    break-after: avoid;
    page-break-after: avoid;
  }
  .sec-head .num { font-size: 8pt; letter-spacing: 0.16em; text-transform: uppercase; color: var(--vital); margin-bottom: 4pt; }
  .sec-head h2 { font-size: 20pt; color: var(--deep-cove); }
  .sec-meta { font-size: 9pt; color: var(--ink-3); white-space: nowrap; font-variant-numeric: tabular-nums; }
  .sec-blurb { color: var(--ink-2); margin: 0 0 14pt; max-width: 68ch; font-size: 10.5pt; line-height: 1.5; break-after: avoid; }

  .card-grid, .featured-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8pt;
    align-items: start;
  }
  .featured-slot h4 { font-size: 9.5pt; color: var(--vital); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 4pt; }
  .featured-blurb { font-size: 8.5pt; color: var(--ink-3); margin: 0 0 6pt; line-height: 1.4; }

  .card {
    border: 1px solid var(--border);
    border-radius: 8pt;
    background: var(--paper-2);
    padding: 10pt 11pt 11pt;
    break-inside: avoid;
    page-break-inside: avoid;
    display: flex;
    flex-direction: column;
    gap: 5pt;
    min-height: 0;
  }
  .card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 6pt; flex-wrap: wrap; }
  .chips { display: flex; flex-wrap: wrap; gap: 3pt; }
  .chip { font-size: 7pt; font-weight: 600; padding: 2pt 6pt; border-radius: 999px; white-space: nowrap; font-family: var(--font-display); }
  .chip-venous { background: var(--calm); color: var(--vital); }
  .chip-fingerprick { background: #f6efd6; color: #735b1c; }
  .chip-urine { background: #fff4cc; color: #6d5a08; }
  .chip-dna { background: #e5ecf7; color: #2a437c; }
  .chip-kit { background: #e6f3e8; color: #2c6431; }
  .chip-legal { background: var(--ink); color: #fff; }
  .code { font-size: 7.5pt; color: var(--ink-3); font-family: var(--font-display); }
  .card h3 { font-size: 11pt; line-height: 1.2; color: var(--deep-cove); }
  .blurb { font-size: 9pt; color: var(--ink-2); margin: 0; line-height: 1.42; }
  .components { font-size: 8pt; background: var(--paper-inset); border-radius: 5pt; padding: 5pt 7pt; line-height: 1.45; color: var(--ink-2); }
  .components .label { display: block; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-3); margin-bottom: 2pt; font-family: var(--font-display); font-weight: 600; }
  .card-foot { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px dashed var(--border); padding-top: 6pt; margin-top: auto; gap: 8pt; }
  .card-service-note { margin: 6pt 0 0; padding-top: 5pt; border-top: 1px solid var(--border); font-size: 7pt; line-height: 1.4; color: var(--ink-3); }
  .turn { font-size: 8pt; color: var(--ink-3); flex: 1; min-width: 0; }
  .price { font-family: var(--font-display); font-weight: 700; font-size: 14pt; color: var(--ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .price .from { font-size: 6.5pt; font-weight: 500; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em; }

  .disclaimer { margin-top: 12pt; padding: 9pt 11pt; border-left: 3pt solid var(--vital); background: var(--paper-2); font-size: 8.5pt; color: var(--ink-2); line-height: 1.5; break-inside: avoid; }

  .coll-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; }
  .coll-card { border: 1px solid var(--border); border-radius: 8pt; padding: 10pt 12pt; background: var(--paper-2); break-inside: avoid; }
  .coll-card--wide { grid-column: 1 / -1; }
  .coll-card h4 { font-size: 10.5pt; margin-bottom: 3pt; color: var(--deep-cove); }
  .coll-card .sub { font-size: 9pt; color: var(--ink-3); margin-bottom: 6pt; }
  .price-big { font-family: var(--font-display); font-size: 18pt; font-weight: 700; color: var(--vital); margin: 4pt 0; }
  .coll-list { list-style: none; padding: 0; margin: 0; }
  .coll-list li { display: flex; justify-content: space-between; padding: 4pt 0; font-size: 9.5pt; border-bottom: 1px dotted var(--border); gap: 8pt; }
  .coll-list li:last-child { border-bottom: none; }
  .coll-list .val { font-weight: 600; font-family: var(--font-display); white-space: nowrap; }
  .coll-card .note { font-size: 8pt; color: var(--ink-2); margin-top: 6pt; line-height: 1.4; }
  .collection-notes { margin-top: 12pt; padding: 12pt 14pt; background: var(--calm); border-left: 4px solid var(--vital); border-radius: 8pt; break-inside: avoid; }
  .collection-notes-title { font-size: 10pt; margin: 0 0 8pt; color: var(--deep-cove); }
  .collection-notes ul { margin: 0; padding-left: 1.2em; font-size: 9pt; color: var(--ink-2); line-height: 1.45; }
  .collection-notes li + li { margin-top: 5pt; }

  .print-compliance {
    min-height: 297mm;
    padding: 18mm 16mm;
    background: var(--deep-cove);
    color: #fff;
    display: flex;
    flex-direction: column;
    break-before: page;
    page-break-before: always;
  }
  .print-compliance h2 { font-size: 22pt; color: #fff; margin: 6pt 0 10pt; }
  .print-compliance > .num { font-size: 8pt; letter-spacing: 0.16em; text-transform: uppercase; color: var(--breathe); }
  .print-compliance .lead { color: rgba(255,255,255,.85); max-width: 62ch; margin-bottom: 16pt; line-height: 1.55; font-size: 10.5pt; }
  .accred { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; }
  .card2 { padding: 10pt 11pt; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.18); border-radius: 8pt; break-inside: avoid; }
  .card2 h4 { font-size: 10pt; color: #fff; margin-bottom: 4pt; }
  .card2 p { font-size: 8.5pt; color: rgba(255,255,255,.82); margin: 0; line-height: 1.45; }
  .footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12pt; margin-top: 20pt; }
  .footer-grid h5 { font-size: 8pt; letter-spacing: 0.14em; text-transform: uppercase; color: var(--breathe); margin-bottom: 6pt; }
  .footer-grid p { font-size: 8.5pt; color: rgba(255,255,255,.82); margin: 0; line-height: 1.5; }
  .footer-grid a { color: rgba(255,255,255,.95); }
  .compliance-foot { margin-top: auto; padding-top: 16pt; display: flex; justify-content: space-between; gap: 12pt; flex-wrap: wrap; font-size: 8pt; color: rgba(255,255,255,.6); }
  .print-legal .legal-sub { font-size: 11pt; color: var(--deep-cove); margin: 14pt 0 6pt; }
  .print-legal .legal-p, .print-legal .legal-list { font-size: 9.5pt; color: var(--ink-2); line-height: 1.5; }
  .print-legal .legal-list { margin: 0 0 12pt; padding-left: 1.2em; }
  .print-legal .biomarker-glossary, .print-legal .regulatory-sources { margin-top: 14pt; break-inside: avoid; }
  .print-legal .biomarker-glossary__title, .print-legal .regulatory-sources__title { font-size: 12pt; color: var(--deep-cove); margin: 0 0 6pt; }
  .print-legal .biomarker-glossary__intro, .print-legal .regulatory-sources__intro { font-size: 9pt; color: var(--ink-3); margin: 0 0 10pt; }
  .print-legal .glossary-item { border: 1px solid var(--border); border-radius: 6pt; padding: 6pt 8pt; margin-bottom: 5pt; break-inside: avoid; }
  .print-legal .glossary-item__term { font-family: var(--font-display); font-size: 9.5pt; font-weight: 600; margin: 0 0 4pt; color: var(--deep-cove); }
  .print-legal .glossary-item p, .print-legal .glossary-plain { font-size: 8.5pt; color: var(--ink-2); margin: 4pt 0 0; line-height: 1.45; }
  .print-legal .glossary-levels__title, .print-legal .glossary-sources__title { font-size: 8pt; font-weight: 600; color: var(--deep-cove); margin: 6pt 0 3pt; }
  .print-legal .glossary-levels__list { font-size: 8pt; color: var(--ink-2); margin: 0; }
  .print-legal .glossary-levels__list dt { font-weight: 600; margin-top: 3pt; }
  .print-legal .glossary-levels__list dd { margin: 1pt 0 0; }
  .print-legal .glossary-sources { margin-top: 5pt; }
  .print-legal .glossary-sources__list { font-size: 8pt; margin: 0; padding-left: 1.1em; }
  .print-legal .glossary-sources--nhs .glossary-sources__title { color: #005eb8; }
  .print-legal .glossary-ranges-note { font-size: 7.5pt; color: var(--ink-3); font-style: italic; margin-top: 4pt; }
  .print-legal .regulatory-sources__list { margin: 0; padding-left: 1.2em; font-size: 8.5pt; color: var(--ink-2); }
  .print-legal .regulatory-sources__list a { color: var(--vital); }
  .disclaimer-block__title, .disclaimer h3 { font-size: 9.5pt; margin: 0 0 6pt; color: var(--deep-cove); }
  .disclaimer p { margin: 0 0 6pt; font-size: 8.5pt; line-height: 1.45; }
  .disclaimer p:last-child { margin-bottom: 0; }

  .print-running-foot {
    position: fixed;
    bottom: 8mm;
    left: 14mm;
    right: 14mm;
    display: flex;
    justify-content: space-between;
    font-size: 7.5pt;
    color: var(--ink-3);
    font-family: var(--font-display);
    pointer-events: none;
    z-index: 1;
  }
  .print-cover .print-running-foot,
  .print-compliance .print-running-foot { display: none; }

  @page { size: A4 portrait; margin: 0; }
  @media print {
    .no-print { display: none !important; }
    body { background: #fff; }
    .print-page { margin: 0; width: auto; min-height: 0; }
    .print-cover, .print-compliance { width: auto; }
  }

  @media (max-width: 800px) {
    .print-page { width: 100%; min-height: 0; padding: 16px 14px 24px; }
    .card-grid, .featured-grid, .coll-grid, .cover-panels { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr; }
  }

  .toolbar {
    position: sticky; top: 0; z-index: 20;
    background: var(--paper-2);
    border-bottom: 1px solid var(--border);
    padding: 12px 16px;
    display: flex; gap: 10px; flex-wrap: wrap;
    align-items: center;
  }
  .toolbar button {
    font-family: var(--font-display); font-weight: 600;
    padding: 9px 16px; border-radius: 999px; border: none; cursor: pointer;
    background: var(--vital); color: #fff;
  }
  .toolbar button.secondary { background: #fff; color: var(--deep-cove); border: 1px solid var(--border); }
  .toolbar p { margin: 0; font-size: 0.88rem; color: var(--ink-2); flex: 1 1 220px; line-height: 1.45; }
  .toolbar strong { color: var(--deep-cove); }
`;
  }

  window.renderPrintCatalogue = renderPrintCatalogue;
  window.cataloguePrintStyles = cataloguePrintStyles;
})();
