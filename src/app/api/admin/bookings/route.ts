import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    include: { service: true },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ bookings });
}
