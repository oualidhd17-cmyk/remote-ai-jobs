export function formatDate(value: string): string {
  if (!value) {
    return 'Recently';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string | null,
): string | null {
  if (!min && !max) {
    return null;
  }

  const resolvedCurrency = currency || 'USD';

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en', {
      style: 'currency',
      currency: resolvedCurrency,
      maximumFractionDigits: 0,
    }).format(value);

  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  }

  if (min) {
    return `${formatNumber(min)}+`;
  }

  if (max) {
    return `Up to ${formatNumber(max)}`;
  }

  return null;
}

export function titleCase(value: string): string {
  return value
    .replace(/-/g, ' ')
    .replace(/\w\S*/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

export function compactNumber(value: number): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}