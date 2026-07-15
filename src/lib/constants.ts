export const BRAND = {
  name: "Stef Valdez",
  tagline: "Estética Integral",
  phoneDisplay: "094 995 931",
  phoneRaw: "59894995931",
  whatsappUrl: "https://wa.me/59894995931",
  address: "Paysandú 1833, Cordón, Montevideo, Uruguay 11200",
  addressShort: "Paysandú 1833, Cordón",
  professional: "Stef Valdez",
  slogans: [
    "Sentite libre, cómoda y segura en tu piel",
    "Es tu momento — Agenda abierta",
    "Reservá tu turno y asegurá tu lugar",
  ],
  payments: ["Mercado Pago", "Transferencia", "Efectivo"],
} as const;

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "stefvaldez";
export const ADMIN_COOKIE_NAME = "sv_admin_session";

export const CATEGORY_LABELS: Record<string, string> = {
  facial: "Facial",
  corporal: "Corporal",
  depilacion: "Depilación láser",
};

export const BUSINESS_HOURS: Record<number, { start: string; end: string } | null> = {
  0: null, // domingo — cerrado
  1: { start: "09:00", end: "19:00" },
  2: { start: "09:00", end: "19:00" },
  3: { start: "09:00", end: "19:00" },
  4: { start: "09:00", end: "19:00" },
  5: { start: "09:00", end: "19:00" },
  6: { start: "09:00", end: "13:00" },
};

export const HOURS_DISPLAY = [
  { label: "Lunes a viernes", value: "9:00 a 19:00" },
  { label: "Sábados", value: "9:00 a 13:00" },
  { label: "Domingos", value: "Cerrado" },
];

export const SLOT_STEP_MIN = 30;
