"use client";

import { Input, Label, Textarea } from "@/components/ui/input";

export type BookingDetails = {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  note: string;
};

export function StepDetails({
  values,
  onChange,
}: {
  values: BookingDetails;
  onChange: (field: keyof BookingDetails, value: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink-900">Tus datos</h2>
      <p className="mt-1.5 text-sm text-ink-700/55">
        Los usamos solo para confirmar tu turno y avisarte si hay algún cambio.
      </p>

      <div className="mt-7 space-y-5">
        <div>
          <Label htmlFor="clientName">Nombre completo</Label>
          <Input
            id="clientName"
            placeholder="Ana Ramírez"
            value={values.clientName}
            onChange={(e) => onChange("clientName", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="clientPhone">Celular (WhatsApp)</Label>
          <Input
            id="clientPhone"
            placeholder="099 123 456"
            inputMode="numeric"
            value={values.clientPhone}
            onChange={(e) => onChange("clientPhone", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="clientEmail">Email (opcional)</Label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="ana@email.com"
            value={values.clientEmail}
            onChange={(e) => onChange("clientEmail", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="note">Nota (opcional)</Label>
          <Textarea
            id="note"
            placeholder="Ej: primera vez, piel sensible, alguna consulta puntual…"
            value={values.note}
            onChange={(e) => onChange("note", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
