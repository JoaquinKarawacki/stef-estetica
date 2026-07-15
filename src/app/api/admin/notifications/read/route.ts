import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin-auth";

export async function POST() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await prisma.notification.updateMany({
    where: { read: false },
    data: { read: true },
  });

  return NextResponse.json({ ok: true });
}
