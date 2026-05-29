/* Coleebri Health — venous phlebotomy enquiry helpers (pricing from Worthing) */

(function () {
  const ORIGIN_POSTCODE = 'BN14 7NB';
  /** Clinic coords (postcodes.io BN14 7NB) — avoids extra API call on first quote */
  const ORIGIN = { lat: 50.8194, lng: -0.3764 };

  const IN_CLINIC_FEE = 50;

  const TIERS = [
    { maxMiles: 2, price: 55, label: 'Within 2 miles of Worthing' },
    { maxMiles: 5, price: 62, label: 'Within 5 miles of Worthing' },
    { maxMiles: 10, price: 70, label: 'Within 10 miles of Worthing' },
    { maxMiles: Infinity, price: 70, label: 'UK mobile collection', note: 'from £70' },
  ];

  const COLLECTION_METHODS = [
    {
      id: 'clinic',
      title: 'Book a venous draw at our Worthing clinic',
      tag: 'Venous',
      description:
        'Monthly in-clinic appointment at 140 South Street, Worthing BN14 7NB. Includes professional collection and delivery to the laboratory.',
      priceDisplay: '£' + IN_CLINIC_FEE,
      sample: 'venous',
      mailLabel: 'In-clinic venous draw (Worthing) — £' + IN_CLINIC_FEE,
    },
    {
      id: 'mobile',
      title: 'Book a venous draw at home with our clinician',
      tag: 'Venous',
      description:
        'Our clinician comes to your home or workplace. The fee depends on distance from Worthing (from £55 within 2 miles, up to £70). Includes sterile supplies, centrifuge and lab delivery.',
      priceDisplay: 'From £55',
      sample: 'venous',
      mailLabel: 'Mobile venous collection — from £55 (by distance from Worthing)',
    },
    {
      id: 'self',
      title: 'Self-arrange a professional sample collection',
      tag: 'Venous',
      description:
        'Make an appointment at a phlebotomy clinic of your choice. You arrange the appointment and any fee they charge; Coleebri does not add a collection charge.',
      priceDisplay: 'Free',
      isFree: true,
      sample: 'venous',
      mailLabel: 'Self-arranged venous collection (no Coleebri collection fee)',
    },
    {
      id: 'fingerprick',
      title: 'Finger-prick sample at home',
      tag: 'Finger-prick',
      description:
        'We post a kit where available on your test. Return your sample by post for laboratory analysis. No Coleebri collection charge.',
      priceDisplay: 'Free',
      isFree: true,
      sample: 'fingerprick',
      mailLabel: 'Home finger-prick kit — no Coleebri collection fee (kit & delivery £7 per order on laboratory total)',
    },
    {
      id: 'either',
      title: 'Either option is fine',
      tag: 'Flexible',
      description: 'We can advise whether finger-prick or venous collection suits your test when we reply.',
      priceDisplay: '—',
      sample: null,
      mailLabel: 'Either finger-prick or venous — please advise',
    },
  ];

  function getCollectionMethods(tests) {
    if (!tests) return COLLECTION_METHODS.slice();
    const list = Array.isArray(tests) ? tests : [tests];
    const needsV = list.some(needsVenous);
    const allowsFp = list.some(function (t) {
      return (t.samples || []).indexOf('fingerprick') !== -1;
    });
    const showEither = list.some(function (t) {
      const s = t.samples || [];
      return s.indexOf('fingerprick') !== -1 && s.indexOf('venous') !== -1;
    });
    return COLLECTION_METHODS.filter(function (m) {
      if (m.id === 'either') return showEither;
      if (m.sample === 'venous') return needsV;
      if (m.sample === 'fingerprick') return allowsFp;
      return true;
    });
  }

  function collectionMethodToOption(method) {
    return {
      label: method.mailLabel,
      title: method.title,
      sample: method.sample,
      collectionId: method.id,
      priceDisplay: method.priceDisplay,
      tag: method.tag,
      description: method.description,
      isFree: !!method.isFree,
      pricePrefix: method.pricePrefix || null,
      mailLabel: method.mailLabel,
    };
  }

  const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

  let originCoords = { ...ORIGIN };

  function needsVenous(test) {
    return Boolean(test && Array.isArray(test.samples) && test.samples.includes('venous'));
  }

  function needsVenousInList(items) {
    return Array.isArray(items) && items.some(needsVenous);
  }

  function normalisePostcode(pc) {
    return String(pc || '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '');
  }

  function formatPostcode(pc) {
    const n = normalisePostcode(pc);
    if (n.length <= 3) return n;
    return `${n.slice(0, -3)} ${n.slice(-3)}`;
  }

  function extractOutcode(normalised) {
    const m = normalised.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)/);
    return m ? m[1] : null;
  }

  function isValidUkPostcode(pc) {
    const n = normalisePostcode(pc);
    if (n.length < 5 || n.length > 8) return false;
    return UK_POSTCODE_RE.test(formatPostcode(n));
  }

  function milesBetween(lat1, lon1, lat2, lon2) {
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function resultToCoords(result) {
    return {
      postcode: result.postcode,
      lat: result.latitude,
      lng: result.longitude,
      admin: result.admin_district || result.parish || result.region || '',
    };
  }

  async function apiGet(path) {
    const res = await fetch(`https://api.postcodes.io${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Postcode service returned an invalid response. Try again in a moment.');
    }
    if (data && data.status === 200 && data.result) {
      return data.result;
    }
    const msg = data && data.error ? String(data.error) : null;
    throw new Error(msg || 'We could not find that postcode. Check it and try again.');
  }

  async function apiPostPostcode(formatted) {
    const res = await fetch('https://api.postcodes.io/postcodes', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ postcodes: [formatted] }),
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Postcode service returned an invalid response. Try again in a moment.');
    }
    const row = data && data.result && data.result[0];
    if (data.status === 200 && row && row.result) {
      return row.result;
    }
    throw new Error('We could not find that postcode. Check it and try again.');
  }

  async function fetchOutcode(outcode) {
    const result = await apiGet(`/outcodes/${encodeURIComponent(outcode)}`);
    return {
      lat: result.latitude,
      lng: result.longitude,
      admin: result.admin_district || result.region || '',
      approximate: true,
    };
  }

  async function fetchPostcode(postcode) {
    const cleaned = normalisePostcode(postcode);
    if (!cleaned) throw new Error('Enter a UK postcode');
    if (!isValidUkPostcode(cleaned)) {
      throw new Error('Enter a full UK postcode (e.g. BN11 1AA).');
    }

    const formatted = formatPostcode(cleaned);
    const attempts = [
      () => apiGet(`/postcodes/${encodeURIComponent(cleaned)}`),
      () => apiGet(`/postcodes/${encodeURIComponent(formatted)}`),
      () => apiPostPostcode(formatted),
    ];

    let lastErr;
    for (const attempt of attempts) {
      try {
        return resultToCoords(await attempt());
      } catch (e) {
        lastErr = e;
      }
    }

    const outcode = extractOutcode(cleaned);
    if (outcode) {
      try {
        const approx = await fetchOutcode(outcode);
        return { ...approx, postcode: formatted };
      } catch (e) {
        lastErr = e;
      }
    }

    if (lastErr && /failed to fetch|networkerror|load failed/i.test(String(lastErr.message || lastErr))) {
      throw new Error(
        'Could not reach the postcode service. Open this catalogue via http://localhost (not as a file:// link) and try again.'
      );
    }
    throw lastErr || new Error('We could not find that postcode. Check it and try again.');
  }

  async function ensureOrigin() {
    return originCoords;
  }

  function priceForMiles(miles) {
    const m = Math.max(0, miles);
    for (const tier of TIERS) {
      if (m <= tier.maxMiles) {
        return {
          miles: Math.round(m * 10) / 10,
          price: tier.price,
          tierLabel: tier.label,
          display: tier.note ? `From £${tier.price}` : `£${tier.price}`,
        };
      }
    }
    return { miles: Math.round(m * 10) / 10, price: 70, tierLabel: 'UK', display: 'From £70' };
  }

  async function quoteFromPostcode(postcode) {
    const origin = await ensureOrigin();
    const dest = await fetchPostcode(postcode);
    const miles = milesBetween(origin.lat, origin.lng, dest.lat, dest.lng);
    const pricing = priceForMiles(miles);
    return {
      ...pricing,
      postcode: dest.postcode,
      area: dest.admin,
      approximate: Boolean(dest.approximate),
    };
  }

  function minDateStr() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  function normaliseSlot(slot) {
    if (!slot) return { date: '', time: '' };
    if (typeof slot === 'string') return { date: slot, time: '' };
    return { date: slot.date || '', time: slot.time || '' };
  }

  function formatTimeLabel(time24) {
    if (!time24) return '';
    const parts = String(time24).split(':');
    const h = Number(parts[0]);
    const m = Number(parts[1] || 0);
    if (Number.isNaN(h)) return time24;
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  function formatAppointmentChoicesForMail(slots) {
    return (slots || [])
      .map(normaliseSlot)
      .filter((s) => s.date)
      .map((s, i) => {
        try {
          const dt = new Date(s.date + 'T12:00:00');
          const dateStr = dt.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          const timeStr = s.time ? formatTimeLabel(s.time) : 'time not specified';
          return `${i + 1}. ${dateStr}, ${timeStr}`;
        } catch {
          return `${i + 1}. ${s.date}${s.time ? ', ' + s.time : ''}`;
        }
      })
      .join('\n');
  }

  function formatDobForMail(iso) {
    if (!iso) return '';
    try {
      const dt = new Date(iso + 'T12:00:00');
      return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return iso;
    }
  }

  function maxDobStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function minDobStr() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 120);
    return d.toISOString().slice(0, 10);
  }

  function mobileCollectionTiers() {
    return TIERS.map((t) => ({
      label: t.label,
      display: t.maxMiles === Infinity ? 'From £70' : `£${t.price}`,
    }));
  }

  function buildPhlebotomyMailSection() {
    const lines = [
      '',
      '--- Phlebotomy (venous blood draw) ---',
      'This enquiry includes at least one test that needs a venous blood sample.',
      'I understand a phlebotomy / collection fee applies in addition to laboratory test fees.',
      'Please send appointment booking details after my order is placed.',
      '',
      'Guide — mobile collection from Worthing:',
      ...TIERS.filter((t) => t.maxMiles !== Infinity).map((t) => `  ${t.label}: £${t.price}`),
      '  UK mobile collection: from £70',
      'In-clinic option: £50 (monthly Worthing clinic, BN14 7NB).',
    ];
    return lines.join('\n');
  }

  function phlebotomyFeeAmount(quote) {
    return quote && typeof quote.price === 'number' ? quote.price : 0;
  }

  function phlebotomyBreakdownLabel(quote) {
    if (!quote) return 'Mobile phlebotomy (estimate)';
    const miles = quote.miles != null ? ` · ~${quote.miles} mi from Worthing` : '';
    return `Mobile phlebotomy — ${quote.display}${miles}`;
  }

  function isPhlebotomyEnquiryComplete() {
    return true;
  }

  window.ColeebriPhlebotomy = {
    ORIGIN_POSTCODE,
    IN_CLINIC_FEE,
    COLLECTION_METHODS,
    getCollectionMethods,
    collectionMethodToOption,
    needsVenous,
    needsVenousInList,
    normalisePostcode,
    formatPostcode,
    isValidUkPostcode,
    quoteFromPostcode,
    minDateStr,
    maxDobStr,
    minDobStr,
    mobileCollectionTiers,
    buildPhlebotomyMailSection,
    isPhlebotomyEnquiryComplete,
    phlebotomyFeeAmount,
    phlebotomyBreakdownLabel,
  };
})();
