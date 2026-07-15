import { Flame, Flower2, Gem, Sparkles, Waves, Zap } from "lucide-react";
import { ScrollReveal, SectionEyebrowHeading } from "./scroll-reveal";
import { cn } from "@/lib/cn";

const TILES = [
  {
    icon: Zap,
    title: "Depilación láser",
    span: "sm:col-span-2 sm:row-span-2",
    gradient: "from-burgundy-700/30 via-cream-100 to-cream-50",
    height: "h-64 sm:h-full",
  },
  {
    icon: Flame,
    title: "Velas encendidas",
    span: "sm:col-span-1",
    gradient: "from-gold-400/20 via-cream-200 to-cream-50",
    height: "h-48",
  },
  {
    icon: Waves,
    title: "Toallas blancas",
    span: "sm:col-span-1",
    gradient: "from-cream-200 via-cream-100 to-blush-100/10",
    height: "h-48",
  },
  {
    icon: Gem,
    title: "Espacio Stef Valdez",
    span: "sm:col-span-2",
    gradient: "from-burgundy-500/15 via-cream-100 to-gold-400/15",
    height: "h-48",
  },
  {
    icon: Flower2,
    title: "Eucalipto y plantas",
    span: "sm:col-span-1",
    gradient: "from-gold-300/20 via-cream-100 to-cream-50",
    height: "h-48",
  },
  {
    icon: Sparkles,
    title: "Sentite libre y segura",
    span: "sm:col-span-3",
    gradient: "from-blush-100/10 via-gold-400/15 to-cream-100",
    height: "h-32",
  },
];

export function GallerySection() {
  return (
    <section id="galeria" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrowHeading
          eyebrow="Nuestro espacio"
          title="Un ambiente cálido y sofisticado"
          description="Velas encendidas, eucalipto y luz tenue dorada — un espacio pensado para tu confort en Cordón."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2">
          {TILES.map((tile, i) => (
            <ScrollReveal key={tile.title} delay={i * 0.06} className={tile.span}>
              <div
                className={cn(
                  "bg-noise group relative flex w-full flex-col justify-end overflow-hidden rounded-[1.75rem] border border-gold-400/15 bg-gradient-to-br p-6",
                  tile.gradient,
                  tile.height
                )}
              >
                <tile.icon
                  className="absolute top-6 right-6 h-8 w-8 text-burgundy-400/50 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                  strokeWidth={1.25}
                />
                <p className="font-display text-lg text-ink-900 uppercase">{tile.title}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
