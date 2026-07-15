import { NextResponse } from "next/server";
import { addDays, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin-auth";
import { toMontevideoFields, todayInMontevideo } from "@/lib/timezone";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const todayStart = todayInMontevideo();
  const todayEnd = addDays(todayStart, 1);
  const daysSinceMonday = (toMontevideoFields(todayStart).getUTCDay() + 6) % 7;
  const weekStart = subDays(todayStart, daysSinceMonday);
  const weekEnd = addDays(weekStart, 7);

  const [todayCount, upcomingCount, cancelledCount, weekBookings] = await Promise.all([
    prisma.booking.count({
      where: { date: { gte: todayStart, lt: todayEnd }, status: { notIn: ["cancelled"] } },
    }),
    prisma.booking.count({
      where: { date: { gte: todayEnd }, status: { notIn: ["cancelled"] } },
    }),
    prisma.booking.count({ where: { status: "cancelled" } }),
    prisma.booking.findMany({
      where: {
        date: { gte: weekStart, lt: weekEnd },
        status: { notIn: ["cancelled"] },
      },
      include: { service: true },
    }),
  ]);

  const revenueThisWeek = weekBookings.reduce((sum, b) => sum + b.service.price, 0);

  return NextResponse.json({
    todayCount,
    upcomingCount,
    cancelledCount,
    revenueThisWeek,
    bookingsThisWeek: weekBookings.length,
  });
}
