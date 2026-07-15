"use client";

import { useMemo, useState } from "react";
import { formatDateShort, formatPrice, formatTime } from "@/lib/format";
import { BookingStatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/cn";
import type { BookingWithService } from "@/lib/types";

const FILTERS = ["todas", "confirmed", "rescheduled", "cancelled", "completed"] as const;
const FILTER_LABELS: Record<(typeof FILTERS)[number], string> = {
  todas: "Todas",
  confirmed: "Confirmadas",
  rescheduled: "Reagendadas",
  cancelled: "Canceladas",
  completed: "Completadas",
};

export function BookingsList({ bookings }: { bookings: BookingWithService[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("todas");

  const filtered = useMemo(() => {
    const list = filter === "todas" ? bookings : bookings.filter((b) => b.status === filter);
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bookings, filter]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-200",
              filter === f
                ? "bg-burgundy-500 text-ink-900"
                : "bg-ink-700/[0.05] text-ink-700/55 hover:text-burgundy-400"
            )}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-ink-700/[0.07]">
        <div className="hidden grid-cols-[1.1fr_1.4fr_1.4fr_0.9fr_0.9fr] gap-4 bg-ink-700/[0.03] px-5 py-3 text-[11px] font-medium tracking-wide text-ink-700/45 uppercase sm:grid">
          <span>Fecha</span>
          <span>Servicio</span>
          <span>Clienta</span>
          <span>Precio</span>
          <span>Estado</span>
        </div>

        <div className="divide-y divide-ink-700/[0.06]">
          {filtered.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-ink-700/45">
              No hay reservas en esta categoría.
            </p>
          )}

          {filtered.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-2 gap-2 px-5 py-4 text-sm sm:grid-cols-[1.1fr_1.4fr_1.4fr_0.9fr_0.9fr] sm:items-center sm:gap-4"
            >
              <div className="text-ink-700/75">
                <p>{formatDateShort(b.date)}</p>
                <p className="text-xs text-ink-700/45">{formatTime(b.date)} hs</p>
              </div>
              <p className="text-ink-900">{b.service.name}</p>
              <div>
                <p className="text-ink-900">{b.clientName}</p>
                <p className="text-xs text-ink-700/45">{b.clientPhone}</p>
              </div>
              <p className="text-burgundy-400">{formatPrice(b.service.price)}</p>
              <div>
                <BookingStatusBadge status={b.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
