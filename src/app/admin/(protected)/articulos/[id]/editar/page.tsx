import type { Metadata } from "next";
import { requireAdminSession } from "@/features/admin/server/session";
import { ArticleEditorPage } from "@/features/admin/components/organisms/workspace/ArticleEditorPage";

export const metadata: Metadata = { title: "Editar artículo" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  return <ArticleEditorPage id={id} />;
}
