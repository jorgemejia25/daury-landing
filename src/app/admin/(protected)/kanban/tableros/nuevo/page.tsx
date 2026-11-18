import { requireAdminSession } from "@/features/admin/server/session";
import { BoardPage } from "@/features/admin/components/organisms/workspace/BoardPage";

export const metadata = { title: "Nuevo tablero" };

export default async function NewBoardRoute() {
  await requireAdminSession();
  return <BoardPage />;
}
