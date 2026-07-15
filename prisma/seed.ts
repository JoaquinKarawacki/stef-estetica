import "dotenv/config";
import { addDays } from "date-fns";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import { generateBookingCode } from "../src/lib/booking-code";
import { buildWhatsappPreview } from "../src/lib/whatsapp-preview";
import { montevideoDateTime, toMontevideoFields, toMontevideoDateStr, todayInMontevideo } from "../src/lib/timezone";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const services = [
  {
    slug: "laser-rostro",
    name: "Depilación Láser Rostro",
    category: "depilacion",
    description:
      "Olvidate del vello en bozo, mentón y patillas. Resultados duraderos con sesiones rápidas y seguras.",
    benefits: "Resultados duraderos,Sesiones rápidas y seguras,Resultados visibles desde las primeras sesiones,Piel suave y pareja",
    durationMin: 20,
    price: 690,
    priceLabel: "Desde $690",
    icon: "sparkles",
    featured: false,
    order: 1,
  },
  {
    slug: "laser-axilas",
    name: "Depilación Láser Axilas",
    category: "depilacion",
    description:
      "Piel suave y sin irritación en la zona más sensible. Tecnología de última generación, menos dolor y más confort.",
    benefits: "Menos dolor más confort,Resultados progresivos y duraderos,Piel suave y sin vello,Sesiones rápidas",
    durationMin: 15,
    price: 590,
    priceLabel: "Desde $590",
    icon: "zap",
    featured: false,
    order: 2,
  },
  {
    slug: "combo-cavado-axilas-tira-cola",
    name: "Combo Cavado Completo + Tira de Cola + Axilas",
    category: "depilacion",
    description:
      "El combo más elegido: cavado completo, tira de cola y axilas en una sola promo. Cupos limitados.",
    benefits: "Cavado completo,Tira de cola,Axilas,Cupos limitados",
    durationMin: 45,
    price: 2390,
    priceLabel: "$2.390",
    icon: "flower",
    featured: true,
    order: 3,
  },
  {
    slug: "combo-pierna-axilas-bozo",
    name: "Combo Pierna Entera + Axilas + Bozo",
    category: "depilacion",
    description:
      "Pierna entera, axilas y bozo en una sola promo especial. Resultados visibles desde las primeras sesiones.",
    benefits: "Pierna entera,Axilas,Bozo,Resultados visibles desde las primeras sesiones",
    durationMin: 45,
    price: 2390,
    priceLabel: "$2.390",
    icon: "waves",
    featured: true,
    order: 4,
  },
  {
    slug: "laser-cuerpo-entero",
    name: "Depilación Láser Cuerpo Entero",
    category: "depilacion",
    description:
      "6 sesiones de depilación definitiva de cuerpo entero al mejor precio. Ideal para empezar tu tratamiento completo.",
    benefits: "6 sesiones incluidas,Cuerpo entero,Ahorro vs. sesiones sueltas,Cupos limitados",
    durationMin: 60,
    price: 14000,
    priceLabel: "6 sesiones por $14.000",
    icon: "gift",
    featured: false,
    order: 5,
  },
  {
    slug: "limpieza-facial",
    name: "Limpieza Facial Profunda",
    category: "facial",
    description:
      "Limpieza profunda + hidratación para renovar tu piel, eliminar impurezas y devolverle su luminosidad natural.",
    benefits: "Limpieza profunda,Hidratación,Piel renovada,Apto todo tipo de piel",
    durationMin: 60,
    price: 1800,
    priceLabel: "$1.800",
    icon: "droplet",
    featured: false,
    order: 6,
  },
  {
    slug: "modelacion-corporal",
    name: "Modelación Corporal",
    category: "corporal",
    description:
      "Reduce celulitis, reafirma la piel y activa el drenaje linfático para resultados visibles y duraderos.",
    benefits: "Reduce celulitis,Reafirma la piel,Modelación corporal,Drenaje linfático",
    durationMin: 45,
    price: 2200,
    priceLabel: "$2.200 / sesión",
    icon: "activity",
    featured: false,
    order: 7,
  },
];

function nextBookableDate(baseOffsetDays: number, hour: number, minute: number) {
  let d = addDays(todayInMontevideo(), baseOffsetDays);
  if (toMontevideoFields(d).getUTCDay() === 0) d = addDays(d, 1); // domingo cerrado -> corre a lunes
  const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return montevideoDateTime(toMontevideoDateStr(d), time);
}

async function main() {
  console.log("Limpiando datos existentes...");
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.blockedDate.deleteMany();

  console.log("Creando servicios...");
  const created: Record<string, string> = {};
  for (const s of services) {
    const service = await prisma.service.create({ data: s });
    created[s.slug] = service.id;
  }

  console.log("Creando reglas de disponibilidad...");
  const weekdayHours: [number, string, string][] = [
    [1, "09:00", "19:00"],
    [2, "09:00", "19:00"],
    [3, "09:00", "19:00"],
    [4, "09:00", "19:00"],
    [5, "09:00", "19:00"],
    [6, "09:00", "13:00"],
  ];
  for (const [weekday, startTime, endTime] of weekdayHours) {
    await prisma.availabilityRule.create({
      data: { weekday, startTime, endTime, active: true },
    });
  }

  console.log("Creando reservas de ejemplo...");
  const bookings = [
    {
      serviceSlug: "limpieza-facial",
      date: nextBookableDate(0, 10, 0),
      clientName: "Ana Ramírez",
      clientPhone: "099123456",
      clientEmail: "ana.ramirez@gmail.com",
      note: "Primera vez, piel sensible.",
      status: "confirmed",
    },
    {
      serviceSlug: "modelacion-corporal",
      date: nextBookableDate(0, 15, 0),
      clientName: "Lucía Fernández",
      clientPhone: "098234567",
      status: "confirmed",
    },
    {
      serviceSlug: "laser-rostro",
      date: nextBookableDate(1, 11, 0),
      clientName: "Valentina Souza",
      clientPhone: "097345678",
      note: "Vino por promo de Instagram.",
      status: "confirmed",
    },
    {
      serviceSlug: "laser-axilas",
      date: nextBookableDate(1, 16, 30),
      clientName: "Camila Rodríguez",
      clientPhone: "096456789",
      status: "confirmed",
    },
    {
      serviceSlug: "combo-cavado-axilas-tira-cola",
      date: nextBookableDate(2, 9, 30),
      clientName: "Sofía Pereira",
      clientPhone: "095567890",
      status: "confirmed",
    },
    {
      serviceSlug: "laser-cuerpo-entero",
      date: nextBookableDate(2, 14, 0),
      clientName: "Martina Silva",
      clientPhone: "094678901",
      note: "Primera sesión del combo de 6.",
      status: "confirmed",
    },
    {
      serviceSlug: "combo-pierna-axilas-bozo",
      date: nextBookableDate(3, 10, 30),
      clientName: "Guadalupe Acosta",
      clientPhone: "093789012",
      status: "cancelled",
    },
    {
      serviceSlug: "limpieza-facial",
      date: nextBookableDate(3, 17, 0),
      clientName: "Florencia Gómez",
      clientPhone: "092890123",
      status: "confirmed",
    },
    {
      serviceSlug: "laser-rostro",
      date: nextBookableDate(-1, 12, 0),
      clientName: "Rocío Ibarra",
      clientPhone: "091901234",
      status: "completed",
    },
    {
      serviceSlug: "laser-axilas",
      date: nextBookableDate(4, 11, 30),
      clientName: "Daniela Castro",
      clientPhone: "090012345",
      note: "Reagendó por trabajo.",
      status: "rescheduled",
    },
    {
      serviceSlug: "modelacion-corporal",
      date: nextBookableDate(5, 10, 0),
      clientName: "Micaela Correa",
      clientPhone: "099888777",
      status: "confirmed",
    },
  ];

  for (const b of bookings) {
    const service = services.find((s) => s.slug === b.serviceSlug)!;
    const booking = await prisma.booking.create({
      data: {
        code: generateBookingCode(),
        serviceId: created[b.serviceSlug],
        date: b.date,
        durationMin: service.durationMin,
        clientName: b.clientName,
        clientPhone: b.clientPhone,
        clientEmail: "clientEmail" in b ? (b as { clientEmail?: string }).clientEmail : undefined,
        note: "note" in b ? (b as { note?: string }).note : undefined,
        status: b.status,
      },
    });

    const notifType =
      b.status === "cancelled" ? "cancelled" : b.status === "rescheduled" ? "rescheduled" : "new_booking";
    const preview = buildWhatsappPreview({
      type: notifType,
      clientName: b.clientName,
      clientPhone: b.clientPhone,
      serviceName: service.name,
      date: b.date,
    });

    await prisma.notification.create({
      data: {
        bookingId: booking.id,
        type: notifType,
        title: preview.title,
        message: preview.message,
        clientName: b.clientName,
        read: true,
      },
    });
  }

  console.log(`Listo: ${services.length} servicios, ${bookings.length} reservas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
