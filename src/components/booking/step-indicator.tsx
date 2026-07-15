"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

const STEPS = ["Servicio", "Profesional", "Fecha y hora", "Tus datos", "Listo"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;

        return (
          <div key={label} className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  scale: isActive ? 1.08 : 1,
                }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors duration-300",
                  isDone && "bg-burgundy-500 text-ink-900",
                  isActive && "bg-burgundy-500 text-ink-900 ring-4 ring-burgundy-500/15",
                  !isDone && !isActive && "bg-ink-700/[0.06] text-ink-700/40"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : stepNum}
              </motion.div>
              <span
                className={cn(
                  "hidden text-[10px] font-medium tracking-wide uppercase sm:block",
                  isActive ? "text-burgundy-400" : "text-ink-700/35"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-5 transition-colors duration-300 sm:w-10",
                  isDone ? "bg-burgundy-400" : "bg-ink-700/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
