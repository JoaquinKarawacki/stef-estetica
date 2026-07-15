// Uruguay uses a fixed UTC-3 offset year-round (DST was abolished in 2015),
// so all "what day/time is it in Montevideo" math can use a constant offset
// instead of a full timezone database. This keeps date construction correct
// no matter what timezone the host machine (dev laptop vs. Railway
// container) happens to be running in.
export const MONTEVIDEO_TIME_ZONE = "America/Montevideo";

const MONTEVIDEO_OFFSET = "-03:00";
const MONTEVIDEO_OFFSET_MS = 3 * 60 * 60 * 1000;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Builds the real UTC instant for a Montevideo wall-clock date + time. */
export function montevideoDateTime(dateStr: string, time = "00:00"): Date {
  return new Date(`${dateStr}T${time}:00${MONTEVIDEO_OFFSET}`);
}

/**
 * Returns a Date whose UTC-getter fields (getUTCDay, getUTCHours, ...) equal
 * the Montevideo wall-clock fields for `instant` — lets us read day/weekday/
 * hour "as seen from Montevideo" independent of the host machine's own
 * timezone, without a timezone database.
 */
export function toMontevideoFields(instant: Date): Date {
  return new Date(instant.getTime() - MONTEVIDEO_OFFSET_MS);
}

/** "YYYY-MM-DD" for a Date, as it reads on the Montevideo wall clock. */
export function toMontevideoDateStr(instant: Date): string {
  const f = toMontevideoFields(instant);
  return `${f.getUTCFullYear()}-${pad(f.getUTCMonth() + 1)}-${pad(f.getUTCDate())}`;
}

/** Montevideo midnight "today", regardless of the host machine's timezone. */
export function todayInMontevideo(): Date {
  return montevideoDateTime(toMontevideoDateStr(new Date()));
}
