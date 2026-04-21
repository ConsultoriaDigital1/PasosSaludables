export const formatPriceARS = (price: number): string =>
  `$${Math.round(price).toLocaleString('es-AR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })}`;

export const formatCompactNumber = (value: number): string =>
  new Intl.NumberFormat('es-AR', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);

export const formatDateLabel = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short'
  }).format(date);
};

export const formatDateTimeLabel = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
