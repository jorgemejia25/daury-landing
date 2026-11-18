import { requireAdminSession } from "@/features/admin/server/session";
import { ArticleLibrary } from "@/features/admin/components/organisms/workspace/ArticleLibrary";
export const metadata = { title: "Artículos" };
export default async function DocumentationPage() { await requireAdminSession(); return <ArticleLibrary />; }
