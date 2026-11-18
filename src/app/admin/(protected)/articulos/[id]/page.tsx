import { notFound } from "next/navigation";
import { requireAdminSession } from "@/features/admin/server/session";
import { CloudArticle } from "@/features/admin/components/organisms/workspace/CloudArticle";
export const metadata = { title: "Artículo" };
export default async function ArticlePage({ params }: PageProps<"/admin/articulos/[id]">) { await requireAdminSession(); const { id } = await params; if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id)) notFound(); return <CloudArticle id={id} />; }
