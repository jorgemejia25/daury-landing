"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SquareKanban } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { boardHref } from "@/features/admin/lib/routes";
import { BoardForm } from "../editors/BoardForm";
import { WorkspaceStatus } from "./WorkspaceParts";

/** Página para crear o configurar un tablero (nombre, color y columnas). */
export function BoardPage({ id }: { id?: string }) {
  const router = useRouter();
  const boards = useWorkspace("boards");
  const board = id ? boards.items.find((item) => item.id === id) : undefined;
  if (boards.loading || boards.error) return <WorkspaceStatus loading={boards.loading} errors={[boards.error]} />;
  if (id && (!board || board.archived)) {
    return (
      <EmptyState icon={<SquareKanban size={24} aria-hidden="true" />} tone="violet" title={board?.archived ? "Este tablero está archivado" : "Este tablero no existe"} action={<Button variant="secondary" render={<Link href={boardHref()} />}>Ir a los tableros</Button>}>
        Restáuralo desde los tableros archivados o revisa el enlace.
      </EmptyState>
    );
  }
  return <BoardForm key={board?.id ?? "new"} initial={board} onClose={() => router.push(boardHref(board?.id))} onSaved={(savedId) => router.push(boardHref(savedId))} />;
}
