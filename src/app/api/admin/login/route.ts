import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASSWORD } from "@/lib/constants";
import { setAdminSession } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
