"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { getServiceIcon } from "@/lib/icon-map";
import { formatDateLong, formatPrice, formatTime } from "@/lib/format";
import { BookingStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { CancelDialog } from "./cancel-dialog";
import { RescheduleDialog } from "./reschedule-dialog";
import type { BookingWithService } from "@/lib/types";

export function BookingCard({
  booking,
  onChanged,
}: {
  booking: BookingWithService;
  onChanged: () => void;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const Icon = getServiceIcon(booking.service.icon);
  const isFuture = new Date(booking.date).getTime() > Date.now();
  const canManage = isFuture && booking.status !== "cancelled" && booking.status !== "completed";

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-ink-700/[0.07] bg-cream-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blush-100 text-burgundy-600">
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-ink-900">{booking.service.name}</p>
              <BookingStatusBadge status={booking.status} />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-700/55">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateLong(booking.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(booking.date)} hs
              </span>
              <span className="font-medium text-burgundy-500">
                {formatPrice(booking.service.price)}
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] tracking-wide text-ink-700/35">
              {booking.code}
            </p>
          </div>
        </div>

        {canManage && (
          <div className="flex shrink-0 gap-2 sm:flex-col md:flex-row">
            <Button variant="outline" size="sm" onClick={() => setRescheduleOpen(true)}>
              Reagendar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-burgundy-500 hover:bg-burgundy-500/10"
              onClick={() => setCancelOpen(true)}
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <CancelDialog
        booking={booking}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onCancelled={onChanged}
      />
      <RescheduleDialog
        booking={booking}
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onRescheduled={onChanged}
      />
    </>
  );
}
