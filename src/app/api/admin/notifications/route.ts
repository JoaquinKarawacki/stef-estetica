import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const after = request.nextUrl.searchParams.get("after");

  const notifications = await prisma.notification.findMany({
    where: after ? { createdAt: { gt: new Date(after) } } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ notifications });
}
