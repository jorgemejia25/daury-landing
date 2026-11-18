import { notFound } from "next/navigation";
import { requireAdminSession } from "@/features/admin/server/session";
import { FolderPage } from "@/features/admin/components/organisms/workspace/FolderPage";

export const metadata = { title: "Editar carpeta" };

export default async function FolderRoute({ params }: PageProps<"/admin/documentacion/carpetas/[id]">) {
  await requireAdminSession();
  const { id } = await params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id)) notFound();
  return <FolderPage id={id} />;
}
