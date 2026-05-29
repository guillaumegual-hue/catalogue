/* UK-oriented result context for glossary (education only — lab report ranges always take precedence) */

(function () {
  const RANGE_NOTE =
    'Your laboratory prints the reference interval on your report. It may differ between labs. General information here is not medical advice and is not copied from NHS or NICE publications.';

  const NHS_BLOOD_TESTS = {
    label: 'NHS — blood tests (overview)',
    url: 'https://www.nhs.uk/conditions/blood-tests/',
  };

  function nhsSearchLink(query) {
    return {
      label: 'Find more on NHS.uk',
      url: 'https://www.nhs.uk/search/?query=' + encodeURIComponent(query),
    };
  }

  /** Visual band for result-level rows: within | low | high | neutral */
  const LEVEL_BAND_META = {
    within: { label: 'Within range', shortLabel: 'In range' },
    low: { label: 'Below range / low', shortLabel: 'Low' },
    high: { label: 'Above range / high', shortLabel: 'High' },
    neutral: { label: 'For context', shortLabel: 'Note' },
  };

  function resolveLevelBand(row) {
    if (row.band && LEVEL_BAND_META[row.band]) return row.band;
    const range = String(row.range || '').toLowerCase();
    const meaning = String(row.meaning || '').toLowerCase();
    const text = range + ' ' + meaning;

    if (
      /no single|varies by|interpreted by|read with|used with|each have their own|uk screening|not specific to|before gluten|does not predict|targets depend/.test(
        text
      )
    ) {
      return 'neutral';
    }

    if (/not detected|no significant growth|negative \(within|makes .* less likely/.test(text)) {
      return 'within';
    }

    if (
      /within reference|within range|within the range|within laboratory|normal kidney|no diabetes|adequate for most|consistent with normal|desirable fasting|less evidence of generalised/.test(
        text
      )
    ) {
      return 'within';
    }

    if (/below 42 mmol|below about 6\.1|below about 1\.7|90 or above/.test(range)) {
      return 'within';
    }

    if (
      / or above|markedly raised|severe reduction|below 30|detected|positive \/ raised|raised ca125|raised bilirubin|raised crp|raised d-dimer|higher psa|needs prompt|requires medical review|may meet diabetes/.test(
        text
      )
    ) {
      return 'high';
    }

    if (
      /below laboratory|often considered deficient|may be described as insufficient|mild reduction|moderate reduction|moderate to severe|42–47|6\.1–6\.9|30–44|45–59|60–89|impaired|borderline|low in men/.test(
        text
      )
    ) {
      return 'low';
    }

    if (/higher levels|raised/.test(text)) return 'high';
    if (/lower limit|low /.test(text)) return 'low';

    return 'neutral';
  }

  function enrichLevels(levels) {
    return (levels || []).map(function (row) {
      const band = resolveLevelBand(row);
      const meta = LEVEL_BAND_META[band];
      return Object.assign({}, row, {
        band: band,
        bandLabel: meta.label,
        bandShortLabel: meta.shortLabel,
      });
    });
  }

  /** @type {Record<string, object>} */
  const GUIDANCE = {
    hba1c: {
      levels: [
        { range: 'Below 42 mmol/mol (about 6.0%)', meaning: 'Usually reported as within the range used for “no diabetes” in the UK.' },
        { range: '42–47 mmol/mol', meaning: 'Sometimes called “increased risk” — lifestyle advice may be discussed.' },
        { range: '48 mmol/mol or above', meaning: 'Meets the UK blood test threshold used to diagnose diabetes (confirmation by a clinician is still required).' },
      ],
      nice: [{ label: 'NICE guideline NG28 — diabetes', url: 'https://www.nice.org.uk/guidance/ng28' }],
      nhs: [
        { label: 'NHS — diabetes', url: 'https://www.nhs.uk/conditions/diabetes/' },
        { label: 'NHS — type 2 diabetes', url: 'https://www.nhs.uk/conditions/type-2-diabetes/' },
        { label: 'NHS — prediabetes', url: 'https://www.nhs.uk/conditions/prediabetes/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'type 2 diabetes hba1c',
      nhsSearch: 'hba1c blood test',
    },
    glucose: {
      levels: [
        { range: 'Fasting sample below about 6.1 mmol/L', meaning: 'Often considered within the usual non-diabetes fasting range (lab ranges vary).' },
        { range: 'Fasting 6.1–6.9 mmol/L', meaning: 'May be described as impaired fasting glucose — needs clinical context.' },
        { range: 'Fasting 7.0 mmol/L or above', meaning: 'May meet diabetes criteria if confirmed on a separate occasion.' },
      ],
      nice: [{ label: 'NICE guideline NG28 — diabetes', url: 'https://www.nice.org.uk/guidance/ng28' }],
      nhs: [
        { label: 'NHS — diabetes', url: 'https://www.nhs.uk/conditions/diabetes/' },
        { label: 'NHS — hyperglycaemia (high blood sugar)', url: 'https://www.nhs.uk/conditions/hyperglycaemia/' },
        { label: 'NHS — hypoglycaemia (low blood sugar)', url: 'https://www.nhs.uk/conditions/low-blood-sugar-hypoglycaemia/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'diabetes diagnosis fasting glucose',
      nhsSearch: 'blood sugar test',
    },
    'ldl-cholesterol': {
      levels: [
        { range: 'No single UK “normal” number for everyone', meaning: 'Targets depend on your overall heart risk, age, and other conditions.' },
        { range: 'Often discussed with total cholesterol and HDL', meaning: 'A full lipid profile is interpreted together, not one number alone.' },
      ],
      nice: [{ label: 'NICE guideline NG238 — cardiovascular disease', url: 'https://www.nice.org.uk/guidance/ng238' }],
      nhs: [
        { label: 'NHS — high cholesterol', url: 'https://www.nhs.uk/conditions/high-cholesterol/' },
        { label: 'NHS — coronary heart disease', url: 'https://www.nhs.uk/conditions/coronary-heart-disease/' },
        { label: 'NHS — statins', url: 'https://www.nhs.uk/medicines/statins/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'lipid modification cardiovascular',
      nhsSearch: 'cholesterol blood test',
    },
    'hdl-cholesterol': {
      levels: [
        { range: 'Varies by sex and laboratory', meaning: 'Generally, higher HDL is thought to be more favourable for heart health.' },
        { range: 'Read with LDL and triglycerides', meaning: 'Clinicians look at the whole lipid picture and your risk factors.' },
      ],
      nice: [{ label: 'NICE guideline NG238 — cardiovascular disease', url: 'https://www.nice.org.uk/guidance/ng238' }],
      nhs: [
        { label: 'NHS — high cholesterol', url: 'https://www.nhs.uk/conditions/high-cholesterol/' },
        { label: 'NHS — how to lower your cholesterol', url: 'https://www.nhs.uk/conditions/high-cholesterol/how-to-lower-your-cholesterol/' },
        { label: 'NHS — heart disease', url: 'https://www.nhs.uk/conditions/coronary-heart-disease/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'lipid profile cardiovascular risk',
      nhsSearch: 'hdl cholesterol',
    },
    triglycerides: {
      levels: [
        { range: 'Below about 1.7 mmol/L (fasting)', meaning: 'Often quoted as a general desirable fasting level in UK guidance (lab ranges vary).' },
        { range: 'Higher levels', meaning: 'May relate to diet, alcohol, weight, diabetes control, or other conditions.' },
      ],
      nice: [{ label: 'NICE guideline NG238 — cardiovascular disease', url: 'https://www.nice.org.uk/guidance/ng238' }],
      nhs: [
        { label: 'NHS — high cholesterol', url: 'https://www.nhs.uk/conditions/high-cholesterol/' },
        { label: 'NHS — type 2 diabetes', url: 'https://www.nhs.uk/conditions/type-2-diabetes/' },
        { label: 'NHS — alcohol misuse', url: 'https://www.nhs.uk/conditions/alcohol-misuse/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'hypertriglyceridaemia cardiovascular',
      nhsSearch: 'triglycerides blood test',
    },
    crp: {
      levels: [
        { range: 'Low or normal hs-CRP', meaning: 'Less evidence of generalised inflammation at the time of the test.' },
        { range: 'Raised CRP', meaning: 'Can occur with infection, injury, surgery, or inflammatory conditions — not specific to one cause.' },
      ],
      nice: [],
      nhs: [
        NHS_BLOOD_TESTS,
        { label: 'NHS — rheumatoid arthritis', url: 'https://www.nhs.uk/conditions/rheumatoid-arthritis/' },
        { label: 'NHS — sepsis', url: 'https://www.nhs.uk/conditions/sepsis/' },
        { label: 'NHS — inflammation and joint pain', url: 'https://www.nhs.uk/conditions/joint-pain/' },
      ],
      niceQuery: 'C reactive protein',
      nhsSearch: 'crp blood test',
    },
    egfr: {
      levels: [
        { range: '90 or above', meaning: 'Usually described as normal kidney function (if no other concerns).' },
        { range: '60–89', meaning: 'Mild reduction — meaning depends on trend, age, and other results.' },
        { range: '45–59', meaning: 'Moderate reduction — often monitored over time.' },
        { range: '30–44', meaning: 'Moderate to severe reduction — needs clinical follow-up.' },
        { range: 'Below 30', meaning: 'Severe reduction — requires medical review.' },
      ],
      nice: [{ label: 'NICE guideline NG203 — chronic kidney disease', url: 'https://www.nice.org.uk/guidance/ng203' }],
      nhs: [
        { label: 'NHS — kidney disease', url: 'https://www.nhs.uk/conditions/kidney-disease/' },
        { label: 'NHS — chronic kidney disease stages', url: 'https://www.nhs.uk/conditions/kidney-disease/symptoms/' },
        { label: 'NHS — high blood pressure', url: 'https://www.nhs.uk/conditions/high-blood-pressure-hypertension/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'chronic kidney disease egfr',
      nhsSearch: 'egfr kidney test',
    },
    'creatinine-urea': {
      levels: [
        { range: 'Compared with your laboratory reference range', meaning: 'Creatinine and urea rise when kidneys filter less well, but also with dehydration or muscle mass.' },
        { range: 'Used with eGFR', meaning: 'Usually interpreted together rather than on a single number alone.' },
      ],
      nice: [{ label: 'NICE guideline NG203 — chronic kidney disease', url: 'https://www.nice.org.uk/guidance/ng203' }],
      nhs: [
        { label: 'NHS — kidney disease', url: 'https://www.nhs.uk/conditions/kidney-disease/' },
        { label: 'NHS — dehydration', url: 'https://www.nhs.uk/conditions/dehydration/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'renal function creatinine',
      nhsSearch: 'kidney blood test creatinine',
    },
    fbc: {
      levels: [
        { range: 'Haemoglobin, white cells, platelets each have their own range', meaning: 'Low haemoglobin may suggest anaemia; high or low white cells may suggest infection or other conditions.' },
        { range: 'Interpreted in context', meaning: 'One abnormal line on a full blood count needs a clinician to explain the cause.' },
      ],
      nice: [],
      nhs: [
        NHS_BLOOD_TESTS,
        { label: 'NHS — iron deficiency anaemia', url: 'https://www.nhs.uk/conditions/iron-deficiency-anaemia/' },
        { label: 'NHS — leukaemia', url: 'https://www.nhs.uk/conditions/leukaemia/' },
        { label: 'NHS — sepsis', url: 'https://www.nhs.uk/conditions/sepsis/' },
      ],
      niceQuery: 'anaemia full blood count',
      nhsSearch: 'full blood count',
    },
    ferritin: {
      levels: [
        { range: 'Below laboratory lower limit (often roughly under 15–30 µg/L for adults, varies)', meaning: 'May suggest low iron stores; causes include diet, blood loss, or absorption problems.' },
        { range: 'Above the upper limit', meaning: 'Can occur with inflammation, liver conditions, or iron overload — needs clinical interpretation.' },
      ],
      nice: [{ label: 'NICE guideline NG12 — suspected cancer', url: 'https://www.nice.org.uk/guidance/ng12' }],
      nhs: [
        { label: 'NHS — iron deficiency anaemia', url: 'https://www.nhs.uk/conditions/iron-deficiency-anaemia/' },
        { label: 'NHS — heavy periods', url: 'https://www.nhs.uk/conditions/heavy-periods/' },
        { label: 'NHS — haemochromatosis (iron overload)', url: 'https://www.nhs.uk/conditions/haemochromatosis/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'iron deficiency ferritin',
      nhsSearch: 'ferritin blood test',
    },
    tsh: {
      levels: [
        { range: 'Within laboratory reference range (often about 0.4–4.0 mU/L)', meaning: 'Usually consistent with normal thyroid signalling.' },
        { range: 'High TSH with low FT4', meaning: 'Pattern often seen in an underactive thyroid (hypothyroidism).' },
        { range: 'Low TSH with high FT4', meaning: 'Pattern often seen in an overactive thyroid (hyperthyroidism).' },
      ],
      nice: [{ label: 'NICE guideline NG145 — thyroid disease', url: 'https://www.nice.org.uk/guidance/ng145' }],
      nhs: [
        { label: 'NHS — underactive thyroid', url: 'https://www.nhs.uk/conditions/underactive-thyroid-hypothyroidism/' },
        { label: 'NHS — overactive thyroid', url: 'https://www.nhs.uk/conditions/overactive-thyroid-hyperthyroidism/' },
        { label: 'NHS — thyroid function tests', url: 'https://www.nhs.uk/tests-and-treatments/thyroid-function-tests/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'thyroid function tests',
      nhsSearch: 'thyroid blood test tsh',
    },
    'free-t4': {
      levels: [
        { range: 'Read with TSH', meaning: 'FT4 is the main thyroid hormone measured in blood; the pair is interpreted together.' },
        { range: 'Outside reference range', meaning: 'May suggest under- or overactive thyroid depending on TSH and symptoms.' },
      ],
      nice: [{ label: 'NICE guideline NG145 — thyroid disease', url: 'https://www.nice.org.uk/guidance/ng145' }],
      nhs: [
        { label: 'NHS — underactive thyroid', url: 'https://www.nhs.uk/conditions/underactive-thyroid-hypothyroidism/' },
        { label: 'NHS — overactive thyroid', url: 'https://www.nhs.uk/conditions/overactive-thyroid-hyperthyroidism/' },
        { label: 'NHS — thyroid function tests', url: 'https://www.nhs.uk/tests-and-treatments/thyroid-function-tests/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'thyroid function tests FT4',
      nhsSearch: 'thyroid hormone test',
    },
    'vitamin-d': {
      levels: [
        { range: 'Below about 25 nmol/L', meaning: 'Often considered deficient in UK guidance.' },
        { range: '25–50 nmol/L', meaning: 'May be described as insufficient for some people.' },
        { range: '50 nmol/L or above', meaning: 'Often considered adequate for most people (individual targets vary).' },
      ],
      nice: [
        {
          label: 'NICE — vitamin D deficiency',
          url: 'https://www.nice.org.uk/guidance/conditions-and-diseases/musculoskeletal-conditions/vitamin-d-deficiency',
        },
      ],
      nhs: [
        { label: 'NHS — vitamin D', url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-d/' },
        { label: 'NHS — osteoporosis', url: 'https://www.nhs.uk/conditions/osteoporosis/' },
        { label: 'NHS — rickets', url: 'https://www.nhs.uk/conditions/rickets-and-osteomalacia/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'vitamin D deficiency',
      nhsSearch: 'vitamin d blood test',
    },
    'vitamin-b12-folate': {
      levels: [
        { range: 'Below laboratory lower limit', meaning: 'May cause anaemia and tiredness; causes include diet, absorption problems, or medicines.' },
        { range: 'Borderline results', meaning: 'Sometimes monitored or treated depending on symptoms and clinical context.' },
      ],
      nice: [],
      nhs: [
        {
          label: 'NHS — vitamin B12 or folate deficiency anaemia',
          url: 'https://www.nhs.uk/conditions/vitamin-b12-or-folate-deficiency-anaemia/',
        },
        { label: 'NHS — pernicious anaemia', url: 'https://www.nhs.uk/conditions/pernicious-anaemia/' },
        { label: 'NHS — vegan and vegetarian diets', url: 'https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/the-vegan-diet/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'vitamin B12 deficiency',
      nhsSearch: 'vitamin b12 blood test',
    },
    'liver-enzymes': {
      levels: [
        { range: 'Within reference range', meaning: 'No strong signal of liver cell injury on this test.' },
        { range: 'Mildly raised', meaning: 'Common and non-specific — may relate to fatty liver, alcohol, medicines, or other causes.' },
        { range: 'Markedly raised', meaning: 'Needs prompt clinical review.' },
      ],
      nice: [{ label: 'NICE guideline NG49 — liver disease', url: 'https://www.nice.org.uk/guidance/ng49' }],
      nhs: [
        { label: 'NHS — liver disease', url: 'https://www.nhs.uk/conditions/liver-disease/' },
        { label: 'NHS — non-alcoholic fatty liver disease', url: 'https://www.nhs.uk/conditions/non-alcoholic-fatty-liver-disease-nafld/' },
        { label: 'NHS — alcohol-related liver disease', url: 'https://www.nhs.uk/conditions/alcohol-related-liver-disease-arld/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'abnormal liver function tests',
      nhsSearch: 'liver function blood test',
    },
    bilirubin: {
      levels: [
        { range: 'Within reference range', meaning: 'No significant jaundice signal on this test.' },
        { range: 'Raised bilirubin', meaning: 'May cause yellowing of skin or eyes; causes include liver disease, bile duct problems, or breakdown of red cells.' },
      ],
      nice: [{ label: 'NICE guideline NG49 — liver disease', url: 'https://www.nice.org.uk/guidance/ng49' }],
      nhs: [
        { label: 'NHS — jaundice', url: 'https://www.nhs.uk/conditions/jaundice/' },
        { label: 'NHS — liver disease', url: 'https://www.nhs.uk/conditions/liver-disease/' },
        { label: 'NHS — gallstones', url: 'https://www.nhs.uk/conditions/gallstones/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'jaundice bilirubin',
      nhsSearch: 'bilirubin blood test',
    },
    psa: {
      levels: [
        { range: 'No single “normal” PSA for all ages', meaning: 'PSA rises with age, prostate size, infection, and after some procedures.' },
        { range: 'Higher PSA', meaning: 'Does not always mean cancer — further assessment by a clinician is needed.' },
        { range: 'UK screening', meaning: 'There is no national PSA screening programme for all men; testing is usually discussed individually with a GP.' },
      ],
      nice: [],
      nhs: [
        { label: 'NHS — PSA test', url: 'https://www.nhs.uk/tests-and-treatments/psa-test/' },
        { label: 'NHS — prostate cancer', url: 'https://www.nhs.uk/conditions/prostate-cancer/' },
        { label: 'NHS — prostate enlargement', url: 'https://www.nhs.uk/conditions/prostate-enlargement/' },
        { label: 'NHS — prostate problems', url: 'https://www.nhs.uk/conditions/prostate-disease/' },
      ],
      niceQuery: 'prostate cancer psa',
      nhsSearch: 'psa test',
    },
    ige: {
      levels: [
        { range: 'Specific IgE to a trigger', meaning: 'A positive result shows sensitisation; it does not always mean you will react to that substance.' },
        { range: 'Total IgE', meaning: 'A raised total can occur with allergies, eczema, or parasitic infection — needs specialist interpretation.' },
      ],
      nice: [{ label: 'NICE guideline NG117 — food allergy', url: 'https://www.nice.org.uk/guidance/ng117' }],
      nhs: [
        { label: 'NHS — allergies', url: 'https://www.nhs.uk/conditions/allergies/' },
        { label: 'NHS — food allergy', url: 'https://www.nhs.uk/conditions/food-allergy/' },
        { label: 'NHS — hay fever', url: 'https://www.nhs.uk/conditions/hay-fever/' },
        { label: 'NHS — eczema', url: 'https://www.nhs.uk/conditions/atopic-eczema/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'allergy testing IgE',
      nhsSearch: 'allergy blood test ige',
    },
    'ttg-iga': {
      levels: [
        { range: 'Negative (within range)', meaning: 'Makes coeliac disease less likely when you are still eating gluten.' },
        { range: 'Positive / raised', meaning: 'May suggest coeliac disease — usually confirmed with further tests and clinical assessment.' },
        { range: 'Before gluten-free diet', meaning: 'Test is most reliable while gluten is still in the diet unless your clinician advises otherwise.' },
      ],
      nice: [{ label: 'NICE guideline NG20 — coeliac disease', url: 'https://www.nice.org.uk/guidance/ng20' }],
      nhs: [
        { label: 'NHS — coeliac disease', url: 'https://www.nhs.uk/conditions/coeliac-disease/' },
        { label: 'NHS — coeliac disease diagnosis', url: 'https://www.nhs.uk/conditions/coeliac-disease/diagnosis/' },
        { label: 'NHS — diarrhoea and vomiting', url: 'https://www.nhs.uk/conditions/diarrhoea-and-vomiting/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'coeliac disease serology',
      nhsSearch: 'coeliac blood test',
    },
    ca125: {
      levels: [
        { range: 'Within reference range', meaning: 'No strong signal from this marker alone.' },
        { range: 'Raised CA125', meaning: 'Can occur with ovarian conditions but also periods, endometriosis, pregnancy, and other benign causes.' },
      ],
      nice: [{ label: 'NICE guideline NG12 — suspected cancer', url: 'https://www.nice.org.uk/guidance/ng12' }],
      nhs: [
        { label: 'NHS — ovarian cancer', url: 'https://www.nhs.uk/conditions/ovarian-cancer/' },
        { label: 'NHS — endometriosis', url: 'https://www.nhs.uk/conditions/endometriosis/' },
        { label: 'NHS — polycystic ovary syndrome', url: 'https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/' },
        { label: 'NHS — ovarian cyst', url: 'https://www.nhs.uk/conditions/ovarian-cyst/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'ovarian cancer CA125',
      nhsSearch: 'ca125 blood test',
    },
    testosterone: {
      levels: [
        { range: 'Varies by age, sex, and time of day', meaning: 'Morning samples are often preferred for men when investigating low testosterone.' },
        { range: 'Low in men', meaning: 'May relate to symptoms such as low mood, low libido, or fatigue — needs clinical assessment.' },
        { range: 'In women', meaning: 'Interpreted differently and usually alongside other hormones.' },
      ],
      nice: [],
      nhs: [
        { label: 'NHS — testosterone (low levels in men)', url: 'https://www.nhs.uk/conditions/testosterone/' },
        { label: 'NHS — loss of libido', url: 'https://www.nhs.uk/conditions/loss-of-libido/' },
        { label: 'NHS — polycystic ovary syndrome', url: 'https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'testosterone deficiency',
      nhsSearch: 'testosterone blood test',
    },
    amh: {
      levels: [
        { range: 'Interpreted by fertility specialists', meaning: 'Reflects ovarian reserve (egg supply) but does not predict natural pregnancy on its own.' },
        { range: 'Varies with age', meaning: 'Levels generally fall as ovarian reserve declines.' },
      ],
      nice: [{ label: 'NICE guideline NG156 — fertility', url: 'https://www.nice.org.uk/guidance/ng156' }],
      nhs: [
        { label: 'NHS — infertility', url: 'https://www.nhs.uk/conditions/infertility/' },
        { label: 'NHS — IVF', url: 'https://www.nhs.uk/conditions/ivf/' },
        { label: 'NHS — menopause', url: 'https://www.nhs.uk/conditions/menopause/' },
        { label: 'NHS — polycystic ovary syndrome', url: 'https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/' },
      ],
      niceQuery: 'anti-mullerian hormone fertility',
      nhsSearch: 'amh fertility test',
    },
    'd-dimer': {
      levels: [
        { range: 'Negative / low', meaning: 'Makes a significant blood clot less likely in some emergency situations (depends on clinical context).' },
        { range: 'Raised', meaning: 'Not specific — can be raised in clots, infection, pregnancy, surgery, and other conditions.' },
      ],
      nice: [{ label: 'NICE guideline NG158 — venous thromboembolism', url: 'https://www.nice.org.uk/guidance/ng158' }],
      nhs: [
        { label: 'NHS — blood clots', url: 'https://www.nhs.uk/conditions/blood-clots/' },
        { label: 'NHS — deep vein thrombosis (DVT)', url: 'https://www.nhs.uk/conditions/deep-vein-thrombosis-dvt/' },
        { label: 'NHS — pulmonary embolism', url: 'https://www.nhs.uk/conditions/pulmonary-embolism/' },
        NHS_BLOOD_TESTS,
      ],
      niceQuery: 'd-dimer pulmonary embolism',
      nhsSearch: 'd dimer blood test',
    },
    'urine-culture': {
      levels: [
        { range: 'No significant growth', meaning: 'Usually no bacterial infection identified on culture.' },
        { range: 'Bacteria identified', meaning: 'Suggests urinary infection; antibiotic sensitivity may guide treatment if clinically indicated.' },
      ],
      nice: [{ label: 'NICE guideline NG109 — urinary tract infection', url: 'https://www.nice.org.uk/guidance/ng109' }],
      nhs: [
        { label: 'NHS — urinary tract infections (UTIs)', url: 'https://www.nhs.uk/conditions/urinary-tract-infections-utis/' },
        { label: 'NHS — kidney infection', url: 'https://www.nhs.uk/conditions/kidney-infection/' },
        { label: 'NHS — cystitis', url: 'https://www.nhs.uk/conditions/cystitis/' },
        { label: 'NHS — urine tests', url: 'https://www.nhs.uk/tests-and-treatments/urine-tests/' },
      ],
      niceQuery: 'urinary tract infection',
      nhsSearch: 'urine infection test',
    },
    'pcr-sti': {
      levels: [
        { range: 'Not detected', meaning: 'No genetic material from that infection found in the sample (depends which infections were tested).' },
        { range: 'Detected', meaning: 'Suggests infection is present — treatment and partner follow-up should be discussed with a clinician.' },
      ],
      nice: [{ label: 'NICE guideline NG199 — sexually transmitted infections', url: 'https://www.nice.org.uk/guidance/ng199' }],
      nhs: [
        { label: 'NHS — sexually transmitted infections (STIs)', url: 'https://www.nhs.uk/common-health-questions/sexual-health/what-are-stis/' },
        { label: 'NHS — should I have an STI test?', url: 'https://www.nhs.uk/common-health-questions/sexual-health/should-i-have-an-sti-test/' },
        { label: 'NHS — chlamydia', url: 'https://www.nhs.uk/conditions/chlamydia/' },
        { label: 'NHS — gonorrhoea', url: 'https://www.nhs.uk/conditions/gonorrhoea/' },
        { label: 'NHS — find sexual health services', url: 'https://www.nhs.uk/service-search/sexual-health/find-a-sexual-health-clinic' },
      ],
      niceQuery: 'sexually transmitted infections',
      nhsSearch: 'sti test',
    },
  };

  function normalizeGuidance(raw) {
    if (!raw) return null;
    const nice = (raw.nice || []).slice();
    const nhs = (raw.nhs || []).slice();
    if (raw.nhsSearch) {
      const search = nhsSearchLink(raw.nhsSearch);
      if (!nhs.some(function (l) {
        return l.url === search.url;
      })) {
        nhs.push(search);
      }
    }
    return {
      levels: [],
      nice: nice,
      nhs: nhs,
      niceQuery: raw.niceQuery,
      nhsSearch: raw.nhsSearch,
      sources: nice.concat(nhs),
    };
  }

  window.ColeebriGlossaryGuidance = {
    GUIDANCE: GUIDANCE,
    RANGE_NOTE: RANGE_NOTE,
    LEVEL_BAND_META: LEVEL_BAND_META,
    normalizeGuidance: normalizeGuidance,
    enrichLevels: enrichLevels,
    resolveLevelBand: resolveLevelBand,
    nhsSearchLink: nhsSearchLink,
  };
})();
