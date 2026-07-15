import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<string, { label: string; tone: "blush" | "gold" | "burgundy" | "neutral" }> = {
  confirmed: { label: "Confirmada", tone: "blush" },
  cancelled: { label: "Cancelada", tone: "neutral" },
  rescheduled: { label: "Reagendada", tone: "gold" },
  completed: { label: "Completada", tone: "burgundy" },
};

export function BookingStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? { label: status, tone: "neutral" as const };
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
