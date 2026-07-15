import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/site/logo";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata = {
  title: "Reservá tu turno — Stef Valdez Estética Integral",
};

export default async function ReservarPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string }>;
}) {
  const { servicio } = await searchParams;

  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-noise min-h-screen bg-cream-100 pt-10 pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Logo showTagline={false} markClassName="h-9 w-9" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-ink-700/55 hover:text-burgundy-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </Link>
        </div>

        <div className="mt-12">
          <BookingWizard services={services} initialServiceSlug={servicio} />
        </div>
      </div>
    </div>
  );
}
