export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatHours(hours: number): string {
  return hours.toFixed(2);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString + "T00:00:00");
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** ASCII-safe amounts for jsPDF (standard fonts lack full Unicode). */
export function formatCurrencyPdf(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat("en-IE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `EUR ${formatted}`;
}

export function formatGeneratedAt(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
