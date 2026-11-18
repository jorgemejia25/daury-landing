import { requireAdminSession } from "@/features/admin/server/session";
import { CalendarsManagePage } from "@/features/admin/components/organisms/workspace/CalendarsPage";

export const metadata = { title: "Administrar calendarios" };

export default async function ManageCalendarsRoute() {
  await requireAdminSession();
  return <CalendarsManagePage />;
}
