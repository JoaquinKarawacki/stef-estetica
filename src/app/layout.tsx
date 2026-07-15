import type { Metadata } from "next";
import { Cinzel, Great_Vibes, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Stef Valdez — Estética Integral",
  description:
    "Depilación láser y estética integral en Cordón, Montevideo. Sentite libre, cómoda y segura en tu piel. Reservá tu turno por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-UY"
      className={`${cinzel.variable} ${greatVibes.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream-100 text-ink-700">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-cream-50)",
              border: "1px solid var(--color-blush-500)",
              color: "var(--color-ink-700)",
            },
          }}
        />
      </body>
    </html>
  );
}
