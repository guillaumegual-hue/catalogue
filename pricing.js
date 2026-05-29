/* Coleebri Health — catalogue pricing helpers */

(function () {
  const KIT_DELIVERY_FEE = 7;

  function kitDeliveryTotal(testCount) {
    return (Number(testCount) || 0) > 0 ? KIT_DELIVERY_FEE : 0;
  }

  function kitDeliveryLabel() {
    return 'Kit & delivery (per order)';
  }

  /** When the £7 fee does not apply */
  function kitDeliveryInClinicNote() {
    return 'Free for in-clinic appointments.';
  }

  function kitDeliverySummary() {
    return `£${KIT_DELIVERY_FEE} kit & delivery once per order (${kitDeliveryInClinicNote().toLowerCase()})`;
  }

  function enquiryPricingLines(cart) {
    const lines = [];
    const count = cart?.count ?? cart?.items?.length ?? 0;
    const lab = cart?.total ?? 0;
    const priced = cart?.pricedCount ?? 0;
    const kit = kitDeliveryTotal(count);

    if (priced) {
      lines.push(`Indicative laboratory subtotal: £${lab}.`);
    } else if (count) {
      lines.push('Some items are priced on application.');
    }

    if (kit) {
      lines.push(`${kitDeliveryLabel()}: £${kit} (${kitDeliveryInClinicNote().toLowerCase()}).`);
      if (priced) {
        lines.push(`Indicative total (lab + kit & delivery): £${lab + kit}.`);
      }
    }

    lines.push('Mobile or in-clinic collection fees are additional (see collection pricing).');
    return lines.join('\n');
  }

  window.ColeebriPricing = {
    KIT_DELIVERY_FEE,
    /** @deprecated use KIT_DELIVERY_FEE */
    KIT_DELIVERY_PER_TEST: KIT_DELIVERY_FEE,
    kitDeliveryTotal,
    kitDeliveryLabel,
    kitDeliveryInClinicNote,
    kitDeliverySummary,
    enquiryPricingLines,
  };
})();
