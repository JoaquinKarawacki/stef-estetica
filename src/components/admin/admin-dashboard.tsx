"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCards, type AdminStats } from "./stat-cards";
import { AgendaView } from "./agenda-view";
import { BookingsList } from "./bookings-list";
import { NotificationsFeed } from "./notifications-feed";
import { AvailabilitySettings } from "./availability-settings";
import type { BookingWithService } from "@/lib/types";
import type { Notification } from "@/generated/prisma/client";

export function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<BookingWithService[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const lastCheckRef = useRef<string>(new Date().toISOString());

  const loadAll = useCallback(async () => {
    const [statsRes, bookingsRes, notificationsRes] = await Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/bookings").then((r) => r.json()),
      fetch("/api/admin/notifications").then((r) => r.json()),
    ]);

    setStats(statsRes);
    setBookings(
      (bookingsRes.bookings ?? []).map((b: BookingWithService) => ({
        ...b,
        date: new Date(b.date),
      }))
    );
    setNotifications(
      (notificationsRes.notifications ?? []).map((n: Notification) => ({
        ...n,
        createdAt: new Date(n.createdAt),
      }))
    );
    if (notificationsRes.notifications?.[0]) {
      lastCheckRef.current = notificationsRes.notifications[0].createdAt;
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Poll for new events every few seconds to simulate real-time notifications.
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/admin/notifications?after=${encodeURIComponent(lastCheckRef.current)}`);
      const data = await res.json();
      const fresh: (Notification & { createdAt: string })[] = data.notifications ?? [];

      if (fresh.length > 0) {
        lastCheckRef.current = fresh[0].createdAt;
        for (const n of [...fresh].reverse()) {
          toast(n.title, { description: n.message });
        }
        loadAll();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [loadAll]);

  async function handleMarkAllRead() {
    await fetch("/api/admin/notifications/read", { method: "POST" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-noise min-h-screen bg-cream-100 pt-8 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo showTagline={false} markClassName="h-9 w-9" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>

        <h1 className="mt-8 font-display text-3xl text-ink-900">Panel Stef Valdez</h1>
        <p className="mt-1 text-sm text-ink-700/55">
          Todo lo que pasa en tu estética, en tiempo real.
        </p>

        <div className="mt-8">
          <StatCards stats={stats} />
        </div>

        <Tabs defaultValue="agenda" className="mt-10">
          <TabsList>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
            <TabsTrigger value="notificaciones" className="flex items-center gap-1.5">
              Notificaciones
              {unreadCount > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-burgundy-500 px-1 text-[10px] text-ink-900">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="disponibilidad">Disponibilidad</TabsTrigger>
          </TabsList>

          <TabsContent value="agenda">
            <AgendaView bookings={bookings} />
          </TabsContent>

          <TabsContent value="reservas">
            <BookingsList bookings={bookings} />
          </TabsContent>

          <TabsContent value="notificaciones">
            <NotificationsFeed notifications={notifications} onMarkAllRead={handleMarkAllRead} />
          </TabsContent>

          <TabsContent value="disponibilidad">
            <AvailabilitySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
