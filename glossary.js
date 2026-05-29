/* Coleebri Health — biomarker glossary (plain English + UK guidance context) */

(function () {
  const GUIDANCE = window.ColeebriGlossaryGuidance.GUIDANCE;

  /** @type {{ slug: string, term: string, also?: string, plain: string }[]} */
  const BIOMARKER_GLOSSARY = [
    {
      slug: 'hba1c',
      term: 'HbA1c',
      also: 'glycated haemoglobin',
      plain:
        'Shows your average blood sugar level over roughly the last three months. Often used when checking for diabetes or how well diabetes is controlled.',
    },
    {
      slug: 'glucose',
      term: 'Glucose',
      plain: 'Blood sugar at the moment the sample was taken. One reading on its own can be affected by when you last ate.',
    },
    {
      slug: 'ldl-cholesterol',
      term: 'LDL cholesterol',
      also: '"bad" cholesterol',
      plain:
        'A type of fat in the blood that can build up in artery walls over time. Often discussed with heart and stroke risk.',
    },
    {
      slug: 'hdl-cholesterol',
      term: 'HDL cholesterol',
      also: '"good" cholesterol',
      plain: 'Helps carry cholesterol away from arteries. Usually higher is considered more protective for the heart.',
    },
    {
      slug: 'triglycerides',
      term: 'Triglycerides',
      plain: 'Another type of fat in the blood, linked to diet, weight, and heart risk.',
    },
    {
      slug: 'crp',
      term: 'CRP',
      also: 'C-reactive protein',
      plain:
        'A marker of inflammation in the body. It can rise with infection, injury, or some long-term conditions — it is not specific to one disease.',
    },
    {
      slug: 'egfr',
      term: 'eGFR',
      plain:
        'An estimate of how well your kidneys are filtering waste. It is calculated from creatinine and factors such as age and sex.',
    },
    {
      slug: 'creatinine-urea',
      term: 'Creatinine & urea',
      plain: 'Waste products in the blood that reflect kidney function and hydration.',
    },
    {
      slug: 'fbc',
      term: 'Full blood count (FBC)',
      plain:
        'Counts red cells (carry oxygen), white cells (fight infection), and platelets (help clotting). Used for tiredness, infections, and many other situations.',
    },
    {
      slug: 'ferritin',
      term: 'Ferritin',
      plain: 'Shows how much iron your body has stored. Low levels can suggest iron deficiency; high levels need clinical interpretation.',
    },
    {
      slug: 'tsh',
      term: 'TSH',
      plain:
        'A hormone from the brain that tells the thyroid gland to work. Often the first blood test when thyroid problems are suspected.',
    },
    {
      slug: 'free-t4',
      term: 'Free T4 (FT4)',
      plain: 'The main thyroid hormone circulating in the blood. Read together with TSH.',
    },
    {
      slug: 'vitamin-d',
      term: 'Vitamin D',
      plain: 'Important for bone health and other body functions. Levels vary with sunlight exposure, diet, and supplements.',
    },
    {
      slug: 'vitamin-b12-folate',
      term: 'Vitamin B12 & folate',
      plain: 'Vitamins needed for healthy blood cells and nerves. Low levels can cause anaemia and tiredness.',
    },
    {
      slug: 'liver-enzymes',
      term: 'Liver enzymes (ALT, AST, GGT)',
      plain:
        'Proteins released when liver cells are stressed or damaged — for example by alcohol, medicines, or fatty liver.',
    },
    {
      slug: 'bilirubin',
      term: 'Bilirubin',
      plain: 'A substance from broken-down red cells. High levels can cause jaundice (yellowing of skin or eyes).',
    },
    {
      slug: 'psa',
      term: 'PSA',
      plain:
        'Prostate-specific antigen — a protein that can rise with prostate enlargement, infection, or cancer. Results need careful discussion with a clinician.',
    },
    {
      slug: 'ige',
      term: 'IgE',
      plain:
        'An antibody linked to allergic reactions. A positive test to a food or pollen does not always mean you will have symptoms.',
    },
    {
      slug: 'ttg-iga',
      term: 'tTG-IgA',
      plain:
        'A blood test often used when coeliac disease (gluten-related gut condition) is suspected. Should be done before you stop eating gluten unless your clinician advises otherwise.',
    },
    {
      slug: 'ca125',
      term: 'CA125',
      plain:
        'A protein that can be higher in some ovarian conditions. It can also rise for non-cancer reasons, so it is not a standalone cancer test.',
    },
    {
      slug: 'testosterone',
      term: 'Testosterone',
      plain: 'The main male sex hormone (also present at lower levels in women). Levels vary by time of day and age.',
    },
    {
      slug: 'amh',
      term: 'AMH',
      plain:
        'Anti-Müllerian hormone — used as an indicator of ovarian reserve (egg supply). It does not predict whether you can become pregnant naturally.',
    },
    {
      slug: 'd-dimer',
      term: 'D-dimer',
      plain:
        'A marker linked to blood clot breakdown. It can be raised in clots but also in pregnancy, surgery, or infection — interpretation needs a clinician.',
    },
    {
      slug: 'urine-culture',
      term: 'Urine culture',
      plain:
        'Grows bacteria from a urine sample to identify infection and which antibiotics may work. More detailed than a dipstick alone.',
    },
    {
      slug: 'pcr-sti',
      term: 'PCR (STI tests)',
      plain:
        'A laboratory method that looks for genetic material from infections such as chlamydia or gonorrhoea.',
    },
  ];

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getEntry(slug) {
    const base = BIOMARKER_GLOSSARY.find(function (e) {
      return e.slug === slug;
    });
    if (!base) return null;
    const raw = GUIDANCE[slug] || null;
    const guidance = window.ColeebriGlossaryGuidance.normalizeGuidance(raw);
    return Object.assign({}, base, { guidance: guidance });
  }

  function getEntries() {
    return BIOMARKER_GLOSSARY.map(function (e) {
      return getEntry(e.slug);
    });
  }

  function renderLevelsHtml(g) {
    if (!g || !g.levels || !g.levels.length) return '';
    const rows = g.levels
      .map(function (l) {
        const band = l.band || 'neutral';
        const badge = escapeHtml(l.bandShortLabel || 'Note');
        return (
          '<dt class="level-band-dt level-band-dt--' +
          escapeHtml(band) +
          '"><span class="level-band-badge level-band-badge--' +
          escapeHtml(band) +
          '">' +
          badge +
          '</span> ' +
          escapeHtml(l.range) +
          '</dt><dd class="level-band-dd level-band-dd--' +
          escapeHtml(band) +
          '">' +
          escapeHtml(l.meaning) +
          '</dd>'
        );
      })
      .join('');
    return (
      '<div class="glossary-levels">' +
      '<h4 class="glossary-levels__title">How UK guidance often interprets levels</h4>' +
      '<dl class="glossary-levels__list">' +
      rows +
      '</dl></div>'
    );
  }

  function renderLinkList(links) {
    return links
      .map(function (s) {
        return (
          '<li><a href="' +
          escapeHtml(s.url) +
          '" rel="noopener noreferrer">' +
          escapeHtml(s.label) +
          '</a></li>'
        );
      })
      .join('');
  }

  function renderSourcesHtml(g) {
    if (!g) return '';
    const nice = g.nice || [];
    const nhs = g.nhs || [];
    if (!nice.length && !nhs.length) return '';
    let html = '';
    if (nice.length) {
      html +=
        '<div class="glossary-sources glossary-sources--nice">' +
        '<h4 class="glossary-sources__title">National guidance (NICE)</h4>' +
        '<ul class="glossary-sources__list">' +
        renderLinkList(nice) +
        '</ul></div>';
    }
    if (nhs.length) {
      html +=
        '<div class="glossary-sources glossary-sources--nhs">' +
        '<h4 class="glossary-sources__title">More information (NHS.uk)</h4>' +
        '<ul class="glossary-sources__list">' +
        renderLinkList(nhs) +
        '</ul></div>';
    }
    return html;
  }

  function renderEntryHtml(entry, opts) {
    opts = opts || {};
    const label = entry.also ? entry.term + ' (' + entry.also + ')' : entry.term;
    const g = entry.guidance;
    const body =
      '<p class="glossary-plain">' +
      escapeHtml(entry.plain) +
      '</p>' +
      renderSourcesHtml(g);

    if (opts.forPrint) {
      return (
        '<div class="glossary-item glossary-item--print">' +
        '<h4 class="glossary-item__term">' +
        escapeHtml(label) +
        '</h4>' +
        body +
        '</div>'
      );
    }
    return (
      '<details class="glossary-item" data-slug="' +
      escapeHtml(entry.slug) +
      '"><summary>' +
      escapeHtml(label) +
      '</summary>' +
      body +
      '</details>'
    );
  }

  function glossaryHtml(opts) {
    opts = opts || {};
    const items = getEntries()
      .map(function (e) {
        return renderEntryHtml(e, opts);
      })
      .join('');
    const intro = opts.forPrint
      ? 'Plain-language explanations written by Coleebri Health, with links to NHS.uk and NICE for further reading. We do not reproduce official guidance text. Not medical advice.'
      : 'Plain-language explanations written by Coleebri Health, with links to NHS.uk and NICE for further reading. We do not reproduce official guidance text. Not medical advice.';
    return (
      '<div class="biomarker-glossary">' +
      '<h3 class="biomarker-glossary__title">Biomarker glossary</h3>' +
      '<p class="biomarker-glossary__intro">' +
      escapeHtml(intro) +
      '</p>' +
      '<div class="glossary-list">' +
      items +
      '</div></div>'
    );
  }

  window.ColeebriGlossary = {
    BIOMARKER_GLOSSARY: BIOMARKER_GLOSSARY,
    getEntry: getEntry,
    getEntries: getEntries,
    glossaryHtml: glossaryHtml,
    renderEntryHtml: renderEntryHtml,
  };
})();
