"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarOff, Loader2 } from "lucide-react";
import { getUpcomingDays } from "@/lib/dates";
import { HOURS_DISPLAY } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function AvailabilitySettings() {
  const [blockedDates, setBlockedDates] = useState<string[] | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/blocked-dates")
      .then((res) => res.json())
      .then((data) => {
        setBlockedDates(
          (data.blockedDates ?? []).map((b: { date: string }) => b.date.slice(0, 10))
        );
      });
  }, []);

  async function toggleDate(dateStr: string) {
    setPending(dateStr);
    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr }),
      });
      const data = await res.json();

      setBlockedDates((prev) => {
        const list = prev ?? [];
        return data.blocked ? [...list, dateStr] : list.filter((d) => d !== dateStr);
      });
      toast.success(data.blocked ? "Día bloqueado" : "Día habilitado nuevamente");
    } finally {
      setPending(null);
    }
  }

  const days = getUpcomingDays(14).filter((d) => d.isOpen);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-ink-700/[0.07] bg-cream-50 p-6">
        <h3 className="font-display text-lg text-ink-900">Horario de atención</h3>
        <div className="mt-4 space-y-2.5">
          {HOURS_DISPLAY.map((h) => (
            <div key={h.label} className="flex items-center justify-between text-sm">
              <span className="text-ink-700/60">{h.label}</span>
              <span className="font-medium text-ink-900">{h.value}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-700/40">
          Para cambiar el horario base, escribinos y lo actualizamos por vos.
        </p>
      </div>

      <div className="rounded-2xl border border-ink-700/[0.07] bg-cream-50 p-6">
        <h3 className="flex items-center gap-2 font-display text-lg text-ink-900">
          <CalendarOff className="h-4 w-4 text-burgundy-500" />
          Bloquear fechas
        </h3>
        <p className="mt-1 text-xs text-ink-700/50">
          Tocá un día para bloquearlo (vacaciones, feriados, imprevistos).
        </p>

        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {days.map((day) => {
            const isBlocked = blockedDates?.includes(day.dateStr);
            const isLoading = pending === day.dateStr;
            return (
              <button
                key={day.dateStr}
                disabled={!blockedDates || isLoading}
                onClick={() => toggleDate(day.dateStr)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl border py-2 text-xs transition-colors duration-200",
                  isBlocked
                    ? "border-burgundy-400 bg-burgundy-500 text-ink-900"
                    : "border-ink-700/[0.08] text-ink-700/70 hover:border-burgundy-300"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <span className="opacity-60">{day.weekdayShort}</span>
                    <span className="font-medium">{day.dayNum}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
