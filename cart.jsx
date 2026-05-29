/* Coleebri - shopping-style selection list (enquiry cart, not checkout) */

const CART_KEY = 'coleebri-catalogue-cart-v1';

function cartKey(test) {
  return test.id || (test.code + '|' + test.name);
}

function useCart() {
  const [items, setItems] = React.useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (_) {}
  }, [items]);

  const add = (test) => {
    const k = cartKey(test);
    setItems((prev) => (prev.some((p) => cartKey(p) === k) ? prev : [...prev, test]));
  };

  const remove = (key) => setItems((prev) => prev.filter((p) => cartKey(p) !== key));

  const clear = () => setItems([]);

  const toggle = (test) => {
    const k = cartKey(test);
    setItems((prev) =>
      prev.some((p) => cartKey(p) === k) ? prev.filter((p) => cartKey(p) !== k) : [...prev, test]
    );
  };

  const has = (test) => items.some((p) => cartKey(p) === cartKey(test));

  const total = items.reduce((sum, t) => {
    if (t.poa || t.price == null) return sum;
    return sum + (Number(t.price) || 0);
  }, 0);

  const pricedCount = items.filter((t) => t.price != null && !t.poa).length;
  const kitDelivery = window.ColeebriPricing.kitDeliveryTotal(items.length);
  const indicativeTotal = total + kitDelivery;

  return {
    items,
    add,
    remove,
    clear,
    toggle,
    has,
    total,
    pricedCount,
    kitDelivery,
    indicativeTotal,
    count: items.length,
  };
}

function EnquiryPriceBreakdown({ labTotal, pricedCount, kitFee, venous }) {
  const hasLabLine = pricedCount > 0;
  const grandTotal = (hasLabLine ? labTotal : 0) + kitFee;
  const showGrand = hasLabLine || kitFee > 0;

  return (
    <div className="cart-summary">
      {hasLabLine && (
        <div className="cart-summary-row">
          <span>Tests subtotal ({pricedCount} priced)</span>
          <strong>£{labTotal}</strong>
        </div>
      )}
      {kitFee > 0 && (
        <div className="cart-summary-row">
          <span>{window.ColeebriPricing.kitDeliveryLabel()}</span>
          <strong>£{kitFee}</strong>
        </div>
      )}
      {showGrand && (
        <div className="cart-summary-row cart-summary-row--total">
          <span>Indicative total (lab + kit &amp; delivery)</span>
          <strong>£{grandTotal}</strong>
        </div>
      )}
      <p className="cart-note">
        {venous
          ? 'Phlebotomy / collection fees are additional — see guide above. '
          : 'Plus mobile or clinic collection (from £50). '}
        Lab prices are per test; {window.ColeebriPricing.kitDeliverySummary()} when a kit is posted (not per test). We
        collect samples only and do not interpret your results.
      </p>
    </div>
  );
}

function CartDrawer({ cart, open, onClose, onOpenTest }) {
  const venous = window.ColeebriPhlebotomy.needsVenousInList(cart.items);
  const Q = window.ColeebriQuiz;

  function loadCartPrefs() {
    const s = Q.loadStoredQuizAnswers();
    if (s?.fromQuiz) return s;
    return Q.mergePrefsForEnquiry(s, 'direct');
  }

  const [prefs, setPrefs] = React.useState(loadCartPrefs);
  const [editingQuiz, setEditingQuiz] = React.useState(false);
  const includeGoal = !!prefs?.fromQuiz;

  React.useEffect(() => {
    if (open) {
      setPrefs(loadCartPrefs());
      setEditingQuiz(false);
    }
  }, [open]);

  React.useEffect(() => {
    if (Q.hasRequiredQuizAnswers(prefs, includeGoal)) {
      Q.saveStoredQuizAnswers({ ...prefs, fromQuiz: includeGoal || prefs.fromQuiz });
    }
  }, [prefs, includeGoal]);

  const enquirySteps = Q.getEnquirySteps(includeGoal);
  const prefsComplete = Q.hasRequiredQuizAnswers(prefs, includeGoal);
  const showQuizSummary = prefsComplete && !editingQuiz;
  const { EnquiryQuizFields, EnquiryQuizSummary } = Q;

  const handleClearList = () => {
    cart.clear();
    Q.clearStoredQuizAnswers();
    setPrefs(Q.mergePrefsForEnquiry(null, 'direct'));
    setEditingQuiz(false);
  };

  const mailBody = React.useMemo(() => {
    const lines = [
      'Hello Coleebri Health,',
      '',
      'I would like to enquire about the following tests from your 2026 catalogue:',
      '',
      ...cart.items.map((t, i) => `${i + 1}. ${t.name} (${t.code}) - ${window.formatPrice(t)}`),
      '',
      window.ColeebriPricing.enquiryPricingLines(cart),
    ];
    if (prefsComplete) {
      lines.push(...Q.buildQuizEnquiryMailLines(prefs, includeGoal));
    }
    if (venous && !(prefsComplete && prefs.sample?.collectionId)) {
      lines.push(window.ColeebriPhlebotomy.buildPhlebotomyMailSection());
    }
    lines.push('', 'Please advise on collection options and next steps.', '', 'Kind regards,');
    return lines.join('\n');
  }, [cart.items, cart.pricedCount, cart.total, cart.count, cart.kitDelivery, venous, prefs, includeGoal, prefsComplete]);

  const mailHref = `mailto:health@coleebri.com?subject=${encodeURIComponent('Catalogue enquiry - ' + cart.count + ' tests')}&body=${encodeURIComponent(mailBody)}`;

  if (!open) return null;

  const lines = cart.items.map((t) => ({
    key: cartKey(t),
    test: t,
    price: window.formatPrice(t),
  }));

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <aside className="modal cart-drawer" onClick={(e) => e.stopPropagation()} aria-label="Your selected tests">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <Icon.close />
        </button>
        <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
          Your selection
        </span>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 6 }}>Enquiry list ({cart.count})</h3>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem', marginBottom: 18, maxWidth: '42ch' }}>
          Add tests you are interested in, then email us or export a PDF to share. This is not a checkout - collection fees
          and clinical guidance are arranged separately.
        </p>

        {cart.count === 0 ? (
          <div className="cart-empty">
            <p>No tests selected yet.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-3)' }}>Use &ldquo;Add to list&rdquo; on any card, or try Help me choose.</p>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {lines.map(({ key, test, price }) => (
                <li key={key} className="cart-line">
                  <div className="cart-line-main">
                    <button type="button" className="cart-line-name" onClick={() => onOpenTest(test)}>
                      {test.name}
                    </button>
                    <div className="cart-line-meta">
                      {test.code} · {test.turnaround}
                    </div>
                  </div>
                  <div className="cart-line-right">
                    <span className="cart-line-price">{price}</span>
                    <button type="button" className="cart-remove" onClick={() => cart.remove(key)} aria-label="Remove">
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {venous && prefsComplete && <PhlebotomyRequiredNotice />}

            <EnquiryPriceBreakdown
              labTotal={cart.total}
              pricedCount={cart.pricedCount}
              kitFee={cart.kitDelivery}
              venous={venous}
            />

            {showQuizSummary ? (
              <EnquiryQuizSummary
                prefs={prefs}
                includeGoal={includeGoal}
                onEdit={() => setEditingQuiz(true)}
              />
            ) : (
              <EnquiryQuizFields
                steps={enquirySteps}
                value={prefs}
                onChange={setPrefs}
                tests={cart.items}
                lead="Please answer these questions so we can advise you — they will be included in your email."
              />
            )}

            <div className="cart-actions">
              {prefsComplete ? (
                <a className="btn btn-solid" href={mailHref}>
                  Email this list
                </a>
              ) : (
                <button type="button" className="btn btn-solid" disabled style={{ opacity: 0.55 }}>
                  Answer the questions above to email
                </button>
              )}
              <button type="button" className="btn btn-outline" onClick={() => window.ColeebriPdf.exportCart(cart.items)}>
                Export list as PDF
              </button>
              <button type="button" className="btn btn-ghost" onClick={handleClearList}>
                Clear list
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

Object.assign(window, { useCart, CartDrawer, cartKey, EnquiryPriceBreakdown });
