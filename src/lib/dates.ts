import { addDays } from "date-fns";
import { BUSINESS_HOURS } from "./constants";
import { toMontevideoDateStr, toMontevideoFields, todayInMontevideo } from "./timezone";

export type UpcomingDay = {
  date: Date;
  dateStr: string;
  weekdayShort: string;
  dayNum: string;
  monthShort: string;
  isOpen: boolean;
};

const WEEKDAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export function getUpcomingDays(count = 21): UpcomingDay[] {
  const today = todayInMontevideo();
  const days: UpcomingDay[] = [];

  for (let i = 0; i < count; i++) {
    const date = addDays(today, i);
    const fields = toMontevideoFields(date);
    const weekday = fields.getUTCDay();
    days.push({
      date,
      dateStr: toMontevideoDateStr(date),
      weekdayShort: WEEKDAY_SHORT[weekday],
      dayNum: String(fields.getUTCDate()),
      monthShort: MONTH_SHORT[fields.getUTCMonth()],
      isOpen: Boolean(BUSINESS_HOURS[weekday]),
    });
  }

  return days;
}
