"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

export function WhatsappFloatButton() {
  return (
    <motion.a
      href={BRAND.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.1, ease: [0.23, 1, 0.32, 1] }}
      whileTap={{ scale: 0.94 }}
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-burgundy-500 text-ink-900 shadow-[0_14px_35px_-10px_rgba(58,138,150,0.6)] sm:right-8 sm:bottom-8"
      aria-label="Escribinos por WhatsApp"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-burgundy-500/40 [animation-duration:2.5s]" />
      <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
    </motion.a>
  );
}
