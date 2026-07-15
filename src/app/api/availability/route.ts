import { NextRequest, NextResponse } from "next/server";
import { addDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/availability";
import { montevideoDateTime } from "@/lib/timezone";

export async function GET(request: NextRequest) {
  const serviceId = request.nextUrl.searchParams.get("serviceId");
  const dateParam = request.nextUrl.searchParams.get("date");

  if (!serviceId || !dateParam) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
  }

  const day = montevideoDateTime(dateParam);
  if (Number.isNaN(day.getTime())) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }
  const nextDay = addDays(day, 1);

  const [bookings, blocked] = await Promise.all([
    prisma.booking.findMany({
      where: {
        date: { gte: day, lt: nextDay },
        status: { notIn: ["cancelled"] },
      },
      select: { date: true, durationMin: true },
    }),
    prisma.blockedDate.findFirst({
      where: { date: { gte: day, lt: nextDay } },
    }),
  ]);

  const slots = getAvailableSlots({
    day,
    durationMin: service.durationMin,
    existingBookings: bookings,
    isBlocked: Boolean(blocked),
  });

  return NextResponse.json({ slots, blockedReason: blocked?.reason ?? null });
}
