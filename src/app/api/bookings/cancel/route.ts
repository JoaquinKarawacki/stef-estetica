import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cancelSchema } from "@/lib/validation";
import { buildWhatsappPreview } from "@/lib/whatsapp-preview";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = cancelSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: parsed.data.bookingId },
    include: { service: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "Esa reserva ya estaba cancelada" }, { status: 409 });
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "cancelled" },
  });

  const preview = buildWhatsappPreview({
    type: "cancelled",
    clientName: booking.clientName,
    clientPhone: booking.clientPhone,
    serviceName: booking.service.name,
    date: booking.date,
  });

  // TODO: conectar API WhatsApp/Twilio/Email para enviar la notificación real a Stef.
  await prisma.notification.create({
    data: {
      bookingId: booking.id,
      type: "cancelled",
      title: preview.title,
      message: preview.message,
      clientName: booking.clientName,
    },
  });

  return NextResponse.json({ booking: updated });
}
