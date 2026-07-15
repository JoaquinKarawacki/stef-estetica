"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BellRing } from "lucide-react";
import { formatDateShort, formatTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { WhatsappPreviewCard } from "./whatsapp-preview-card";
import type { Notification } from "@/generated/prisma/client";

export function NotificationsFeed({
  notifications,
  onMarkAllRead,
}: {
  notifications: Notification[];
  onMarkAllRead: () => void;
}) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing className="h-4 w-4 text-burgundy-500" />
          <p className="text-sm font-medium text-ink-700/70">
            {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
            Marcar todo como leído
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <AnimatePresence initial={false}>
          {notifications.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-700/45">
              Todavía no hay notificaciones.
            </p>
          )}

          {notifications.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="relative"
            >
              {!n.read && (
                <span className="absolute -top-1.5 -left-1.5 z-10 h-3 w-3 rounded-full bg-burgundy-500 ring-2 ring-cream-100" />
              )}
              <WhatsappPreviewCard
                message={n.message}
                time={`${formatDateShort(n.createdAt)} ${formatTime(n.createdAt)}`}
                className="max-w-md"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
