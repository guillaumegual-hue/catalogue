/* Coleebri Health — UK-facing disclaimers & regulatory copy (single source of truth) */

(function () {
  const URGENT =
    'If you feel unwell, have symptoms that concern you, or need urgent health advice — do not wait for a test result. Call NHS 111, or 999 in an emergency.';

  const SERVICE_DEFINITION =
    'Coleebri Health is a private sample-collection service. We arrange the collection of your blood, urine, or DNA sample, deliver it to an accredited diagnostic laboratory, and return your result to you — nothing more and nothing less.';

  const SERVICE_INTRO = [
    'Coleebri Health connects you to precise, accredited diagnostic testing without a GP referral. Our role is straightforward: we arrange the collection of your sample — through a clinic, a mobile phlebotomist, or a home kit — and send it to one of our partner laboratories for analysis. Your result arrives as a laboratory report, typically within two to five working days of your sample being received.',
    'We are not a GP practice, a clinical service, or a substitute for medical care. We do not diagnose conditions, interpret what your results mean for your personal health, or recommend treatment. Those decisions belong with you and your GP or registered healthcare professional. What we do is give you a clear, reliable laboratory value — so that conversation is better informed.',
  ];

  const SERVICE_DESCRIPTION = SERVICE_DEFINITION;

  const SERVICE_LEAD = SERVICE_INTRO.join('\n\n');

  const SHORT_SERVICE_NOTE =
    'Coleebri Health collects your sample and returns a laboratory result. We do not diagnose conditions or interpret results. Please discuss your report with your GP or a registered healthcare professional.';

  const DISCLAIMERS = {
    general: {
      title: 'Before you choose a test',
      paragraphs: [
        'Coleebri Health is a sample-collection service. We arrange collection of your sample and send it to an accredited laboratory partner for analysis. We do not have clinical staff, we do not review your results, and we do not provide medical opinions.',
        'Your result is returned to you as a laboratory value. A result inside the reference range does not guarantee the absence of any condition. A result outside the range does not mean you are ill. You should discuss your report with your GP or a registered healthcare professional who knows your history.',
        URGENT,
      ],
    },
    sexual: {
      title: 'Sexual health testing — what you need to know',
      paragraphs: [
        'The timing of an STI test matters. Testing too soon after possible exposure can produce a false-negative result — the infection is present but not yet detectable. Each test card shows the recommended window period. If you have symptoms now, contact your GP or a local sexual health clinic rather than waiting for a postal test; you may need a physical examination.',
        'We collect and process samples only. We do not provide diagnosis, treatment, or partner notification. If a result requires follow-up care, your GP or a sexual health clinic is the right next step.',
        'If you feel very unwell or have symptoms that concern you, call NHS 111. In an emergency, call 999.',
      ],
    },
    allergy: {
      title: 'Allergy and sensitivity testing',
      paragraphs: [
        'IgE antibody tests screen for immune responses associated with immediate allergic reactions. They are a clinically validated starting point, but allergy diagnosis also depends on your symptoms, history, and in some cases a supervised challenge. A positive result does not confirm a clinical allergy on its own; a negative result does not rule one out.',
        'IgG4 antibody panels measure food antibody levels that may indicate prior exposure. IgG4 is not a validated diagnostic marker for food intolerance. Do not remove foods from your diet based on an IgG4 result alone — discuss any result with a registered dietitian or your GP before making dietary changes.',
        'We collect samples and send them for laboratory analysis. We do not diagnose allergies, recommend elimination diets, or advise on treatment.',
      ],
    },
    dna: {
      title: 'DNA and paternity tests — which type is right for you?',
      paragraphs: [
        'Court-admissible tests (marked LEGAL) follow strict identity verification and chain-of-custody protocols required by UK courts, HMRC, and immigration services. Collection must be supervised and witnessed; home sampling is not permitted for these tests.',
        'Peace-of-mind tests can be collected at home and are for personal use only. The result has no legal standing and cannot be submitted to any court, tribunal, or government body.',
        'All DNA tests involving a child require the consent of the person with parental responsibility. A minor cannot self-refer for a DNA test through this service. If you are unsure which test type you need, contact us before ordering.',
      ],
    },
    paternity: {
      title: 'DNA and paternity tests — which type is right for you?',
      paragraphs: [
        'Court-admissible tests (marked LEGAL) follow strict identity verification and chain-of-custody protocols required by UK courts, HMRC, and immigration services. Collection must be supervised and witnessed; home sampling is not permitted for these tests.',
        'Peace-of-mind tests can be collected at home and are for personal use only. The result has no legal standing and cannot be submitted to any court, tribunal, or government body.',
        'All DNA tests involving a child require the consent of the person with parental responsibility. A minor cannot self-refer for a DNA test through this service. If you are unsure which test type you need, contact us before ordering.',
      ],
    },
    fitness: {
      title: 'Wellbeing and performance panels',
      paragraphs: [
        'These panels are designed for people in good general health who want data to support training, nutrition, or recovery planning. They are not a substitute for a medical assessment if you have symptoms, a diagnosed condition, or concerns about your health.',
        'If a result is outside the reference range, or if you have questions about what your result means, discuss it with your GP or a registered healthcare professional before adjusting your training, diet, or supplementation.',
      ],
    },
    specialist: {
      title: 'Specialist diagnostic panels',
      paragraphs: [
        'These panels are designed for patients who are already engaged with a clinician around a suspected complex or chronic condition. They are not a first-step diagnostic for someone who is newly unwell. If you do not yet have a clinical picture or a working diagnosis, we recommend ordering a broader health baseline first and discussing results with your GP before adding specialist markers.',
        'Results from specialist panels carry more interpretive complexity than routine blood tests. We strongly recommend discussing your report with a clinician who has experience in the relevant area. If you would like a referral to an independent specialist, contact our team at health@coleebri.com.',
        'These tests are processed by GLXG and Labor Susa in Germany. Results typically take two to four weeks from sample receipt. The sample must be shipped via the DHL Medical Express service provided in the test kit; other courier services cannot be used.',
      ],
    },
  };

  const PSA_TEST_NOTICE = {
    title: 'PSA testing — what you should know first',
    collapsible: true,
    paragraphs: [
      'There is no national PSA screening programme in the UK because the test has real limitations: a raised level can be caused by infection, an enlarged prostate, or recent exercise — not only cancer. A raised result does not confirm cancer; a normal result does not rule it out.',
      'We return your result as a laboratory value. If PSA is raised, you will need to discuss it with your GP or a registered healthcare professional, who can advise on whether further tests are needed — including whether a biopsy is appropriate. They can explain what that involves and what the risks are.',
      "Most men who have this test do so after a conversation with their GP or a registered healthcare professional. If you haven't had that conversation yet, it is worth doing before you book.",
    ],
    links: [
      { label: 'NHS — PSA test', url: 'https://www.nhs.uk/tests-and-treatments/psa-test/' },
      {
        label: 'Prostate Cancer UK — PSA blood test',
        url: 'https://prostatecanceruk.org/prostate-information-and-support/prostate-tests/psa-blood-test',
      },
    ],
  };

  const IGG_FOOD_PANEL_NOTICE = {
    title: 'IgG food antibody testing — what you should know first',
    collapsible: true,
    bullets: [
      'BSACI, the British Dietetic Association, and NICE do not recommend using IgG antibody tests to diagnose food intolerance.',
      'A positive IgG result does not confirm food intolerance and must not be used on its own to remove foods from your diet.',
      'IgG4 is not a validated diagnostic marker for food intolerance — discuss any result with a registered dietitian or your GP before making dietary changes.',
      'This panel measures IgG antibodies only; it is not the same as IgE allergy blood testing.',
    ],
    links: [
      {
        label: 'NICE guideline NG117 — food allergy',
        url: 'https://www.nice.org.uk/guidance/ng117',
      },
    ],
  };

  const TEST_NOTICES = {
    psa: PSA_TEST_NOTICE,
    iggFood: IGG_FOOD_PANEL_NOTICE,
    specialist: {
      title: 'Specialist diagnostic panels — please read',
      collapsible: true,
      paragraphs: DISCLAIMERS.specialist.paragraphs,
    },
  };

  const SECTION_HINTS = {
    sexual:
      'STI tests must be done at the right time; we collect samples only and do not provide diagnosis or treatment.',
    paternity: 'Legal and peace-of-mind DNA tests follow different rules — check which type you need before ordering.',
    allergies: 'Allergy blood tests are not reliable on their own; results should be discussed with a clinician.',
  };

  const ADVERTISING_NOTICE = {
    title: 'How to use this catalogue',
    bullets: [
      'Each test description tells you what the laboratory measures in plain language. It is not personal medical advice and does not tell you whether a test is right for your situation.',
      'A test being listed does not mean it is appropriate for you. If you are unsure, speak with your GP or a registered healthcare professional before booking.',
      'Prices shown on each test card are the laboratory fee only. Sample collection — whether by clinic, mobile phlebotomist, or home kit — is charged separately and shown clearly at the point of enquiry.',
      'We follow UK advertising rules for health-related claims (ASA/CAP Code). We describe what tests measure; we do not claim any test will diagnose, treat, cure, or predict any condition in you specifically.',
      'You have the right to cancel a booking within 14 days of purchase. See our cancellation policy for details.',
    ],
  };

  const LABORATORY_PARTNERS = [
    {
      id: 'inuvi',
      name: 'Inuvi',
      meta: 'United Kingdom · UKAS-accredited · ISO 15189',
      tags: 'Routine and advanced biomarker testing · Hormones · Nutrition · Metabolic health',
      body: 'Inuvi is a UK-based clinical laboratory handling the majority of Coleebri Health\'s routine and wellness-focused biomarker panels. Their analytical platform covers the full range of hormonal, nutritional, metabolic, and haematological markers that make up our general health, wellbeing, fertility, and thyroid panels. Samples collected through our clinic and mobile phlebotomy network are transported directly to Inuvi under cold-chain conditions, and results are returned to you as a clearly formatted laboratory report. Inuvi operates under UKAS accreditation to ISO 15189, the international standard for medical testing laboratories, which governs the accuracy, traceability, and quality of every result they produce.',
    },
    {
      id: 'nationwide',
      name: 'Nationwide Pathology',
      meta: 'United Kingdom — national network · UKAS-accredited · ISO 15189',
      tags: 'Clinical pathology · Haematology · Immunology · Sexual health',
      body: 'Nationwide Pathology provides the clinical pathology infrastructure behind our more complex multi-marker panels, including full blood count profiles, immunology panels, coeliac and autoimmune markers, and our sexual health screens. As a pathology network with UK-wide laboratory capacity, they offer the throughput and specialist analytical depth needed for panels requiring immunoassay, serology, or detailed cell counting. All testing is carried out to UKAS ISO 15189 standards. For sexual health and clinical panels where turnaround time matters, Nationwide Pathology\'s UK-based processing means most results are available within two to three working days of sample receipt.',
    },
    {
      id: 'glxg',
      name: 'GLXG — Global Lab eXpert Group',
      meta: 'UK distribution · Laboratory: Labor Susa, Ulm, Germany · German government-certified lab · INSTAND & RfB external quality schemes',
      tags: 'Specialist complex testing · Chronic infections · Lyme & tick-borne disease · Immune status · Stress biomarkers · Methylation',
      body: 'For our most specialist panels — those covering complex chronic infections, Lyme and tick-borne disease, stress biomarkers, advanced immune status, heavy metals, and methylation — Coleebri Health partners with GLXG, whose laboratory partner is Labor Susa in Ulm, Germany. Labor Susa is a privately owned laboratory that holds German government certification for public healthcare, an unusual distinction for a private facility that provides an additional layer of state-level quality oversight beyond standard accreditation. The laboratory participates in INSTAND and RfB external quality assessment schemes — independent proficiency-testing programmes that verify analytical accuracy across every investigation type. Testing at Labor Susa achieves 80–95% sensitivity and specificity across its panels, consistent with the high global standard for specialist diagnostics. Results from GLXG panels are returned as encrypted reports and typically take two to four weeks from sample receipt, reflecting the analytical complexity involved. GLXG manages UK kit distribution and the DHL Medical Express courier chain from your door to the German laboratory.',
    },
  ];

  const HOW_RESULTS = {
    title: 'How your results work',
    sections: [
      {
        heading: 'How your result reaches you',
        paragraphs: [
          'Once the laboratory has analysed your sample, your result is returned to you as a PDF report sent securely to the email address you provided at booking. You will receive an email notification when your report is ready. The report comes directly from the laboratory and shows your result against the reference range for each marker tested.',
          'We do not read, interpret, or summarise your report before it reaches you. The laboratory result is your result — unedited and in full.',
        ],
      },
      {
        heading: 'If a result is outside the reference range',
        paragraphs: [
          'An out-of-range result does not automatically mean something is wrong. Reference ranges are statistical guides based on healthy populations; a result slightly outside the range may be normal for you. Equally, a result within the range does not guarantee the absence of every possible condition.',
          'We recommend taking your report to your GP or a registered healthcare professional who can interpret the numbers alongside your symptoms, history, and other test results. If any result is significantly outside range and you are concerned, contact your GP promptly. If you feel unwell at any point, do not wait for a test result — call NHS 111, or 999 in an emergency.',
        ],
      },
      {
        heading: 'If there is a problem with your sample',
        paragraphs: [
          'Occasionally a sample cannot be processed — this is most commonly due to haemolysis (a breakdown of red blood cells during transport), insufficient sample volume, or a delay in transit. If this happens, we will contact you by email within 24 hours of the laboratory receiving your sample to arrange a repeat collection. Repeat collection for a rejected sample is provided at no additional laboratory charge; standard collection fees apply.',
        ],
      },
      {
        heading: 'GLXG partner panel results',
        paragraphs: [
          'For panels processed by GLXG and Labor Susa in Germany, results are typically available two to four weeks from the date the laboratory receives your sample. These panels involve more complex immunological and molecular analysis, which cannot be accelerated. Your encrypted PDF report is sent via the GLXG secure results portal to your registered email address. If you have questions about a GLXG result, our enquiry team can facilitate a connection with an independent specialist for contextual guidance — contact us at health@coleebri.com.',
        ],
      },
    ],
  };

  const COST_TRANSPARENCY = {
    title: 'What the price on each test card includes',
    intro:
      'The price shown on every test card is the laboratory analysis fee — the cost of processing your sample and producing your result. It does not include sample collection. Collection is charged separately and depends on how you choose to provide your sample.',
    collectionTitle: 'Collection options and fees',
    rows: [
      {
        method: 'Clinic appointment (venous draw)',
        fee: '£50',
        notes: 'Available at partner clinics. Suitable for all venous tests. Book via the enquiry form.',
      },
      {
        method: 'Mobile phlebotomy (home or office visit)',
        fee: '£55–£70',
        notes: 'A trained phlebotomist visits your chosen address. Price varies by location and availability.',
      },
      {
        method: 'Home finger-prick kit',
        fee: '£7',
        notes: 'Posted to your address. Suitable for finger-prick compatible tests only — check your test card. Return postage included.',
      },
      {
        method: 'GLXG home kit (international courier)',
        fee: '£73–£155',
        notes: 'For GLXG / Labor Susa panels. Includes DHL Medical Express return to Germany. Price reflects courier rates at time of booking.',
      },
    ],
    footnote:
      'All collection fees shown are current at time of publication. Mobile phlebotomy rates may vary by postcode. GLXG courier fees are subject to fuel surcharge adjustments.',
  };

  const CONSUMER_RIGHTS = {
    title: 'Terms & cancellation',
    sections: [
      {
        heading: 'Your right to cancel',
        paragraphs: [
          'If you book a test through Coleebri Health, you have the right to cancel within 14 calendar days of your booking without giving a reason, in line with the Consumer Contracts Regulations 2013.',
          'To cancel, email health@coleebri.com with your booking reference and the words "I wish to cancel my booking." We will confirm cancellation by email and issue a full refund within 14 days.',
          'Exception: if you have already provided a sample that has been dispatched to the laboratory for processing, we are unable to refund the laboratory analysis fee, as the service will have been performed. The collection fee and any unprocessed kit costs will be refunded in full. We will always tell you clearly in your booking confirmation whether your sample has been dispatched.',
        ],
      },
      {
        heading: 'Age policy',
        paragraphs: [
          'Coleebri Health tests are available to adults aged 18 and over. Requests for testing involving individuals under 18 require the written consent of the person with parental responsibility and must be submitted through our team directly — they cannot be completed via the standard online booking flow. For paternity and DNA tests involving a minor, additional identity verification is required. Contact us before ordering if this applies to your situation.',
        ],
      },
      {
        heading: 'Complaints',
        paragraphs: [
          'If you are unhappy with any aspect of our service, email health@coleebri.com with your booking reference and a description of your concern. We aim to acknowledge all complaints within 2 working days and to provide a full response within 10 working days. If we are unable to resolve your complaint to your satisfaction, you may refer the matter to your local Trading Standards authority or seek independent dispute resolution through a certified ADR (Alternative Dispute Resolution) provider.',
        ],
      },
    ],
  };

  const LEGAL_DISCLAIMER = {
    title: 'Legal information',
    sections: [
      {
        heading: 'About Coleebri Health',
        paragraphs: [
          'Coleebri Health is a private sample-collection and diagnostic access service operated by Coleebri Groupe. Our role is to arrange the collection of biological samples from patients, co-ordinate their transportation to accredited laboratory partners, and return laboratory results to the patient. We are not a medical practice, a regulated health service, or a provider of clinical care.',
        ],
      },
      {
        heading: 'What we do not do',
        paragraphs: [
          'Coleebri Health does not diagnose medical conditions, prescribe treatment, interpret test results for clinical purposes, or provide any form of medical or nursing advice. Test descriptions in this catalogue explain what laboratory markers measure in general terms — they are not personal medical advice and are not tailored to your individual circumstances. Any guidance we provide on test selection is informational only and does not constitute a clinical recommendation. Only a registered doctor, nurse, or other qualified healthcare professional who knows your full medical history is able to provide clinical advice.',
        ],
      },
      {
        heading: 'Laboratory partners',
        paragraphs: [
          'Analytical testing is performed by our accredited laboratory partners: Inuvi (UK, UKAS-accredited), Nationwide Pathology (UK, UKAS-accredited), and Labor Susa, Ulm, Germany (government-certified, accessed via GLXG — Global Lab eXpert Group). The laboratory report you receive is produced entirely by the relevant laboratory and reflects their analytical processes and reference ranges. Coleebri Health does not modify, summarise, or interpret laboratory reports before delivery.',
        ],
      },
      {
        heading: 'Limitations of testing',
        paragraphs: [
          'No diagnostic test is 100% accurate. A result within the reference range does not exclude every possible condition, and a result outside the range does not confirm illness. All results should be interpreted by a clinician alongside your symptoms, history, and other clinical information. Coleebri Health accepts no clinical liability for decisions made solely on the basis of a laboratory report received through this service.',
        ],
      },
      {
        heading: 'Your data',
        paragraphs: [
          'Health and test enquiry data is processed by Coleebri Groupe as special category data under UK GDPR. We process this data on the basis of your explicit consent, given at the point of booking. Your data is shared with the relevant laboratory partner solely for the purpose of sample analysis. Full details of how we collect, store, and protect your data are set out in our Privacy Policy at coleebri.com/privacy.',
        ],
      },
      {
        heading: 'Emergency and urgent care',
        paragraphs: [
          'Coleebri Health is not an emergency or urgent care service. If you feel unwell, have symptoms that concern you, or believe you need immediate medical attention, do not rely on a pending test result. Call NHS 111 for urgent medical advice. In an emergency, call 999 or attend your nearest A&E department.',
        ],
      },
      {
        heading: 'Regulatory compliance',
        paragraphs: [
          'Health-related claims in this catalogue are written to comply with the UK ASA/CAP Code for advertising and marketing communications. We describe what laboratory markers measure; we do not claim any test will diagnose, treat, cure, monitor, or screen for any specific condition in any individual patient.',
        ],
      },
    ],
  };

  const GLOSSARY_NOTICE = {
    title: 'About this glossary',
    paragraphs: [
      SERVICE_DEFINITION,
      'Text here is written by us in general language — it is not copied from NHS.uk, NICE, or other official sources.',
      'Links may take you to NHS or NICE pages for your own reading. We do not reproduce their articles, definitions, or clinical guidance on this site.',
      'We do not interpret your results or tell you what they mean for your health. Only a registered clinician can provide diagnosis or treatment advice.',
      'Reference ranges on your laboratory report always take precedence over any general information here.',
    ],
  };

  const CAP_HEALTH_CLAIMS =
    'Health-related claims in this catalogue are written to comply with the UK ASA/CAP Code for advertising and marketing communications. We describe what laboratory markers measure; we do not claim any test will diagnose, treat, cure, monitor, or screen for any specific condition in any individual patient.';

  function getDisclaimer(kind) {
    return DISCLAIMERS[kind] || DISCLAIMERS.general;
  }

  function sectionHint(secId) {
    return SECTION_HINTS[secId] || '';
  }

  function disclaimerHtml(kind) {
    const d = getDisclaimer(kind);
    const paras = d.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
    return `<aside class="disclaimer-block"><h3 class="disclaimer-block__title">${escapeHtml(d.title)}</h3>${paras}</aside>`;
  }

  function sectionDisclaimerHtml(secId) {
    if (secId === 'sexual') return disclaimerHtml('sexual');
    if (secId === 'paternity') return disclaimerHtml('paternity');
    if (secId === 'allergies') return disclaimerHtml('allergy');
    return '';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function glossaryNoticeHtml() {
    const g = GLOSSARY_NOTICE;
    const paras = g.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
    return `<aside class="glossary-compliance-note disclaimer-block"><h3 class="disclaimer-block__title">${escapeHtml(g.title)}</h3>${paras}</aside>`;
  }

  function getTestNotice(key) {
    return TEST_NOTICES[key] || null;
  }

  function testNoticeHtml(key) {
    const n = getTestNotice(key);
    if (!n) return '';
    const body = n.paragraphs
      ? n.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
      : (n.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join('');
    const bodyHtml = n.paragraphs
      ? body
      : `<ul class="test-compliance-notice__list">${body}</ul>`;
    const links = (n.links || [])
      .map(
        (l) =>
          `<a href="${escapeHtml(l.url)}" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
      )
      .join(' · ');
    const linkBlock = links ? `<p class="test-compliance-notice__links">${links}</p>` : '';
    const panel = `${bodyHtml}${linkBlock}`;
    if (n.collapsible) {
      return `<details class="test-compliance-notice test-compliance-notice--disclosure" role="note"><summary class="test-compliance-notice__summary"><span class="test-compliance-notice__summary-text">${escapeHtml(n.title)}</span></summary><div class="test-compliance-notice__panel">${panel}</div></details>`;
    }
    return `<aside class="test-compliance-notice" role="note"><h4 class="test-compliance-notice__title">${escapeHtml(n.title)}</h4>${panel}</aside>`;
  }

  window.ColeebriCompliance = {
    URGENT,
    SERVICE_DEFINITION,
    SERVICE_INTRO,
    SERVICE_DESCRIPTION,
    SERVICE_LEAD,
    ADVERTISING_NOTICE,
    GLOSSARY_NOTICE,
    CAP_HEALTH_CLAIMS,
    SHORT_SERVICE_NOTE,
    SECTION_HINTS,
    LABORATORY_PARTNERS,
    HOW_RESULTS,
    COST_TRANSPARENCY,
    CONSUMER_RIGHTS,
    LEGAL_DISCLAIMER,
    sectionHint,
    getDisclaimer,
    disclaimerHtml,
    glossaryNoticeHtml,
    sectionDisclaimerHtml,
    PSA_TEST_NOTICE,
    IGG_FOOD_PANEL_NOTICE,
    TEST_NOTICES,
    getTestNotice,
    testNoticeHtml,
    escapeHtml,
  };
})();
