function createFormatter(options: Intl.NumberFormatOptions) {
  const formatter = new Intl.NumberFormat('pl-PL', options);

  // Older Intl implementations leave four-digit Polish amounts ungrouped.
  const formatToParts = (amount: number) =>
    formatter.formatToParts(amount).map((part) =>
      part.type === 'integer'
        ? { ...part, value: part.value.replace(/\B(?=(\d{3})+$)/g, '\u00a0') }
        : part
    );

  return {
    format: (amount: number) => formatToParts(amount).map(({ value }) => value).join(''),
    formatToParts,
  };
}

export const amountFormatter = createFormatter({
  maximumFractionDigits: 0,
  useGrouping: true,
});

export const plnFormatter = createFormatter({
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  useGrouping: true,
});

export const plnWithCentsFormatter = createFormatter({
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  useGrouping: true,
});
