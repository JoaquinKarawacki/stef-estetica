"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Check, Clock, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateLong, formatTime } from "@/lib/format";
import { buildIcsDataUrl } from "@/lib/ics";
import { BRAND } from "@/lib/constants";

export function StepConfirmation({
  code,
  serviceName,
  date,
  durationMin,
}: {
  code: string;
  serviceName: string;
  date: Date;
  durationMin: number;
}) {
  const icsUrl = buildIcsDataUrl({
    title: `${serviceName} — ${BRAND.name}`,
    description: `Turno reservado en ${BRAND.name}. Código: ${code}`,
    start: date,
    durationMin,
  });

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-burgundy-500 text-ink-900"
      >
        <Check className="h-7 w-7" strokeWidth={2} />
      </motion.div>

      <h2 className="mt-6 font-display text-2xl text-ink-900">¡Tu turno está confirmado!</h2>
      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-700/55">
        <PartyPopper className="h-4 w-4 text-gold-500" />
        Te esperamos, {BRAND.professional.split(" ")[0]} ya tiene tu lugar reservado.
      </p>

      <div className="mt-7 w-full rounded-2xl border border-gold-400/30 bg-cream-100 p-6">
        <p className="text-[11px] font-medium tracking-[0.25em] text-gold-600 uppercase">
          Código de reserva
        </p>
        <p className="mt-1 font-display text-3xl text-burgundy-400">{code}</p>

        <div className="mt-5 space-y-2 border-t border-ink-700/[0.06] pt-4 text-left text-sm text-ink-700/70">
          <p className="font-medium text-ink-900">{serviceName}</p>
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-burgundy-500" />
            {formatDateLong(date)}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-burgundy-500" />
            {formatTime(date)} hs
          </p>
        </div>
      </div>

      <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline" className="flex-1">
          <a download={`turno-${code}.ics`} href={icsUrl}>
            Agregar al calendario
          </a>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/mis-turnos">Ver mis turnos</Link>
        </Button>
      </div>

      <Link href="/" className="mt-5 text-sm text-ink-700/50 hover:text-burgundy-400">
        Volver al inicio
      </Link>
    </div>
  );
}
