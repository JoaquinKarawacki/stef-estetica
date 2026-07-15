"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Clave incorrecta");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-noise flex min-h-screen items-center justify-center bg-cream-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[2rem] border border-ink-700/[0.06] bg-cream-50 p-8 text-center shadow-[0_30px_80px_-40px_rgba(74,47,52,0.35)]"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blush-100">
          <LogoMark className="h-9 w-9" />
        </div>
        <h1 className="mt-5 font-display text-2xl text-ink-900">Panel Stef Valdez</h1>
        <p className="mt-1.5 text-sm text-ink-700/55">Ingresá la clave para continuar.</p>

        <div className="mt-6 text-left">
          <Label htmlFor="password">Clave de acceso</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-700/30" />
            <Input
              id="password"
              type="password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-xl bg-burgundy-500/10 px-4 py-2.5 text-sm text-burgundy-400">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ingresar"}
        </Button>
      </form>
    </div>
  );
}
