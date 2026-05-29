import fs from 'fs';

const path = new URL('../data.js', import.meta.url);
let s = fs.readFileSync(path, 'utf8');

const pairs = [
  [
    'In line with NICE guidance, early identification allows lifestyle changes or medication to cut heart attack and stroke risk.',
    'Understanding these markers early may help you and your clinician discuss lifestyle changes or treatment to reduce heart and stroke risk.',
  ],
  [
    'NICE recommends monitoring in diabetes, hypertension, and family history of kidney disease.',
    'Often used when monitoring diabetes, high blood pressure, or a family history of kidney problems.',
  ],
  [
    'A random glucose is also measured. NICE: HbA1c ≥48 mmol/mol indicates diabetes. Early detection prevents complications including blindness, kidney damage, and nerve damage.',
    'A random glucose is also measured. Higher HbA1c levels can suggest diabetes — your clinician will interpret the result and explain next steps.',
  ],
  [
    'Standard first-line NHS test for tiredness, breathlessness, and recurrent infections.',
    'A very common blood test when investigating tiredness, breathlessness, or recurrent infections.',
  ],
  [
    'NICE recommends lipid testing for cardiovascular risk factors or family history of early heart disease.',
    'Often requested when assessing heart risk, especially with risk factors or early heart disease in the family.',
  ],
  ['One of the most-ordered NHS tests.', 'A commonly requested blood test.'],
  [
    'Standard NHS investigation for urinary symptoms.',
    'Often used when investigating urinary symptoms.',
  ],
  [
    'NICE recommends for anyone with liver symptoms or risk factors (obesity, alcohol use).',
    'Often used when you have liver symptoms or risk factors such as obesity or regular alcohol use.',
  ],
  [
    'Both easily treated. NICE: screen anyone with unexplained fatigue, weight changes, or mood disturbance.',
    'Both are treatable when diagnosed. Blood tests are often used alongside symptoms such as unexplained tiredness, weight change, or mood changes.',
  ],
  [
    'Covers most areas of NHS health checks. Appropriate for an annual health MOT.',
    'Covers many markers used in general health screening. May suit a broad annual check-up — discuss with your clinician.',
  ],
  [
    'and CA125 (ovarian cancer marker recommended by NICE when ovarian cancer suspected)',
    'and CA125 (a marker sometimes checked when ovarian conditions are suspected)',
  ],
  [
    'Mirrors NICE/NHS guidance for unexplained fatigue investigation.',
    'Covers common blood-test causes of ongoing tiredness.',
  ],
  [
    'tTG-IgA is the primary NICE-recommended test for coeliac disease.',
    'tTG-IgA is a main blood test used when coeliac disease is suspected.',
  ],
  [
    'NICE recommends antibody testing when autoimmune thyroid disease is suspected.',
    'Antibody tests are often added when autoimmune thyroid disease is suspected.',
  ],
  [
    'Gold-standard NHS test for UTIs. Dipstick alone is insufficient to guide antibiotic prescribing.',
    'A detailed test for urine infections. It can identify bacteria and guide antibiotic choice more reliably than a dipstick alone.',
  ],
  [
    'NICE recommends vitamin D and calcium checks in osteoporosis risk groups.',
    'Vitamin D and calcium are often checked in people at risk of weak bones (osteoporosis).',
  ],
  ['in line with NICE metabolic health guidance.', 'when assessing metabolic health.'],
  [
    'Primary blood test for coeliac disease (NICE recommended).',
    'A main blood test when coeliac disease is suspected.',
  ],
  [
    'NICE: check before starting iron supplements.',
    'Iron studies are often checked before starting iron supplements.',
  ],
  ['Aligns with NICE fertility guidance.', 'Covers hormones and nutrients often discussed in fertility assessments.'],
  [
    'Aligns with NICE guidance on testosterone measurement.',
    'Used when investigating symptoms such as low libido, erectile problems, fatigue, or muscle loss.',
  ],
  [
    'NICE/hospital guidelines: primary blood test for suspected pancreatitis.',
    'Often the first blood test when pancreatitis (inflammation of the pancreas) is suspected.',
  ],
  [
    'Includes markers related to the most common blood-test causes of erectile dysfunction per NICE guidance: testosterone, thyroid, HbA1c (diabetes), cholesterol (cardiovascular risk), and prolactin.',
    'Includes markers often checked when investigating erectile problems: testosterone, thyroid function, blood sugar (HbA1c), cholesterol, and prolactin.',
  ],
  [
    'PSA testing from age 50 (or 45 with risk factors) is supported by NICE.',
    'PSA may be discussed from around age 50, or earlier if you have risk factors — your clinician can advise.',
  ],
  [
    'NICE: in women over 45 with symptoms, clinical assessment can often be made clinically; blood tests are useful under 45 or for atypical presentations.',
    'In women over 45, menopause is often diagnosed from symptoms; blood tests can help when you are younger or symptoms are unclear.',
  ],
  [
    'NHS recommends rubella immunity screening in early pregnancy.',
    'Rubella immunity is commonly checked in early pregnancy.',
  ],
  [
    'Recommended by NICE/British Society for Rheumatology when CTD suspected.',
    'Used when a specialist suspects a connective tissue disease.',
  ],
  [
    'NICE: allergy testing should accompany a clear history of allergic symptoms.',
    'Allergy blood tests are most useful when you have a clear history of allergic symptoms.',
  ],
  ['(NICE guidance).', '.'],
  [
    'NICE recommends specialist allergy assessment for suspected nut allergy.',
    'Severe nut allergy should be assessed by a specialist allergy service.',
  ],
  [
    'NICE/BASHH recommend regular STI screening for sexually active people. Many STIs are curable if treated early.',
    'Regular STI screening may be appropriate for some people. Many STIs are treatable when found early.',
  ],
  [
    'recommended by NICE for sexually active people under 25 and those with new or multiple partners.',
    'may be appropriate for sexually active adults, including those with new or multiple partners.',
  ],
  [
    'NHS: baseline testing as soon as possible after exposure.',
    'Baseline testing as soon as possible after exposure is important — seek urgent occupational-health or clinical advice.',
  ],
  ['NICE recommends two-tier antibody testing.', 'Laboratories typically use a two-step antibody approach.'],
  [
    'NHS: ≥10 mIU/mL confirms protection. Needed by healthcare workers, travellers, and those with risk factors for hepatitis B exposure.',
    'A level of at least 10 mIU/mL usually means you are protected. Often checked for healthcare workers, travellers, or hepatitis B risk.',
  ],
];

let n = 0;
for (const [from, to] of pairs) {
  if (s.includes(from)) {
    s = s.split(from).join(to);
    n++;
  }
}
fs.writeFileSync(path, s);
const left = (s.match(/\bNICE\b|\bNHS\b/g) || []).length;
console.log(`Updated ${n} blurbs. Remaining NICE/NHS: ${left}`);
