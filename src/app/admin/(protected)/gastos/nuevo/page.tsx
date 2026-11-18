import { requireAdminSession } from "@/features/admin/server/session";
import { FinanceEditorPage } from "@/features/admin/components/organisms/finance/FinanceEditor";
export const metadata = { title: "Nuevo movimiento" };
export default async function Page() { await requireAdminSession(); return <FinanceEditorPage />; }
