import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { EmptyState } from "@/ui/molecules/EmptyState";

export default function AdminNotFound() {
  return (
    <main  className={"[min-height:100dvh]! grid! place-items-center! [padding:24px]!"}>
      <EmptyState
        icon={<FileQuestion size={26} strokeWidth={2} />}
        tone="blue"
        title="Página no encontrada"
        action={
          <Button variant="primary" size="lg" render={<Link href="/admin" />}>
            Volver al inicio
          </Button>
        }
      >
        Busca el documento desde el menú o vuelve al inicio del admin.
      </EmptyState>
    </main>
  );
}
