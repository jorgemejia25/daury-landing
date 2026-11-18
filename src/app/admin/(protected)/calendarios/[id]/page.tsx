import { notFound } from "next/navigation";
import { requireAdminSession } from "@/features/admin/server/session";
import { CalendarFormPage } from "@/features/admin/components/organisms/workspace/CalendarsPage";

export const metadata = { title: "Editar calendario" };

export default async function CalendarRoute({ params }: PageProps<"/admin/calendarios/[id]">) {
  await requireAdminSession();
  const { id } = await params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id)) notFound();
  return <CalendarFormPage id={id} />;
}
