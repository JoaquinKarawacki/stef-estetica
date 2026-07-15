import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ error: "Ingresá tu teléfono o código de reserva" }, { status: 400 });
  }

  const normalizedPhone = query.replace(/\D/g, "");
  const isCode = /^mm-/i.test(query);

  const bookings = await prisma.booking.findMany({
    where: isCode
      ? { code: { equals: query.toUpperCase() } }
      : { clientPhone: { contains: normalizedPhone } },
    include: { service: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ bookings });
}
