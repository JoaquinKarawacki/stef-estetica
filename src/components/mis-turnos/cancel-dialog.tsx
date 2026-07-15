"use client";

import { useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDateLong, formatTime } from "@/lib/format";
import type { BookingWithService } from "@/lib/types";

export function CancelDialog({
  booking,
  open,
  onOpenChange,
  onCancelled,
}: {
  booking: BookingWithService;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelled: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No pudimos cancelar tu turno.");
        setSubmitting(false);
        return;
      }

      onCancelled();
      onOpenChange(false);
    } catch {
      setError("No pudimos conectar con el servidor.");
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-500/10 text-burgundy-400">
            <TriangleAlert className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <DialogTitle className="mt-4 text-center">¿Cancelar este turno?</DialogTitle>
          <DialogDescription className="text-center">
            {booking.service.name} · {formatDateLong(booking.date)} a las{" "}
            {formatTime(booking.date)} hs. Esta acción libera el horario para otra clienta.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="mb-3 rounded-xl bg-burgundy-500/10 px-4 py-2.5 text-sm text-burgundy-400">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Volver
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleConfirm} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sí, cancelar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
