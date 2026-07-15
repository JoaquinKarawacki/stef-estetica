"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookingCard } from "@/components/mis-turnos/booking-card";
import type { BookingWithService } from "@/lib/types";

export default function MisTurnosPage() {
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState<BookingWithService[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function runSearch(q: string) {
    if (q.trim().length < 3) {
      setError("Ingresá tu celular o el código de reserva (ej: SV-7F3K2).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookings/lookup?query=${encodeURIComponent(q.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No pudimos buscar tus turnos.");
        setBookings(null);
      } else {
        setBookings(
          data.bookings.map((b: BookingWithService) => ({ ...b, date: new Date(b.date) }))
        );
      }
    } catch {
      setError("No pudimos conectar con el servidor.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  function handleChanged() {
    toast.success("Listo, tu turno se actualizó.");
    runSearch(query);
  }

  return (
    <div className="bg-noise min-h-screen bg-cream-100 pt-10 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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

        <div className="mt-12 text-center">
          <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">Mis turnos</h1>
          <p className="mt-3 text-[15px] text-ink-700/60">
            Ingresá tu celular o tu código de reserva para ver, reagendar o cancelar tus turnos.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query);
          }}
          className="mx-auto mt-8 flex max-w-md gap-2"
        >
          <Input
            placeholder="099 123 456 o SV-7F3K2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" disabled={loading} className="shrink-0">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Buscar
          </Button>
        </form>

        {error && (
          <p className="mx-auto mt-4 max-w-md rounded-xl bg-burgundy-500/10 px-4 py-2.5 text-center text-sm text-burgundy-400">
            {error}
          </p>
        )}

        {searched && !error && bookings && bookings.length === 0 && (
          <p className="mt-10 text-center text-sm text-ink-700/50">
            No encontramos turnos con esos datos.
          </p>
        )}

        {bookings && bookings.length > 0 && (
          <div className="mt-10 space-y-3">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} onChanged={handleChanged} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
