import { MONTEVIDEO_TIME_ZONE } from "./timezone";

const currencyFormatter = new Intl.NumberFormat("es-UY", {
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return `$${currencyFormatter.format(price)}`;
}

const dateFormatter = new Intl.DateTimeFormat("es-UY", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  timeZone: MONTEVIDEO_TIME_ZONE,
});

export function formatDateLong(date: Date): string {
  const formatted = dateFormatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: MONTEVIDEO_TIME_ZONE,
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: MONTEVIDEO_TIME_ZONE,
  }).format(date);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}
