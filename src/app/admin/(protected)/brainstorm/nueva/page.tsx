import { requireAdminSession } from "@/features/admin/server/session";
import { WhiteboardFormPage } from "@/features/admin/components/organisms/workspace/Brainstorm";
export const metadata = { title: "Nueva pizarra" };
export default async function NewWhiteboardRoute() { await requireAdminSession(); return <WhiteboardFormPage />; }
