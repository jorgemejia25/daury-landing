import { notFound } from "next/navigation";
import { requireAdminSession } from "@/features/admin/server/session";
import { WhiteboardFormPage } from "@/features/admin/components/organisms/workspace/Brainstorm";

export const metadata = { title: "Editar pizarra" };

export default async function WhiteboardRoute({ params }: PageProps<"/admin/brainstorm/[id]">) {
  await requireAdminSession();
  const { id } = await params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id)) notFound();
  return <WhiteboardFormPage id={id} />;
}
