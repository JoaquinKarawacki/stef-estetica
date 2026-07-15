"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function SectionEyebrowHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <ScrollReveal className={cn("mx-auto max-w-xl text-center", className)}>
      <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/50 bg-gold-400/10 px-4 py-1.5 text-[11px] font-medium tracking-[0.25em] text-gold-600 uppercase">
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-medium text-ink-900 sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-ink-700/65">{description}</p>
      )}
    </ScrollReveal>
  );
}
