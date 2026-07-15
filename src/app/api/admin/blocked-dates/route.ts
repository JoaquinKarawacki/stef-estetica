import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin-auth";
import { montevideoDateTime } from "@/lib/timezone";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [rules, blockedDates] = await Promise.all([
    prisma.availabilityRule.findMany({ orderBy: { weekday: "asc" } }),
    prisma.blockedDate.findMany({ orderBy: { date: "asc" } }),
  ]);

  return NextResponse.json({ rules, blockedDates });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const dateParam = typeof body?.date === "string" ? body.date : null;
  if (!dateParam) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }

  const date = montevideoDateTime(dateParam);

  const existing = await prisma.blockedDate.findUnique({ where: { date } });

  if (existing) {
    await prisma.blockedDate.delete({ where: { id: existing.id } });
    return NextResponse.json({ blocked: false });
  }

  await prisma.blockedDate.create({ data: { date, reason: body?.reason || "Bloqueado por la esteticista" } });
  return NextResponse.json({ blocked: true });
}
