"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { EmptyState } from "@/ui/molecules/EmptyState";

export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      icon={<TriangleAlert size={26} strokeWidth={2} />}
      tone="coral"
      title="No se pudo cargar esta página"
      action={
        <Button variant="primary" size="lg" onClick={() => retry()}>
          Intentar de nuevo
        </Button>
      }
    >
      Revisa tu conexión o el contenido del archivo e inténtalo otra vez.
    </EmptyState>
  );
}
