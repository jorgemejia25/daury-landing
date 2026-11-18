import type { Metadata } from "next";
import { requireAdminSession } from "@/features/admin/server/session";
import { ArticleEditorPage } from "@/features/admin/components/organisms/workspace/ArticleEditorPage";

export const metadata: Metadata = { title: "Nuevo artículo" };
export default async function Page({ searchParams }: { searchParams: Promise<{ folder?: string }> }) {
  await requireAdminSession();
  const { folder } = await searchParams;
  return <ArticleEditorPage folderId={folder} />;
}
