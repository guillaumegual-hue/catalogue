/* Coleebri - PDF / print export (matches interactive catalogue UI) */

(function () {
  const BRAND = {
    vital: '#00889a',
    deepCove: '#00525c',
    harbour: '#006d7b',
    trustline: '#33a0ae',
    breathe: '#cce7eb',
    calm: '#e6f3f5',
    paper: '#fafafa',
    paper2: '#ffffff',
    ink: '#1a1f23',
    muted: '#4a544f',
    ink3: '#8a8f8c',
    border: 'rgba(0,136,154,0.14)',
    hope: '#f5c518',
    heroImage:
      'https://health.coleebri.com/wp-content/uploads/sites/12/2025/10/lab-313864_1920.jpg',
  };

  function formatPrice(t) {
    if (t.poa || t.price == null || t.price === undefined) return 'On request';
    if (t.priceUpper) return `£${t.price}-£${t.priceUpper}`;
    return `£${t.price}`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function printStyles() {
    return `
  :root {
    --vital: ${BRAND.vital};
    --deep-cove: ${BRAND.deepCove};
    --harbour: ${BRAND.harbour};
    --forest: ${BRAND.vital};
    --forest-deep: ${BRAND.deepCove};
    --forest-mid: ${BRAND.harbour};
    --forest-100: ${BRAND.calm};
    --forest-200: ${BRAND.breathe};
    --paper: ${BRAND.paper};
    --paper-2: ${BRAND.paper2};
    --ink: ${BRAND.ink};
    --muted: ${BRAND.muted};
    --ink-3: ${BRAND.ink3};
    --border: ${BRAND.border};
    --hope: ${BRAND.hope};
    --r-lg: 24px;
    --font-display: Poppins, system-ui, sans-serif;
    --font-body: "Work Sans", system-ui, sans-serif;
  }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: var(--font-body); font-size: 11pt; line-height: 1.5; color: var(--ink); background: var(--paper); }
  h1, h2, h3 { font-family: var(--font-display); font-weight: 600; margin: 0 0 8pt; line-height: 1.15; letter-spacing: -0.01em; }
  .page { max-width: 210mm; margin: 0 auto; padding: 14mm; }
  .cover {
    margin: -14mm -14mm 14mm;
    padding: 22mm 16mm 20mm;
    color: #fff;
    background-color: var(--forest-deep);
    background-image: linear-gradient(160deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.28) 50%, rgba(0,0,0,.45) 100%),
      url("${BRAND.heroImage}");
    background-size: cover;
    background-position: center;
    border-radius: 0 0 var(--r-lg) var(--r-lg);
  }
  .cover .logo { height: 11mm; width: auto; margin-bottom: 16mm; display: block; }
  .cover h1 { font-size: 28pt; max-width: 14ch; color: #fff; }
  .cover .sub { font-size: 12pt; max-width: 48ch; color: rgba(255,255,255,.88); margin-top: 10pt; }
  .cover-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; margin-top: 18pt; }
  .cover-panel {
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 12pt;
    padding: 12pt 14pt;
    background: rgba(255,255,255,.1);
  }
  .cover-panel .kicker {
    font-family: var(--font-display);
    font-size: 7pt;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(255,255,255,.7);
    display: block;
    margin-bottom: 4pt;
  }
  .cover-panel .big { font-family: var(--font-display); font-size: 18pt; font-weight: 600; display: block; }
  .cover-panel p { margin: 6pt 0 0; font-size: 9.5pt; color: rgba(255,255,255,.86); }
  .cover .meta { font-size: 9pt; color: rgba(255,255,255,.7); margin-top: 20pt; }
  .section-title {
    font-size: 18pt;
    color: var(--forest-deep);
    margin: 0 0 4pt;
    padding-bottom: 8pt;
    border-bottom: 2pt solid var(--forest-100);
  }
  .section-kicker {
    font-family: var(--font-display);
    font-size: 8pt;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-bottom: 6pt;
  }
  .card {
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    background: var(--paper-2);
    padding: 11pt 12pt;
    margin-bottom: 8pt;
    break-inside: avoid;
  }
  .card h3 { font-size: 12pt; color: var(--forest-deep); margin-bottom: 4pt; }
  .card .blurb { font-size: 10pt; color: var(--muted); margin-bottom: 8pt; }
  .chips { display: flex; flex-wrap: wrap; gap: 4pt; margin-bottom: 6pt; }
  .chip {
    font-size: 7pt;
    font-weight: 600;
    letter-spacing: .04em;
    text-transform: uppercase;
    padding: 3pt 7pt;
    border-radius: 999px;
    background: var(--forest-100);
    color: var(--forest-mid);
  }
  .chip.legal { background: var(--ink); color: #fff; }
  .chip.pop { background: var(--hope); color: #5a4602; }
  .chip.dna { background: #e5ecf7; color: #2a437c; }
  .chip.fingerprick { background: #f6efd6; color: #735b1c; }
  .chip.urine { background: #fff4cc; color: #6d5a08; }
  .code { font-size: 8pt; color: var(--ink-3); float: right; }
  .price { font-family: var(--font-display); font-weight: 700; font-size: 12pt; color: var(--forest); }
  .turn { font-size: 9pt; color: var(--ink-3); }
  .card-foot { display: flex; justify-content: space-between; align-items: baseline; margin-top: 8pt; padding-top: 8pt; border-top: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
  th, td { border: 1px solid var(--border); padding: 7pt 8pt; text-align: left; vertical-align: top; }
  th { background: var(--forest-100); font-family: var(--font-display); font-size: 9pt; color: var(--forest-deep); }
  .disclaimer { font-size: 8.5pt; color: var(--muted); border-left: 3pt solid var(--forest); padding-left: 10pt; margin-top: 16pt; }
  @page { size: A4; margin: 12mm; }
  @media print { .no-print { display: none !important; } }
  .toolbar { position: sticky; top: 0; background: var(--paper-2); border-bottom: 1px solid var(--border); padding: 10pt; display: flex; gap: 8pt; z-index: 10; }
  .toolbar button { font-family: var(--font-display); padding: 8pt 14pt; border-radius: 999px; border: none; cursor: pointer; background: var(--forest); color: #fff; font-weight: 600; }
  .toolbar button.secondary { background: #fff; color: var(--forest-deep); border: 1px solid var(--border); }
  @media (max-width: 520px) { .cover-panels { grid-template-columns: 1fr; } }
`;
  }

  function printHtml(title, bodyHtml, extraStyles) {
    const w = window.open('', '_blank');
    if (!w) {
      alert('Please allow pop-ups to export PDF, then use Print → Save as PDF.');
      return;
    }
    const styles = extraStyles || printStyles();
    w.document.write(`<!DOCTYPE html>
<html lang="en-GB"><head>
<meta charset="UTF-8"/>
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>${styles}</style>
</head><body>
<div class="toolbar no-print">
  <p><strong>Save as PDF:</strong> Print → destination <strong>Save as PDF</strong>. Set margins to <strong>None</strong> (or Minimum), scale <strong>100%</strong>, and enable <strong>Background graphics</strong> so brand colours print correctly.</p>
  <button type="button" onclick="window.print()">Print / Save as PDF</button>
  <button type="button" class="secondary" onclick="window.close()">Close</button>
</div>
${bodyHtml}
</body></html>`);
    w.document.close();
    w.focus();
  }

  function exportFull() {
    if (typeof window.renderPrintCatalogue === 'function' && window.TESTS) {
      printHtml(
        'Coleebri Health - Patient Catalogue 2026',
        window.renderPrintCatalogue(),
        window.cataloguePrintStyles ? window.cataloguePrintStyles() : printStyles()
      );
      return;
    }
    window.open('Coleebri Patient Catalogue-print.html', '_blank', 'noopener');
  }

  function exportCart(items) {
    if (!items || !items.length) {
      alert('Add at least one test to your list first.');
      return;
    }
    const rows = items
      .map(
        (t, i) => `<tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(t.name)}</strong><br/><span style="color:var(--muted);font-size:9pt">${escapeHtml(t.code)}</span></td>
      <td>${escapeHtml((t.blurb || '').slice(0, 180))}${(t.blurb || '').length > 180 ? '…' : ''}</td>
      <td class="price">${formatPrice(t)}</td>
      <td>${escapeHtml(t.turnaround || '')}</td>
    </tr>`
      )
      .join('');
    const subtotal = items.reduce((s, t) => (t.price != null && !t.poa ? s + Number(t.price) : s), 0);
    const kitFee = (window.ColeebriPricing && window.ColeebriPricing.KIT_DELIVERY_FEE) || 7;
    const kitTotal = items.length > 0 ? kitFee : 0;
    const body = `
<div class="page">
  <section class="cover">
    <img class="logo" src="https://health.coleebri.com/wp-content/uploads/sites/12/2025/02/Fichier-7@2x.png" alt="Coleebri Health"/>
    <h1>Your test enquiry list</h1>
    <p class="sub">Patient catalogue 2026 - laboratory fees only. Collection arranged separately. Not medical advice.</p>
    <div class="cover-panels">
      <div class="cover-panel"><span class="kicker">Catalogue</span><span class="big">+200 tests available</span></div>
      <div class="cover-panel"><span class="kicker">Need something else?</span><p>Can't find your test? Contact us at health@coleebri.com</p></div>
    </div>
    <div class="meta">Generated ${new Date().toLocaleDateString('en-GB')} · health@coleebri.com · health.coleebri.com</div>
  </section>
  <p class="section-kicker">Your selection</p>
  <h2 class="section-title">Tests on your list</h2>
  <table>
    <thead><tr><th>#</th><th>Test</th><th>Summary</th><th>Price</th><th>Turnaround</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p><strong>Indicative laboratory subtotal:</strong> £${subtotal} (excludes POA items)</p>
  <p><strong>Kit &amp; delivery (per order):</strong> £${kitTotal} (free for in-clinic appointments)</p>
  ${subtotal ? `<p><strong>Indicative total (lab + kit &amp; delivery):</strong> £${subtotal + kitTotal}</p>` : ''}
  <p>Mobile or clinic collection fees are additional.</p>
  <p class="disclaimer">${window.ColeebriCompliance ? window.ColeebriCompliance.getDisclaimer('general').paragraphs.join(' ') : 'We collect samples only; we do not diagnose or interpret results. Discuss results with your clinician.'}</p>
</div>`;
    printHtml('Coleebri Health - Enquiry list', body);
  }

  function exportCompare(tests) {
    if (!tests || tests.length < 2) {
      alert('Pin at least two tests to compare.');
      return;
    }
    const cols = tests
      .map(
        (t) => `<th>${escapeHtml(t.name)}<br/><span style="font-weight:400;font-size:9pt">${escapeHtml(t.code)}</span></th>`
      )
      .join('');
    const row = (label, fn) =>
      `<tr><td><strong>${label}</strong></td>${tests.map((t) => `<td>${fn(t)}</td>`).join('')}</tr>`;
    const body = `
<div class="page">
  <p class="section-kicker">Compare</p>
  <h2 class="section-title">Side-by-side summary</h2>
  <p style="color:var(--muted);margin-bottom:12pt">${window.ColeebriCompliance ? window.ColeebriCompliance.SERVICE_LEAD : 'We collect samples; we do not diagnose or treat.'}</p>
  <table>
    <thead><tr><th></th>${cols}</tr></thead>
    <tbody>
      ${row('Price', (t) => `<span class="price">${formatPrice(t)}</span>`)}
      ${row('Turnaround', (t) => escapeHtml(t.turnaround))}
      ${row('Sample', (t) => escapeHtml(t.samples.map((s) => window.SAMPLE_TYPES[s]?.short || s).join(' · ')))}
      ${row('Summary', (t) => escapeHtml(t.blurb))}
      ${row('Markers', (t) => escapeHtml(t.components.slice(0, 10).join(', ') + (t.components.length > 10 ? '…' : '')))}
    </tbody>
  </table>
  <p class="disclaimer">For booking: health@coleebri.com · health.coleebri.com</p>
</div>`;
    printHtml('Coleebri Health - Compare tests', body);
  }

  window.ColeebriPdf = { exportFull, exportCart, exportCompare };
})();
