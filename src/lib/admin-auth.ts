import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "./constants";

const SESSION_VALUE = "authenticated";

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value === SESSION_VALUE;
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
}
