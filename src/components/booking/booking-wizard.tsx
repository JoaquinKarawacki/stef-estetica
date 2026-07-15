"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import type { Service } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./step-indicator";
import { StepService } from "./step-service";
import { StepProfessional } from "./step-professional";
import { StepDatetime } from "./step-datetime";
import { StepDetails, type BookingDetails } from "./step-details";
import { StepConfirmation } from "./step-confirmation";

type Result = {
  code: string;
  date: Date;
  durationMin: number;
  serviceName: string;
};

const easeOut = [0.23, 1, 0.32, 1] as const;

export function BookingWizard({
  services,
  initialServiceSlug,
}: {
  services: Service[];
  initialServiceSlug?: string;
}) {
  const initialService = useMemo(
    () => services.find((s) => s.slug === initialServiceSlug) ?? null,
    [services, initialServiceSlug]
  );

  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service | null>(initialService);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<BookingDetails>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const canContinueFrom: Record<number, boolean> = {
    1: Boolean(service),
    2: true,
    3: Boolean(date && time),
    4: details.clientName.trim().length >= 2 && /^0?9\d{7}$/.test(details.clientPhone.trim()),
  };

  async function handleSubmit() {
    if (!service || !date || !time) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          date,
          time,
          clientName: details.clientName,
          clientPhone: details.clientPhone,
          clientEmail: details.clientEmail,
          note: details.note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No pudimos crear la reserva. Probá de nuevo.");
        setSubmitting(false);
        return;
      }

      setResult({
        code: data.booking.code,
        date: new Date(data.booking.date),
        durationMin: data.booking.durationMin,
        serviceName: data.booking.serviceName,
      });
      setStep(5);
    } catch {
      setError("No pudimos conectar con el servidor. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  function goNext() {
    if (step === 4) {
      handleSubmit();
      return;
    }
    setStep((s) => Math.min(s + 1, 5));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {step < 5 && (
        <div className="mb-10">
          <StepIndicator current={step} />
        </div>
      )}

      <div className="rounded-[2rem] border border-ink-700/[0.06] bg-cream-50 p-6 shadow-[0_30px_80px_-40px_rgba(74,47,52,0.35)] sm:p-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            {step === 1 && (
              <StepService services={services} selectedId={service?.id ?? null} onSelect={(s) => setService(s)} />
            )}
            {step === 2 && <StepProfessional />}
            {step === 3 && service && (
              <StepDatetime
                serviceId={service.id}
                selectedDate={date}
                selectedTime={time}
                onSelectDate={(d) => {
                  setDate(d);
                  setTime(null);
                }}
                onSelectTime={setTime}
              />
            )}
            {step === 4 && (
              <StepDetails
                values={details}
                onChange={(field, value) => setDetails((prev) => ({ ...prev, [field]: value }))}
              />
            )}
            {step === 5 && result && (
              <StepConfirmation
                code={result.code}
                serviceName={result.serviceName}
                date={result.date}
                durationMin={result.durationMin}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-4 rounded-xl bg-burgundy-500/10 px-4 py-2.5 text-sm text-burgundy-400">
            {error}
          </p>
        )}

        {step < 5 && (
          <div className="mt-9 flex items-center justify-between border-t border-ink-700/[0.06] pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={step === 1}
              className={step === 1 ? "pointer-events-none opacity-0" : ""}
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </Button>
            <Button type="button" onClick={goNext} disabled={!canContinueFrom[step] || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirmando…
                </>
              ) : step === 4 ? (
                "Confirmar reserva"
              ) : (
                <>
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
