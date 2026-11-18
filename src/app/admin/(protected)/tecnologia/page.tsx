import type { Metadata } from "next";
import { requireAdminSession } from "@/features/admin/server/session";
import { KnowledgePage } from "@/features/admin/components/templates/KnowledgePage";
import { TechnologyOverview } from "@/features/admin/components/organisms/knowledge/TechnologyOverview";

export const metadata: Metadata = { title: "Tecnología", description: "Arquitectura del backend, la app y el admin de Daury." };

export default async function TechnologyPage() {
  await requireAdminSession();
  return (
    <KnowledgePage
      title="Tecnología"
      subtitle="Arquitectura del backend, la app móvil y las herramientas del proyecto."
      hero={{
        title: "Arquitectura de Daury",
        lede: "La app debe funcionar sin conexión. Ese requisito define cómo se guardan los datos en el teléfono, cómo se envían al servidor y cómo se comparten con la familia y, más adelante, con el médico.",
        chips: ["Fase 1 de 6 terminada", "Go + PostgreSQL 17", "App en Expo con base local"],
      }}
    >
      <TechnologyOverview />
    </KnowledgePage>
  );
}
