import { CalendarCheck, CalendarClock, CircleX, Wallet } from "lucide-react";
import { formatPrice } from "@/lib/format";

export type AdminStats = {
  todayCount: number;
  upcomingCount: number;
  cancelledCount: number;
  revenueThisWeek: number;
};

export function StatCards({ stats }: { stats: AdminStats | null }) {
  const cards = [
    {
      label: "Turnos hoy",
      value: stats ? String(stats.todayCount) : "—",
      icon: CalendarCheck,
    },
    {
      label: "Próximos turnos",
      value: stats ? String(stats.upcomingCount) : "—",
      icon: CalendarClock,
    },
    {
      label: "Cancelaciones",
      value: stats ? String(stats.cancelledCount) : "—",
      icon: CircleX,
    },
    {
      label: "Ingresos estimados (semana)",
      value: stats ? formatPrice(stats.revenueThisWeek) : "—",
      icon: Wallet,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-ink-700/[0.06] bg-cream-50 p-5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 text-burgundy-600">
            <card.icon className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-display text-2xl text-ink-900">{card.value}</p>
          <p className="mt-0.5 text-xs text-ink-700/50">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
