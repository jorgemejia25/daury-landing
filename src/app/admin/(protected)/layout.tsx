import { cookies } from "next/headers";
import { AdminShell } from "@/features/admin/components/templates/AdminShell";
import { parseTheme, SIDEBAR_COOKIE, THEME_COOKIE } from "@/features/admin/lib/preferences";
import { requireAdminSession } from "@/features/admin/server/session";

export default async function ProtectedAdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdminSession();
  const store = await cookies();
  const collapsed = store.get(SIDEBAR_COOKIE)?.value === "collapsed";
  const theme = parseTheme(store.get(THEME_COOKIE)?.value);
  return (
    <AdminShell user={user} initialCollapsed={collapsed} theme={theme}>
      {children}
    </AdminShell>
  );
}
