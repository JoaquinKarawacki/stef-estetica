import { formatDateShort, formatTime } from "./format";

type NotificationInput = {
  type: "new_booking" | "cancelled" | "rescheduled";
  clientName: string;
  clientPhone: string;
  serviceName: string;
  date: Date;
};

const ICONS: Record<NotificationInput["type"], string> = {
  new_booking: "🔔",
  cancelled: "❌",
  rescheduled: "🔄",
};

const TITLES: Record<NotificationInput["type"], string> = {
  new_booking: "Nueva reserva",
  cancelled: "Turno cancelado",
  rescheduled: "Turno reagendado",
};

export function buildWhatsappPreview(input: NotificationInput): { title: string; message: string } {
  const icon = ICONS[input.type];
  const label = TITLES[input.type];
  const when = `${formatDateShort(input.date)} ${formatTime(input.date)}`;

  const message = `${icon} ${label}: ${input.clientName}, ${input.serviceName}, ${when} hs. Tel ${input.clientPhone}`;

  return { title: label, message };
}
