import type { Metadata } from "next";
import { requireAdminSession } from "@/features/admin/server/session";
import { BrandGuide } from "@/features/admin/components/templates/BrandGuide";

export const metadata: Metadata = {
  title: "Identidad y diseño",
  description: "Guía de marca de Daury: logo, color, tipografía, componentes, formatos, mascota y tono.",
};

export default async function DesignPage() {
  await requireAdminSession();
  return <BrandGuide />;
}
