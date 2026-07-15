"use client";

import { useEffect, useState } from "react";
import { CalendarX2, Loader2 } from "lucide-react";
import { getUpcomingDays } from "@/lib/dates";
import { cn } from "@/lib/cn";

export function StepDatetime({
  serviceId,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: {
  serviceId: string;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}) {
  const days = getUpcomingDays(21);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setLoading(true);
    setSlots(null);

    fetch(`/api/availability?serviceId=${serviceId}&date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [serviceId, selectedDate]);

  return (
    <div>
      <h2 className="font-display text-2xl text-ink-900">Elegí fecha y horario</h2>
      <p className="mt-1.5 text-sm text-ink-700/55">
        Mostramos solo los horarios disponibles según la duración del tratamiento.
      </p>

      <div className="mt-7 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {days.map((day) => {
          const isSelected = day.dateStr === selectedDate;
          return (
            <button
              key={day.dateStr}
              type="button"
              disabled={!day.isOpen}
              onClick={() => onSelectDate(day.dateStr)}
              className={cn(
                "flex w-16 shrink-0 flex-col items-center gap-0.5 rounded-2xl border py-3 transition-all duration-200 active:scale-[0.96]",
                !day.isOpen && "cursor-not-allowed opacity-30",
                isSelected
                  ? "border-burgundy-400 bg-burgundy-500 text-ink-900"
                  : "border-ink-700/[0.08] bg-cream-50 text-ink-700 hover:border-burgundy-300"
              )}
            >
              <span className="text-[10px] font-medium tracking-wide uppercase opacity-70">
                {day.weekdayShort}
              </span>
              <span className="font-display text-lg leading-none">{day.dayNum}</span>
              <span className="text-[9px] opacity-60">{day.monthShort}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-h-[7rem]">
        {!selectedDate && (
          <p className="text-sm text-ink-700/45">Elegí un día para ver los horarios libres.</p>
        )}

        {selectedDate && loading && (
          <div className="flex items-center gap-2 text-sm text-ink-700/50">
            <Loader2 className="h-4 w-4 animate-spin" />
            Buscando horarios disponibles…
          </div>
        )}

        {selectedDate && !loading && slots && slots.length === 0 && (
          <div className="flex items-center gap-2 rounded-2xl bg-ink-700/[0.04] px-4 py-3 text-sm text-ink-700/60">
            <CalendarX2 className="h-4 w-4" />
            No quedan horarios libres ese día. Probá con otra fecha.
          </div>
        )}

        {selectedDate && !loading && slots && slots.length > 0 && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {slots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onSelectTime(time)}
                className={cn(
                  "rounded-xl border py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.96]",
                  time === selectedTime
                    ? "border-burgundy-400 bg-burgundy-500 text-ink-900"
                    : "border-ink-700/[0.08] bg-cream-50 text-ink-700/75 hover:border-burgundy-300"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
