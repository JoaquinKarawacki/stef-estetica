import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^0?9\d{7}$/, "Ingresá un celular uruguayo válido (ej: 099123456)");

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Elegí un servicio"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Horario inválido"),
  clientName: z.string().trim().min(2, "Ingresá tu nombre completo").max(80),
  clientPhone: phoneSchema,
  clientEmail: z.union([z.literal(""), z.string().trim().email()]).optional(),
  note: z.string().trim().max(300).optional(),
});

export const rescheduleSchema = z.object({
  bookingId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

export const cancelSchema = z.object({
  bookingId: z.string().min(1),
});

export const lookupSchema = z.object({
  query: z.string().trim().min(3),
});
