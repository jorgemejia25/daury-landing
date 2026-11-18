import { notFound } from "next/navigation";
import { requireAdminSession } from "@/features/admin/server/session";
import { BoardPage } from "@/features/admin/components/organisms/workspace/BoardPage";

export const metadata = { title: "Configurar tablero" };

export default async function BoardRoute({ params }: PageProps<"/admin/kanban/tableros/[id]">) {
  await requireAdminSession();
  const { id } = await params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id)) notFound();
  return <BoardPage id={id} />;
}
