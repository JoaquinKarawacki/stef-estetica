"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#beneficios", label: "Por qué elegirnos" },
  { href: "#galeria", label: "Galería" },
  { href: "#promos", label: "Promos" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#testimonios", label: "Testimonios" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
      >
        <div
          className={cn(
            "flex w-full max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300",
            scrolled
              ? "border-ink-700/[0.06] bg-cream-50/90 shadow-[0_8px_30px_-12px_rgba(74,47,52,0.2)] backdrop-blur-lg"
              : "border-transparent bg-cream-50/40 backdrop-blur-md"
          )}
        >
          <Link href="#top" className="pl-1">
            <Logo showTagline={false} className="gap-2" markClassName="h-9 w-9" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-[13.5px] font-medium tracking-wide text-ink-700/70 uppercase transition-colors hover:bg-burgundy-500/[0.08] hover:text-burgundy-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button asChild size="sm">
              <Link href="/reservar">Reservá tu turno</Link>
            </Button>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-900 lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      <div
        className={cn(
          "fixed inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-cream-100/98 backdrop-blur-xl transition-opacity duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="font-display text-2xl tracking-wide text-ink-900 uppercase transition-all duration-300"
            style={{
              transitionDelay: open ? `${80 + i * 45}ms` : "0ms",
              transform: open ? "translateY(0)" : "translateY(12px)",
              opacity: open ? 1 : 0,
            }}
          >
            {link.label}
          </a>
        ))}
        <Button asChild className="mt-5" onClick={() => setOpen(false)}>
          <Link href="/reservar">Reservá tu turno</Link>
        </Button>
      </div>
    </>
  );
}
