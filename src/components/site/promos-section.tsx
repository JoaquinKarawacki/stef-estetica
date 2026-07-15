import Link from "next/link";
import { MapPin, Calendar, Clock, MessageCircle } from "lucide-react";
import { ScrollReveal, SectionEyebrowHeading } from "./scroll-reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRAND } from "@/lib/constants";

const PROMOS = [
  {
    slug: "combo-cavado-axilas-tira-cola",
    badge: "Promo especial",
    zones: ["Cavado completo", "Tira de cola", "Axilas"],
    price: "$2.390",
  },
  {
    slug: "combo-pierna-axilas-bozo",
    badge: "Promo especial",
    zones: ["Pierna entera", "Axilas", "Bozo"],
    price: "$2.390",
  },
];

export function PromosSection() {
  return (
    <section id="promos" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrowHeading
          eyebrow="Promos de lanzamiento"
          title="Es tu momento — agenda abierta"
          description="Combos pensados para que empieces tu tratamiento de depilación láser al mejor precio. Cupos limitados."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PROMOS.map((promo, i) => (
            <ScrollReveal
              key={promo.slug}
              delay={i * 0.1}
              className="relative overflow-hidden rounded-[2rem] border border-gold-400/20 bg-gradient-to-br from-cream-50 via-cream-100 to-burgundy-700/20 p-9"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-burgundy-500/15 blur-3xl" />

              <Badge tone="gold" className="relative">
                {promo.badge}
              </Badge>

              <h3 className="relative mt-5 font-display text-2xl text-ink-900 uppercase">
                Depilación <span className="font-script text-3xl text-burgundy-400 normal-case">Láser</span>
              </h3>

              <ul className="relative mt-4 space-y-1.5">
                {promo.zones.map((zone, zi) => (
                  <li key={zone} className="flex items-center gap-2 text-sm text-ink-700/75">
                    {zi > 0 && <span className="text-burgundy-400">+</span>}
                    <span className="font-medium">{zone}</span>
                  </li>
                ))}
              </ul>

              <div className="relative mt-6 flex items-baseline gap-2 border-t border-ink-700/[0.08] pt-6">
                <span className="text-xs tracking-[0.2em] text-ink-700/45 uppercase">Por solo</span>
                <span className="font-display text-4xl text-ink-900">{promo.price}</span>
              </div>

              <div className="relative mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] font-medium tracking-wide text-ink-700/50 uppercase">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-burgundy-400" />
                  Zona Centro
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-burgundy-400" />
                  Agenda abierta
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-burgundy-400" />
                  A tu horario
                </span>
              </div>

              <p className="relative mt-5 font-script text-lg text-gold-400">
                Sentite libre, cómoda y segura en tu piel
              </p>

              <Button asChild variant="gold" className="relative mt-6 w-full sm:w-auto">
                <Link href={`/reservar?servicio=${promo.slug}`}>Reservá tu turno</Link>
              </Button>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal
          delay={0.2}
          className="mt-6 flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-gold-400/20 bg-cream-50 p-8 text-center sm:flex-row sm:text-left"
        >
          <div>
            <p className="font-script text-2xl text-burgundy-400">20% OFF en tu primera sesión</p>
            <p className="mt-1.5 text-[13.5px] text-ink-700/60">
              Reservá online y asegurá tu lugar — cupos limitados.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="whatsapp">
              <Link href="/reservar">Reservá tu turno</Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="shrink-0">
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Consultas por WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
