import { requireAdminSession } from "@/features/admin/server/session";
import { BrainstormWorkspace } from "@/features/admin/components/organisms/workspace/Brainstorm";
export const metadata = { title: "Brainstorm" };
export default async function BrainstormPage() { await requireAdminSession(); return <BrainstormWorkspace />; }
