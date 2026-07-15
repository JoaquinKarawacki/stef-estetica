"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StepDatetime } from "@/components/booking/step-datetime";
import type { BookingWithService } from "@/lib/types";

export function RescheduleDialog({
  booking,
  open,
  onOpenChange,
  onRescheduled,
}: {
  booking: BookingWithService;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRescheduled: () => void;
}) {
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!date || !time) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id, date, time }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No pudimos reagendar tu turno.");
        setSubmitting(false);
        return;
      }

      onRescheduled();
      onOpenChange(false);
      setDate(null);
      setTime(null);
    } catch {
      setError("No pudimos conectar con el servidor.");
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reagendar turno</DialogTitle>
          <DialogDescription>{booking.service.name}</DialogDescription>
        </DialogHeader>

        <StepDatetime
          serviceId={booking.serviceId}
          selectedDate={date}
          selectedTime={time}
          onSelectDate={(d) => {
            setDate(d);
            setTime(null);
          }}
          onSelectTime={setTime}
        />

        {error && (
          <p className="mt-3 rounded-xl bg-burgundy-500/10 px-4 py-2.5 text-sm text-burgundy-400">
            {error}
          </p>
        )}

        <Button
          className="mt-6 w-full"
          disabled={!date || !time || submitting}
          onClick={handleConfirm}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Reagendando…
            </>
          ) : (
            "Confirmar nuevo horario"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
