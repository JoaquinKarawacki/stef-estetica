"use client";

import { Clock } from "lucide-react";
import type { Service } from "@/generated/prisma/client";
import { getServiceIcon } from "@/lib/icon-map";
import { formatDuration, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export function StepService({
  services,
  selectedId,
  onSelect,
}: {
  services: Service[];
  selectedId: string | null;
  onSelect: (service: Service) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink-900">Elegí tu tratamiento</h2>
      <p className="mt-1.5 text-sm text-ink-700/55">
        Seleccioná el servicio que querés reservar.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {services.map((service) => {
          const Icon = getServiceIcon(service.icon);
          const isSelected = service.id === selectedId;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service)}
              className={cn(
                "flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.98]",
                isSelected
                  ? "border-burgundy-400 bg-burgundy-500/[0.06] ring-1 ring-burgundy-400"
                  : "border-ink-700/[0.08] bg-cream-50 hover:border-burgundy-300"
              )}
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isSelected ? "bg-burgundy-500 text-ink-900" : "bg-blush-100 text-burgundy-600"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink-900">{service.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-700/50">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(service.durationMin)}
                  </span>
                  <span className="font-medium text-burgundy-400">
                    {service.priceLabel || formatPrice(service.price)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
