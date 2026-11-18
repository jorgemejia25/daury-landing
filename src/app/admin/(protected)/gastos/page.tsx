import { requireAdminSession } from "@/features/admin/server/session";
import { FinanceWorkspace } from "@/features/admin/components/organisms/finance/FinanceWorkspace";
export const metadata = { title: "Gastos e ingresos" };
export default async function Page() { await requireAdminSession(); return <FinanceWorkspace />; }
