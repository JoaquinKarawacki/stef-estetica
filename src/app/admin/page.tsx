import { isAdminAuthed } from "@/lib/admin-auth";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = {
  title: "Panel Stef Valdez — Admin",
};

export default async function AdminPage() {
  const authed = await isAdminAuthed();
  return authed ? <AdminDashboard /> : <AdminLogin />;
}
