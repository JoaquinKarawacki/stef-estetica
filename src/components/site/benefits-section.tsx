import { HeartHandshake, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { ScrollReveal, SectionEyebrowHeading } from "./scroll-reveal";

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Resultados duraderos",
    description: "Tecnología láser de última generación para un cambio que se mantiene en el tiempo.",
  },
  {
    icon: Zap,
    title: "Sesiones rápidas y seguras",
    description: "Protocolos pensados para que cada visita sea breve, cómoda y sin sorpresas.",
  },
  {
    icon: HeartHandshake,
    title: "Resultados visibles desde las primeras sesiones",
    description: "Vas a notar el cambio sesión a sesión, sin esperar meses para verlo.",
  },
  {
    icon: ShieldCheck,
    title: "Segura para todo tipo de piel",
    description: "Protocolos adaptados a tu piel, sin importar su tono o sensibilidad.",
  },
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="relative bg-blush-50/50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrowHeading
          eyebrow="Por qué elegirnos"
          title="Cuidamos cada detalle de tu experiencia"
        />

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, i) => (
            <ScrollReveal key={benefit.title} delay={i * 0.08} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/40 bg-cream-50 text-gold-600">
                <benefit.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-display text-lg text-ink-900">{benefit.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-700/60">
                {benefit.description}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
