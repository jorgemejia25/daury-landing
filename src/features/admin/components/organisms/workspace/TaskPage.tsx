"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, SquareKanban } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { Skeleton } from "@/ui/atoms/Skeleton";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { useWorkspace, useWorkspaceDocument } from "@/features/admin/hooks/useWorkspace";
import { taskHref } from "@/features/admin/lib/routes";
import { TaskForm } from "../editors/TaskForm";
import { toggleArchive, WorkspaceStatus } from "./WorkspaceParts";


type TaskPageProps = { id?: string; boardId?: string; status?: string };

/** Página de una tarea (o de una tarea nueva) dentro del shell, con anterior y siguiente del mismo tablero. */
export function TaskPage({ id, boardId, status }: TaskPageProps) {
  const router = useRouter();
  const boards = useWorkspace("boards"), pages = useWorkspace("wikiPages");
  const current = useWorkspaceDocument("tasks", id ?? null);
  const task = current.item;
  const board = boards.items.find((item) => item.id === (task?.boardId ?? boardId)) ?? boards.items.find((item) => !item.archived);
  const siblings = useWorkspace("tasks", "boardId", board?.id);
  const boardHref = board ? `/admin/kanban?board=${board.id}` : "/admin/kanban";

  if (boards.loading || current.loading || (id && siblings.loading)) {
    return (
      <div role="status" aria-label="Cargando tarea"  className={"flex! flex-col! [gap:16px]!"}>
        <Skeleton height={64} radius={24} />
        <Skeleton height={44} width="50%" />
        <Skeleton height={300} radius={24} />
      </div>
    );
  }
  if (boards.error || current.error) return <WorkspaceStatus loading={false} errors={[boards.error, current.error]} />;
  if ((id && !task) || !board) {
    return (
      <EmptyState
        icon={<SquareKanban size={26} strokeWidth={2} />}
        tone="violet"
        title={id ? "Esta tarea no existe" : "Primero crea un tablero"}
        action={<Button variant="secondary" render={<Link href="/admin/kanban" />}>Ir a los tableros</Button>}
      >
        {id ? "Puede que se haya archivado o que el enlace esté incompleto." : "Las tareas viven dentro de un tablero."}
      </EmptyState>
    );
  }

  const order = (status: string) => board.columnOrder.indexOf(status);
  const list = siblings.items.filter((item) => !item.archived).toSorted((a, b) => order(a.status) - order(b.status) || b.createdAt.localeCompare(a.createdAt));
  const index = task ? list.findIndex((item) => item.id === task.id) : -1;

  return (
    <TaskForm
      key={task?.id ?? "new"}
      initial={task ?? undefined}
      boards={boards.items}
      pages={pages.items}
      defaults={{ boardId: board.id, status: status ?? board.columnOrder[0] }}
      nav={
        task && index >= 0
          ? {
              noun: "tarea",
              index: index + 1,
              total: list.length,
              onPrevious: index > 0 ? () => router.replace(taskHref(list[index - 1].id)) : undefined,
              onNext: index < list.length - 1 ? () => router.replace(taskHref(list[index + 1].id)) : undefined,
            }
          : undefined
      }
      actions={
        task ? (
          <ActionMenu
            label="Opciones de la tarea"
            onAction={async (value) => {
              if (value !== "archive") return;
              const error = await toggleArchive("tasks", task);
              if (!error) router.push(boardHref);
            }}
            actions={[{ value: "archive", label: "Archivar tarea", icon: <Archive size={17} strokeWidth={2} aria-hidden="true" />, danger: true }]}
          />
        ) : undefined
      }
      onClose={() => router.push(boardHref)}
      onSaved={(savedId) => { if (!task) router.replace(taskHref(savedId)); }}
    />
  );
}
