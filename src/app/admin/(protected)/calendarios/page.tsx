import { requireAdminSession } from "@/features/admin/server/session";
import { localDate } from "@/features/admin/lib/dates";
import { CalendarWorkspace } from "@/features/admin/components/organisms/workspace/CalendarWorkspace";
export const metadata = { title: "Calendarios" };
export default async function CalendarsPage() { await requireAdminSession(); return <CalendarWorkspace today={localDate(new Date())} />; }
