/* Coleebri - 'Help me choose' quiz (updated for new data shape) */

const QUIZ_STEPS = [
  {
    id: 'goal',
    question: 'What\'s the main reason for considering a test today?',
    options: [
      { label: 'A general yearly check-up',          match: (t) => t.tracks.includes('general') && /screen|profile|cardio|kidney|liver|biochem/i.test(t.name) },
      { label: 'I\'ve been feeling tired or low',     match: (t) => /tired|anaemia|thyroid|long covid|iron|vitamin|stress|wellbeing/i.test(t.name) },
      { label: 'Heart, cholesterol or diabetes risk', match: (t) => /cardio|lipid|diabetes|hba1c/i.test(t.name) || /cardio|lipid|diabet/i.test(t.blurb) },
      { label: 'Hormones, mood or cycle changes',     match: (t) => /hormon|thyroid|menopause|testosterone|endocrin|stress|cortisol/i.test(t.name) },
      { label: 'Family planning / fertility',         match: (t) => /fertility|ovarian|amh|gender/i.test(t.name) },
      { label: 'A confidential sexual-health check',  match: (t) => t.tracks.includes('sexual') },
      { label: 'Possible allergy or food reaction',   match: (t) => /allerg|intoler|sensit|igE/i.test(t.name) || t.section === 'allergies' },
      { label: 'Sport, training or recovery',         match: (t) => /sport|wellbeing|fatty|performance|fitness/i.test(t.name) },
      { label: 'Paternity, DNA or gender reveal',     match: (t) => t.tracks.includes('dna') },
    ],
  },
  {
    id: 'sample',
    question: 'How do you want to take your sample?',
    options: [],
  },
  {
    id: 'speed',
    question: 'How quickly do you need your results?',
    options: [
      { label: 'As fast as possible', maxTurn: 1 },
      { label: 'Within a few days',           maxTurn: 5 },
      { label: 'Speed isn\'t critical',       maxTurn: 99 },
    ],
  },
];

function parseTurnaround(t) {
  const m = t.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 99;
}

const QUIZ_STORAGE_KEY = 'coleebri-quiz-answers';

function serializeQuizAnswers(answers) {
  if (!answers) return null;
  const out = { fromQuiz: true };
  if (answers.goal) out.goal = { label: answers.goal.label };
  if (answers.sample) {
    out.sample = {
      label: answers.sample.mailLabel || answers.sample.label || answers.sample.title,
      sample: answers.sample.sample ?? null,
      collectionId: answers.sample.collectionId || answers.sample.id || null,
      priceDisplay: answers.sample.priceDisplay || null,
      title: answers.sample.title || null,
    };
  }
  if (answers.speed) out.speed = { label: answers.speed.label, maxTurn: answers.speed.maxTurn };
  return out;
}

function loadStoredQuizAnswers() {
  try {
    const raw = sessionStorage.getItem(QUIZ_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStoredQuizAnswers(prefs) {
  try {
    if (!prefs || (!prefs.goal && !prefs.sample && !prefs.speed)) {
      sessionStorage.removeItem(QUIZ_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(prefs));
  } catch (_) {}
}

function clearStoredQuizAnswers() {
  try {
    sessionStorage.removeItem(QUIZ_STORAGE_KEY);
  } catch (_) {}
}

function getEnquirySteps(includeGoal) {
  return includeGoal ? QUIZ_STEPS : QUIZ_STEPS.filter((s) => s.id !== 'goal');
}

function hasRequiredQuizAnswers(prefs, includeGoal) {
  if (!prefs) return false;
  if (includeGoal && !prefs.goal?.label) return false;
  if (!prefs.sample?.label) return false;
  if (!prefs.speed?.label) return false;
  return true;
}

function buildQuizEnquiryMailLines(prefs, includeGoal) {
  if (!prefs || !hasRequiredQuizAnswers(prefs, includeGoal)) return [];
  const lines = ['', 'Help me choose (my preferences):', ''];
  if (includeGoal && prefs.goal?.label) lines.push(`- Main reason: ${prefs.goal.label}`);
  if (prefs.sample?.label) {
    const price =
      prefs.sample.priceDisplay && prefs.sample.priceDisplay !== '—'
        ? ` (${prefs.sample.priceDisplay})`
        : '';
    lines.push(`- How to take your sample: ${prefs.sample.label}${price}`);
  }
  if (prefs.speed?.label) lines.push(`- Results timing: ${prefs.speed.label}`);
  lines.push('');
  return lines;
}

function mergePrefsForEnquiry(stored, source) {
  const base = stored ? { ...stored } : { fromQuiz: false };
  if (source === 'quiz') return base;
  return {
    fromQuiz: false,
    sample: base.sample || null,
    speed: base.speed || null,
    goal: null,
  };
}

function EnquiryQuizSummary({ prefs, includeGoal, onEdit }) {
  if (!hasRequiredQuizAnswers(prefs, includeGoal)) return null;
  return (
    <div className="enquiry-quiz-summary">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <span className="eyebrow" style={{ display: 'block' }}>Your preferences</span>
        {onEdit && (
          <button type="button" className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem', flexShrink: 0 }} onClick={onEdit}>
            Change
          </button>
        )}
      </div>
      <ul className="enquiry-quiz-summary__list">
        {includeGoal && prefs.goal?.label && <li><strong>Reason:</strong> {prefs.goal.label}</li>}
        {prefs.sample?.label && (
          <li>
            <strong>Sample:</strong> {prefs.sample.title || prefs.sample.label}
            {prefs.sample.priceDisplay && prefs.sample.priceDisplay !== '—' ? ` (${prefs.sample.priceDisplay})` : ''}
          </li>
        )}
        {prefs.speed?.label && <li><strong>Timing:</strong> {prefs.speed.label}</li>}
      </ul>
    </div>
  );
}

function EnquiryQuizFields({ steps, value, onChange, lead, tests }) {
  const P = window.ColeebriPhlebotomy;
  const collectionMethods = P.getCollectionMethods(tests);

  return (
    <div className="enquiry-quiz-fields">
      <p className="enquiry-quiz-fields__lead">{lead}</p>
      {steps.map((step) => (
        <div key={step.id} className="enquiry-quiz-fields__step">
          {step.id === 'sample' ? (
            <CollectionMethodPicker
              question={step.question}
              methods={collectionMethods}
              value={value.sample}
              onChange={(opt) => onChange({ ...value, sample: opt })}
            />
          ) : (
            <>
              <h4 className="enquiry-quiz-fields__q">{step.question}</h4>
              <div className="quiz-options enquiry-quiz-options">
                {step.options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    className={'quiz-opt' + (value[step.id]?.label === opt.label ? ' is-selected' : '')}
                    onClick={() => onChange({ ...value, [step.id]: opt })}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function recommend(answers) {
  const goalMatch = answers.goal?.match;
  const wantSample = answers.sample?.sample;
  const maxTurn = answers.speed?.maxTurn ?? 99;

  let pool = window.TESTS.filter(t => {
    if (goalMatch && !goalMatch(t)) return false;
    if (wantSample && !t.samples.includes(wantSample)) return false;
    if (parseTurnaround(t.turnaround) > maxTurn) return false;
    return true;
  });

  /* Sort by price ascending (helpful defaults first) */
  pool.sort((a, b) => (a.price ?? 9999) - (b.price ?? 9999));
  return pool.slice(0, 5);
}

function Quiz({ onClose, onSelectTest, onCompareTest, onCartTest }) {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [done, setDone] = React.useState(false);

  const handleSelect = (opt) => {
    const step = QUIZ_STEPS[stepIdx];
    const newAnswers = { ...answers, [step.id]: opt };
    setAnswers(newAnswers);
    if (stepIdx + 1 < QUIZ_STEPS.length) {
      setStepIdx(stepIdx + 1);
    } else {
      const serialized = serializeQuizAnswers(newAnswers);
      if (serialized) saveStoredQuizAnswers(serialized);
      setDone(true);
    }
  };

  const handleRestart = () => { setStepIdx(0); setAnswers({}); setDone(false); };

  if (done) {
    const results = recommend(answers);
    return (
      <div className="quiz-result">
        <span className="eyebrow" style={{display:'block', marginBottom: 8}}>Based on your answers</span>
        <h3 style={{fontFamily:'var(--font-display)'}}>Tests that match what you&rsquo;re looking for</h3>
        <p style={{color:'var(--ink-2)', marginBottom: 8, fontSize:'0.92rem'}}>
          These suggestions are guidance only. Coleebri Health collects your sample and sends it to an accredited laboratory - we don&rsquo;t diagnose conditions. Please talk to your GP if you&rsquo;re unsure.
        </p>
        <div className="results-list">
          {results.length === 0 && <p style={{color:'var(--ink-3)', textAlign:'center', padding:'20px 0'}}>No matches with those filters. Try widening one of your answers.</p>}
          {results.map((t) => (
            <div key={t.code + t.name} className="quiz-result-card">
              <div className="quiz-result-card__main">
                <div className="qrc-name">{t.name}</div>
                <p className="quiz-result-card__meta">
                  {t.code} · {t.turnaround} ·{' '}
                  {t.samples.map((s) => window.SAMPLE_TYPES[s]?.short).filter(Boolean).join(' / ')}
                </p>
              </div>
              <div className="quiz-result-card__aside">
                <span className="qrc-price">{window.formatPrice(t)}</span>
                <button
                  type="button"
                  className="btn btn-solid quiz-result-card__cta"
                  onClick={() => onSelectTest(t, serializeQuizAnswers(answers))}
                >
                  Enquire <Icon.arrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="quiz-result__foot">
          <button type="button" className="btn btn-ghost" onClick={handleRestart}>
            Start over
          </button>
        </div>
      </div>
    );
  }

  const step = QUIZ_STEPS[stepIdx];
  const collectionMethods =
    step.id === 'sample' ? window.ColeebriPhlebotomy.getCollectionMethods() : [];

  return (
    <div className="quiz-step">
      <div className="quiz-progress">
        {QUIZ_STEPS.map((_, i) => (
          <span key={i} className={i < stepIdx ? 'done' : i === stepIdx ? 'active' : ''} />
        ))}
      </div>
      <span className="eyebrow" style={{ display: 'block', marginBottom: 10 }}>
        Help me choose · Step {stepIdx + 1} of {QUIZ_STEPS.length}
      </span>
      {step.id === 'sample' ? (
        <>
          <p style={{ color: 'var(--ink-2)', marginBottom: 16 }}>
            Choose how you would like your sample collected. Collection fees are in addition to laboratory test prices.
          </p>
          <CollectionMethodPicker
            question={step.question}
            methods={collectionMethods}
            value={answers.sample}
            onChange={(opt) => handleSelect(opt)}
          />
        </>
      ) : (
        <>
          <h3 style={{ fontFamily: 'var(--font-display)' }}>{step.question}</h3>
          <p>Pick the closest match - this isn&rsquo;t medical advice, just a way to narrow things down.</p>
          <div className="quiz-options">
            {step.options.map((opt, i) => (
              <button key={i} className="quiz-opt" onClick={() => handleSelect(opt)}>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

window.Quiz = Quiz;
window.ColeebriQuiz = {
  STEPS: QUIZ_STEPS,
  serializeQuizAnswers,
  loadStoredQuizAnswers,
  saveStoredQuizAnswers,
  clearStoredQuizAnswers,
  getEnquirySteps,
  hasRequiredQuizAnswers,
  buildQuizEnquiryMailLines,
  mergePrefsForEnquiry,
  EnquiryQuizFields,
  EnquiryQuizSummary,
};
