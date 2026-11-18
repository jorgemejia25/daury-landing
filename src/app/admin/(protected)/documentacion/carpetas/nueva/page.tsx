import { requireAdminSession } from "@/features/admin/server/session";
import { FolderPage } from "@/features/admin/components/organisms/workspace/FolderPage";

export const metadata = { title: "Nueva carpeta" };

export default async function NewFolderRoute({ searchParams }: PageProps<"/admin/documentacion/carpetas/nueva">) {
  await requireAdminSession();
  const parent = (await searchParams).parent;
  return <FolderPage parentId={typeof parent === "string" && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(parent) ? parent : undefined} />;
}
