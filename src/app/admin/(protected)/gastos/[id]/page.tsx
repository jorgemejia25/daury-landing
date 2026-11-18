import { requireAdminSession } from "@/features/admin/server/session";
import { FinanceEditorPage } from "@/features/admin/components/organisms/finance/FinanceEditor";
export const metadata = { title: "Editar movimiento" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { await requireAdminSession(); const { id } = await params; return <FinanceEditorPage id={id} />; }
