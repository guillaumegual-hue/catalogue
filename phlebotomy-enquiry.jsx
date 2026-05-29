/* Coleebri — phlebotomy notice when venous tests are in the enquiry list */

function CollectionMethodPicker({ methods, value, onChange, question }) {
  const selectedId = value?.collectionId || value?.id || null;

  return (
    <div className="collection-method-picker">
      <h4 className="collection-method-picker__q">{question || 'How do you want to take your sample?'}</h4>
      <div className="collection-method-list" role="radiogroup" aria-label={question || 'Sample collection method'}>
        {methods.map(function (method) {
          const selected = selectedId === method.id;
          const opt = window.ColeebriPhlebotomy.collectionMethodToOption(method);
          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={'collection-method-card' + (selected ? ' is-selected' : '')}
              onClick={() => onChange(opt)}
            >
              <span className="collection-method-card__radio" aria-hidden="true" />
              <span className="collection-method-card__body">
                <span className="collection-method-card__row">
                  <span className="collection-method-card__title">{method.title}</span>
                  <span
                    className={
                      'collection-method-card__price' + (method.isFree ? ' collection-method-card__price--free' : '')
                    }
                  >
                    {method.pricePrefix ? method.pricePrefix : ''}
                    {method.priceDisplay}
                  </span>
                </span>
                {method.sample ? (
                  <SampleChip type={method.sample} />
                ) : (
                  <span className="s-chip s-chip-flex">{method.tag}</span>
                )}
                {method.description && (
                  <span className="collection-method-card__desc">{method.description}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {methods.some(function (m) {
        return m.id === 'mobile';
      }) && (
        <p className="collection-method-picker__note">
          Mobile fees: within 2 miles £55 · within 5 miles £62 · within 10 miles £70 · elsewhere in the UK from £70.
        </p>
      )}
    </div>
  );
}

function PhlebotomyRequiredNotice() {
  const tiers = window.ColeebriPhlebotomy.mobileCollectionTiers();
  const origin = window.ColeebriPhlebotomy.ORIGIN_POSTCODE;
  const clinicFee = window.ColeebriPhlebotomy.IN_CLINIC_FEE;

  return (
    <aside className="phlebotomy-notice" aria-label="Phlebotomy required">
      <strong className="phlebotomy-notice__title">Phlebotomy required</strong>
      <p className="phlebotomy-notice__lead">
        Your selection includes at least one test that needs a <strong>venous blood draw</strong> by a qualified
        clinician. Once your order is placed, we will send you details on how to book your appointment.
      </p>

      <h4 className="phlebotomy-notice__heading">Collection pricing (guide)</h4>
      <div className="phlebotomy-price-grid">
        <div className="phlebotomy-price-card">
          <h5>Mobile collection</h5>
          <p className="phlebotomy-price-card__sub">From our Worthing base ({origin})</p>
          <ul className="coll-list">
            {tiers.map((t) => (
              <li key={t.label}>
                <span className="lbl">{t.label}</span>
                <span className="val">{t.display}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="phlebotomy-price-card">
          <h5>In-clinic appointment</h5>
          <p className="phlebotomy-price-highlight">£{clinicFee}</p>
          <p className="phlebotomy-price-card__note">140 South Street, Worthing BN14 7NB</p>
        </div>
      </div>

      <p className="phlebotomy-notice__fine">
        Laboratory test fees and £{window.ColeebriPricing.KIT_DELIVERY_FEE} kit &amp; delivery (per order,{' '}
        {window.ColeebriPricing.kitDeliveryInClinicNote().toLowerCase()}) are separate.
        Remote or specialist visits may need a supplement — confirmed when we book.
      </p>
    </aside>
  );
}

/** @deprecated use PhlebotomyRequiredNotice */
function PhlebotomyEnquiryFields() {
  return <PhlebotomyRequiredNotice />;
}

Object.assign(window, { CollectionMethodPicker, PhlebotomyRequiredNotice, PhlebotomyEnquiryFields });
