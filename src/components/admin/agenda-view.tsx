"use client";

import { useMemo, useState } from "react";
import { addDays, addWeeks, endOfWeek, format, isSameDay, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { BookingWithService } from "@/lib/types";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const STATUS_DOT: Record<string, string> = {
  confirmed: "bg-burgundy-500",
  rescheduled: "bg-gold-500",
  cancelled: "bg-ink-700/25",
  completed: "bg-blush-400",
};

export function AgendaView({ bookings }: { bookings: BookingWithService[] }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(
    () => startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 }),
    [weekOffset]
  );
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-700/70">
          {format(weekStart, "d MMM")} – {format(weekEnd, "d MMM yyyy")}
        </p>
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-7">
        {days.map((day, i) => {
          const dayBookings = bookings
            .filter((b) => isSameDay(new Date(b.date), day) && b.status !== "cancelled")
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "rounded-2xl border p-3",
                isToday ? "border-burgundy-300 bg-burgundy-500/[0.04]" : "border-ink-700/[0.07] bg-cream-50"
              )}
            >
              <p className="text-[11px] font-medium tracking-wide text-ink-700/45 uppercase">
                {WEEKDAY_LABELS[i]}
              </p>
              <p className={cn("font-display text-lg", isToday ? "text-burgundy-400" : "text-ink-900")}>
                {format(day, "d")}
              </p>

              <div className="mt-2 space-y-1.5">
                {dayBookings.length === 0 && (
                  <p className="text-[11px] text-ink-700/30">Sin turnos</p>
                )}
                {dayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-lg bg-ink-700/[0.04] px-2 py-1.5 text-[11px] leading-tight"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT[b.status])} />
                      <span className="font-medium text-ink-900">{formatTime(b.date)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-ink-700/70">{b.service.name}</p>
                    <p className="truncate text-ink-700/45">{b.clientName}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
