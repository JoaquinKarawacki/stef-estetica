import { NextRequest, NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { combineDateAndTime } from "@/lib/availability";
import { generateBookingCode } from "@/lib/booking-code";
import { createBookingSchema } from "@/lib/validation";
import { buildWhatsappPreview } from "@/lib/whatsapp-preview";
import { BUSINESS_HOURS } from "@/lib/constants";
import { montevideoDateTime, toMontevideoFields } from "@/lib/timezone";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createBookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { serviceId, date, time, clientName, clientPhone, clientEmail, note } = parsed.data;

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 404 });
  }

  const day = montevideoDateTime(date);
  const start = combineDateAndTime(day, time);
  const end = addMinutes(start, service.durationMin);

  if (start.getTime() < Date.now()) {
    return NextResponse.json({ error: "Ese horario ya pasó" }, { status: 409 });
  }

  const hours = BUSINESS_HOURS[toMontevideoFields(start).getUTCDay()];
  if (!hours) {
    return NextResponse.json({ error: "No atendemos ese día" }, { status: 409 });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const overlapping = await tx.booking.findMany({
        where: {
          status: { notIn: ["cancelled"] },
          date: { lt: end },
        },
        select: { date: true, durationMin: true },
      });

      const collides = overlapping.some((b) => {
        const bEnd = addMinutes(b.date, b.durationMin);
        return start < bEnd && b.date < end;
      });

      if (collides) {
        throw new Error("SLOT_TAKEN");
      }

      return tx.booking.create({
        data: {
          code: generateBookingCode(),
          serviceId: service.id,
          date: start,
          durationMin: service.durationMin,
          clientName,
          clientPhone,
          clientEmail: clientEmail || undefined,
          note: note || undefined,
          status: "confirmed",
        },
      });
    });

    const preview = buildWhatsappPreview({
      type: "new_booking",
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      serviceName: service.name,
      date: booking.date,
    });

    // TODO: conectar API WhatsApp/Twilio/Email para enviar la notificación real a Stef.
    await prisma.notification.create({
      data: {
        bookingId: booking.id,
        type: "new_booking",
        title: preview.title,
        message: preview.message,
        clientName: booking.clientName,
      },
    });

    return NextResponse.json({
      booking: {
        code: booking.code,
        date: booking.date,
        durationMin: booking.durationMin,
        serviceName: service.name,
        clientName: booking.clientName,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return NextResponse.json(
        { error: "Ese horario ya fue reservado. Elegí otro." },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "No pudimos crear la reserva" }, { status: 500 });
  }
}
