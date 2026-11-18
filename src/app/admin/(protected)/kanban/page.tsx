import { requireAdminSession } from "@/features/admin/server/session";
import { BoardWorkspace } from "@/features/admin/components/organisms/workspace/BoardWorkspace";
export const metadata = { title: "Tableros" };
export default async function KanbanPage() { await requireAdminSession(); return <BoardWorkspace />; }
