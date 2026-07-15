import { addMinutes } from "date-fns";
import { BRAND } from "./constants";

function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildIcsDataUrl({
  title,
  description,
  start,
  durationMin,
}: {
  title: string;
  description: string;
  start: Date;
  durationMin: number;
}): string {
  const end = addMinutes(start, durationMin);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Stef Valdez Estetica Integral//Reservas//ES",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@stefvaldez`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${BRAND.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
