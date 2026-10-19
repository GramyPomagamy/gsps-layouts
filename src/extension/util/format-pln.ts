export const amountFormatter = new Intl.NumberFormat('pl-PL', {
  maximumFractionDigits: 0,
  useGrouping: true,
});

export const plnFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  useGrouping: true,
});

export const plnWithCentsFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  useGrouping: true,
});
