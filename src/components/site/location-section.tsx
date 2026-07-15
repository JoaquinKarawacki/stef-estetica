import { Clock, MapPin, Phone } from "lucide-react";
import { ScrollReveal, SectionEyebrowHeading } from "./scroll-reveal";
import { BRAND, HOURS_DISPLAY } from "@/lib/constants";

export function LocationSection() {
  const mapQuery = encodeURIComponent(`${BRAND.address}`);

  return (
    <section id="ubicacion" className="relative bg-blush-50/50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrowHeading eyebrow="Visitanos" title="Te esperamos en Cordón" />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <ScrollReveal className="overflow-hidden rounded-[2rem] border border-ink-700/[0.06] shadow-[0_20px_60px_-35px_rgba(74,47,52,0.3)] lg:col-span-3">
            <iframe
              title="Ubicación Stef Valdez Estética Integral"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-80 w-full grayscale-[15%] sm:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </ScrollReveal>

          <ScrollReveal
            delay={0.1}
            className="flex flex-col justify-center gap-6 rounded-[2rem] bg-cream-50 p-8 lg:col-span-2"
          >
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush-100 text-burgundy-600">
                <MapPin className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-900">Dirección</p>
                <p className="mt-1 text-[13.5px] text-ink-700/60">{BRAND.address}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush-100 text-burgundy-600">
                <Clock className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-900">Horarios</p>
                <div className="mt-1 space-y-0.5">
                  {HOURS_DISPLAY.map((h) => (
                    <p key={h.label} className="text-[13.5px] text-ink-700/60">
                      <span className="text-ink-700/80">{h.label}:</span> {h.value}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush-100 text-burgundy-600">
                <Phone className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-900">WhatsApp</p>
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-[13.5px] text-burgundy-400 hover:underline"
                >
                  {BRAND.phoneDisplay}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
