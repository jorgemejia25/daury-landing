import type { Metadata } from "next";
import { requireAdminSession } from "@/features/admin/server/session";
import { KnowledgePage } from "@/features/admin/components/templates/KnowledgePage";
import { ProductOverview } from "@/features/admin/components/organisms/knowledge/ProductOverview";

export const metadata: Metadata = { title: "Sobre Daury", description: "Qué es Daury, para quién, qué hace la app, sus planes y el modelo con clínicas." };

export default async function ProductPage() {
  await requireAdminSession();
  return (
    <KnowledgePage
      title="Sobre Daury"
      subtitle="Propósito, personas usuarias, funciones, planes y modelo con clínicas."
      hero={{
        title: "Cuidar es más fácil cuando no lo haces sola",
        lede: "Daury organiza el cuidado en casa: recordatorios con voz, guías paso a paso, el círculo de la familia y un resumen para el médico. Hecho en Guatemala, en español, para Latinoamérica.",
        chips: ["App móvil para familias", "Funciona sin internet", "Planes para médicos y clínicas"],
      }}
    >
      <ProductOverview />
    </KnowledgePage>
  );
}
