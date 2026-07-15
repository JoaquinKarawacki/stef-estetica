"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/badge";
import { LogoMark } from "./logo";
import { BRAND } from "@/lib/constants";

const easeOut = [0.23, 1, 0.32, 1] as const;

function FloatingChip({
  className,
  delay,
  children,
}: {
  className?: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay }}
        className="rounded-2xl border border-gold-400/25 bg-cream-50/95 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="bg-noise relative flex min-h-[100dvh] items-center overflow-hidden pt-32 pb-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-40 h-[32rem] w-[32rem] rounded-full bg-burgundy-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-gold-400/10 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <Eyebrow>{BRAND.addressShort}</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: easeOut }}
            className="mt-6 text-[2.5rem] leading-[1.08] font-medium tracking-wide text-ink-900 uppercase sm:text-6xl"
          >
            Depilación{" "}
            <span className="font-script text-[3.2rem] font-normal tracking-normal text-burgundy-400 normal-case sm:text-7xl">
              Láser
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: easeOut }}
            className="mt-6 max-w-md text-[15.5px] leading-relaxed text-ink-700/65"
          >
            Sentite libre, cómoda y segura en tu piel. Estética integral y depilación láser de
            última generación en {BRAND.addressShort}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: easeOut }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg">
              <Link href="/reservar">
                <Calendar className="h-[18px] w-[18px]" />
                <span className="flex flex-col items-start leading-tight">
                  <span>Reservá tu turno</span>
                  <span className="text-[10px] font-normal tracking-[0.2em] text-ink-900/70 uppercase">
                    Cupos limitados
                  </span>
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={BRAND.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-[18px] w-[18px]" />
                Consultas por WhatsApp
                <span className="grid h-7 w-7 place-items-center rounded-full bg-burgundy-400/10">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium tracking-wide text-ink-700/40 uppercase"
          >
            <span>Mercado Pago</span>
            <span className="h-1 w-1 rounded-full bg-ink-700/20" />
            <span>Transferencia</span>
            <span className="h-1 w-1 rounded-full bg-ink-700/20" />
            <span>Efectivo</span>
          </motion.div>
        </div>

        <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
            className="absolute inset-6 rounded-full border border-gold-400/30"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: easeOut }}
            className="absolute inset-14 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-cream-50 via-cream-100 to-burgundy-700/25 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]"
          >
            <LogoMark className="h-28 w-28" />
            <span className="mt-4 font-display text-xl tracking-[0.1em] text-ink-900 uppercase">
              Stef Valdez
            </span>
            <span className="mt-1.5 text-[11px] font-medium tracking-[0.35em] text-burgundy-400 uppercase">
              Estética Integral
            </span>
          </motion.div>

          <FloatingChip className="absolute -left-6 top-10" delay={0.7}>
            <p className="font-display text-lg text-burgundy-400">20% OFF</p>
            <p className="text-[11px] text-ink-700/60">primera sesión</p>
          </FloatingChip>

          <FloatingChip className="absolute -right-4 bottom-16" delay={0.9}>
            <p className="text-[11px] font-medium text-ink-700/60">Resultados</p>
            <p className="font-display text-base text-burgundy-400">Desde la 1ª sesión</p>
          </FloatingChip>
        </div>
      </div>
    </section>
  );
}
