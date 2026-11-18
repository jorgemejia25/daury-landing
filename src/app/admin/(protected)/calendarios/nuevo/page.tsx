import { requireAdminSession } from "@/features/admin/server/session";
import { CalendarFormPage } from "@/features/admin/components/organisms/workspace/CalendarsPage";

export const metadata = { title: "Nuevo calendario" };

export default async function NewCalendarRoute() {
  await requireAdminSession();
  return <CalendarFormPage />;
}
