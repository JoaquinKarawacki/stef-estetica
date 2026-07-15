import { Quote } from "lucide-react";
import { ScrollReveal, SectionEyebrowHeading } from "./scroll-reveal";

const TESTIMONIALS = [
  {
    name: "Cecilia Bentancor",
    service: "Combo cavado + axilas",
    quote:
      "Empecé el combo y ya desde la tercera sesión noté la diferencia. Stef te explica todo el proceso y una se siente súper cómoda y segura.",
  },
  {
    name: "Natalia Viera",
    service: "Depilación láser piernas",
    quote:
      "Vengo hace dos meses y los resultados se notan un montón, con muchísimo menos dolor del que esperaba. El lugar es hermoso y súper prolijo.",
  },
  {
    name: "Fiorella Machado",
    service: "Depilación láser rostro",
    quote:
      "Odiaba el vello del bozo y ya desde la primera sesión sentí la piel distinta. Ahora es mi momento favorito de autocuidado.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrowHeading eyebrow="Lo que dicen de nosotras" title="Clientas que ya viven su mejor versión" />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal
              key={t.name}
              delay={i * 0.08}
              className="flex flex-col rounded-[1.75rem] border border-ink-700/[0.06] bg-cream-50 p-7"
            >
              <Quote className="h-7 w-7 text-gold-400" strokeWidth={1.25} />
              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink-700/70">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 border-t border-ink-700/[0.06] pt-4">
                <p className="text-sm font-medium text-ink-900">{t.name}</p>
                <p className="text-xs text-burgundy-400">{t.service}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
