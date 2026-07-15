import { addMinutes, isBefore, isEqual } from "date-fns";
import { BUSINESS_HOURS, SLOT_STEP_MIN } from "./constants";
import { montevideoDateTime, toMontevideoDateStr, toMontevideoFields } from "./timezone";

export type ExistingBooking = { date: Date; durationMin: number };

function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return isBefore(aStart, bEnd) && isBefore(bStart, aEnd);
}

/**
 * Generates the list of bookable start times ("HH:mm") for a given day and
 * service duration, excluding slots that collide with existing bookings or
 * fall outside business hours. `now` is injected for deterministic same-day
 * cutoffs (a booking must start at least `minLeadMin` from now).
 *
 * `day` must represent Montevideo midnight for the target date (see
 * `montevideoDateTime`) — all wall-clock math below is done relative to
 * Montevideo, independent of the host machine's own timezone.
 */
export function getAvailableSlots({
  day,
  durationMin,
  existingBookings,
  isBlocked,
  now = new Date(),
  minLeadMin = 60,
}: {
  day: Date;
  durationMin: number;
  existingBookings: ExistingBooking[];
  isBlocked: boolean;
  now?: Date;
  minLeadMin?: number;
}): string[] {
  if (isBlocked) return [];

  const weekday = toMontevideoFields(day).getUTCDay();
  const hours = BUSINESS_HOURS[weekday];
  if (!hours) return [];

  const dateStr = toMontevideoDateStr(day);
  const openTime = montevideoDateTime(dateStr, hours.start);
  const closeTime = montevideoDateTime(dateStr, hours.end);
  const earliestStart = addMinutes(now, minLeadMin);

  const slots: string[] = [];
  let cursor = openTime;

  while (isBefore(cursor, closeTime) || isEqual(cursor, closeTime)) {
    const slotEnd = addMinutes(cursor, durationMin);
    if (isBefore(closeTime, slotEnd)) break;

    const isPast = isBefore(cursor, earliestStart);
    const collides = existingBookings.some((b) =>
      rangesOverlap(cursor, slotEnd, b.date, addMinutes(b.date, b.durationMin))
    );

    if (!isPast && !collides) {
      const fields = toMontevideoFields(cursor);
      slots.push(
        `${String(fields.getUTCHours()).padStart(2, "0")}:${String(fields.getUTCMinutes()).padStart(2, "0")}`
      );
    }

    cursor = addMinutes(cursor, SLOT_STEP_MIN);
  }

  return slots;
}

/** `day` must represent Montevideo midnight for the target date. */
export function combineDateAndTime(day: Date, time: string): Date {
  return montevideoDateTime(toMontevideoDateStr(day), time);
}
