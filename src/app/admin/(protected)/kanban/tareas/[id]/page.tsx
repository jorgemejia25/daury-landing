import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/features/admin/server/session";
import { TaskPage } from "@/features/admin/components/organisms/workspace/TaskPage";

export const metadata: Metadata = { title: "Tarea" };

export default async function TaskRoute({ params }: PageProps<"/admin/kanban/tareas/[id]">) {
  await requireAdminSession();
  const { id } = await params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id)) notFound();
  return <TaskPage id={id} />;
}
