"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import type { Service } from "@/generated/prisma/client";
import { getServiceIcon } from "@/lib/icon-map";
import { formatDuration, formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { SectionEyebrowHeading } from "./scroll-reveal";
import { cn } from "@/lib/cn";

const FILTERS = ["todos", "facial", "corporal", "depilacion"] as const;

export function ServicesSection({ services }: { services: Service[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("todos");

  const filtered =
    filter === "todos" ? services : services.filter((s) => s.category === filter);

  return (
    <section id="servicios" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrowHeading
          eyebrow="Nuestros tratamientos"
          title="Servicios pensados para vos"
          description="Depilación láser y estética integral con tecnología de última generación, en un espacio pensado para que te sientas cómoda y segura."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200",
                filter === f
                  ? "bg-burgundy-500 text-ink-900"
                  : "bg-cream-50 text-ink-700/60 ring-1 ring-ink-700/[0.07] hover:text-burgundy-400"
              )}
            >
              {f === "todos" ? "Todos" : CATEGORY_LABELS[f]}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((service, i) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                  className="group relative flex flex-col rounded-[1.75rem] border border-ink-700/[0.06] bg-cream-50 p-7 shadow-[0_20px_60px_-35px_rgba(74,47,52,0.3)] transition-shadow duration-300 hover:shadow-[0_25px_70px_-30px_rgba(139,46,78,0.28)]"
                >
                  {service.featured && (
                    <Badge tone="burgundy" className="absolute -top-3 right-6">
                      Más elegido
                    </Badge>
                  )}

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blush-100 text-burgundy-600 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>

                  <h3 className="mt-5 font-display text-xl text-ink-900">{service.name}</h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-700/60">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-center gap-1.5 text-xs text-ink-700/45">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDuration(service.durationMin)}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-ink-700/[0.06] pt-4">
                    <div>
                      <p className="font-display text-lg text-burgundy-400">
                        {service.priceLabel || formatPrice(service.price)}
                      </p>
                    </div>
                    <Link
                      href={`/reservar?servicio=${service.slug}`}
                      className="group/link flex items-center gap-1.5 text-[13px] font-medium text-burgundy-400"
                    >
                      Reservar
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-burgundy-500/10 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
