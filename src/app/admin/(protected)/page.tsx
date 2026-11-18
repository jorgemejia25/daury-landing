import { requireAdminSession } from "@/features/admin/server/session";
import { formatDate, localDate } from "@/features/admin/lib/dates";
import { AdminHome } from "@/features/admin/components/templates/AdminHome";

export default async function AdminHomePage() {
  const user = await requireAdminSession();
  const today = localDate(new Date());
  return (
    <AdminHome
      firstName={user.name.split(/\s+/)[0]}
      email={user.email}
      today={today}
      todayLabel={formatDate(today, { weekday: "long", day: "numeric", month: "long" })}
    />
  );
}
