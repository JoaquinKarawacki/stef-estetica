import { NextRequest, NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { combineDateAndTime } from "@/lib/availability";
import { rescheduleSchema } from "@/lib/validation";
import { buildWhatsappPreview } from "@/lib/whatsapp-preview";
import { BUSINESS_HOURS } from "@/lib/constants";
import { montevideoDateTime, toMontevideoFields } from "@/lib/timezone";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = rescheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { bookingId, date, time } = parsed.data;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  });

  if (!booking || booking.status === "cancelled") {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  const day = montevideoDateTime(date);
  const start = combineDateAndTime(day, time);
  const end = addMinutes(start, booking.durationMin);

  if (start.getTime() < Date.now()) {
    return NextResponse.json({ error: "Ese horario ya pasó" }, { status: 409 });
  }

  const hours = BUSINESS_HOURS[toMontevideoFields(start).getUTCDay()];
  if (!hours) {
    return NextResponse.json({ error: "No atendemos ese día" }, { status: 409 });
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const overlapping = await tx.booking.findMany({
        where: {
          id: { not: booking.id },
          status: { notIn: ["cancelled"] },
          date: { lt: end },
        },
        select: { date: true, durationMin: true },
      });

      const collides = overlapping.some((b) => {
        const bEnd = addMinutes(b.date, b.durationMin);
        return start < bEnd && b.date < end;
      });

      if (collides) throw new Error("SLOT_TAKEN");

      return tx.booking.update({
        where: { id: booking.id },
        data: { date: start, status: "rescheduled" },
      });
    });

    const preview = buildWhatsappPreview({
      type: "rescheduled",
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      serviceName: booking.service.name,
      date: updated.date,
    });

    // TODO: conectar API WhatsApp/Twilio/Email para enviar la notificación real a Stef.
    await prisma.notification.create({
      data: {
        bookingId: booking.id,
        type: "rescheduled",
        title: preview.title,
        message: preview.message,
        clientName: booking.clientName,
      },
    });

    return NextResponse.json({ booking: updated });
  } catch (err) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return NextResponse.json({ error: "Ese horario ya fue reservado. Elegí otro." }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "No pudimos reagendar la reserva" }, { status: 500 });
  }
}
