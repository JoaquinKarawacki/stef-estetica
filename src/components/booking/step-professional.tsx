import { Check } from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { BRAND } from "@/lib/constants";

export function StepProfessional() {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink-900">Tu profesional</h2>
      <p className="mt-1.5 text-sm text-ink-700/55">
        Todos los tratamientos son realizados personalmente por Stef.
      </p>

      <div className="mt-7 flex items-center gap-4 rounded-2xl border border-burgundy-400 bg-burgundy-500/[0.06] p-5 ring-1 ring-burgundy-400">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream-50">
          <LogoMark className="h-9 w-9" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-ink-900">{BRAND.professional}</p>
          <p className="text-xs text-ink-700/55">Esteticista · {BRAND.addressShort}</p>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-burgundy-500 text-ink-900">
          <Check className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
