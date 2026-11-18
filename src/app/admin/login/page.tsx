import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/features/admin/server/session";
import { LoginPanel } from "@/features/admin/components/organisms/LoginPanel";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <LoginPanel />;
}
