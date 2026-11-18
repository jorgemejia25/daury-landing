import type { Metadata } from "next";
import { requireAdminSession } from "@/features/admin/server/session";
import { TaskPage } from "@/features/admin/components/organisms/workspace/TaskPage";

export const metadata: Metadata = { title: "Nueva tarea" };

export default async function NewTaskPage({ searchParams }: PageProps<"/admin/kanban/tareas/nueva">) {
  await requireAdminSession();
  const { board, estado } = await searchParams;
  return <TaskPage boardId={typeof board === "string" ? board : undefined} status={typeof estado === "string" ? estado : undefined} />;
}
