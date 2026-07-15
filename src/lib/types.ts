import type { Booking, Service } from "@/generated/prisma/client";

export type BookingWithService = Booking & { service: Service };
