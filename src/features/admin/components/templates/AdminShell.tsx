"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { IconButton } from "@/ui/atoms/IconButton";
import { TabBar } from "@/ui/organisms/TabBar";
import { TopBar } from "@/ui/organisms/TopBar";
import { adminEntries, adminHref } from "@/features/admin/lib/navigation";
import type { AdminUser } from "@/features/admin/lib/access";
import { useAdminSession } from "@/features/admin/hooks/useAdminSession";
import { AdminIcon } from "@/features/admin/components/atoms/AdminIcon";
import { BrandLink } from "@/features/admin/components/molecules/BrandLink";
import { AdminNav } from "@/features/admin/components/organisms/AdminNav";
import { SessionPanel } from "@/features/admin/components/organisms/SessionPanel";
import { SearchDialog } from "@/features/admin/components/organisms/SearchDialog";
import { MobileMenu } from "@/features/admin/components/organisms/MobileMenu";
import { ThemeSwitch } from "@/features/admin/components/molecules/ThemeSwitch";
import { SIDEBAR_COOKIE, type Theme } from "@/features/admin/lib/preferences";
import "@/features/admin/lib/agent";
import styles from "./AdminShell.styles";

/** Pestañas de la barra inferior en móvil (como la tab bar de la app). */
const tabSlugs = ["", "documentacion", "kanban", "calendarios"];
const tabLabels: Record<string, string> = { "": "Inicio", documentacion: "Docs", kanban: "Kanban", calendarios: "Agenda" };

/**
 * Plantilla del admin: sidebar fijo en escritorio, barra superior con búsqueda,
 * y en móvil panel lateral + barra de pestañas inferior.
 */
export function AdminShell({
  children,
  user,
  initialCollapsed = false,
  theme = "system",
}: {
  children: React.ReactNode;
  user: AdminUser;
  /** Estado inicial del sidebar, leído de la cookie en el servidor. */
  initialCollapsed?: boolean;
  /** Tema elegido (cookie), para marcar el selector sin desajustes de hidratación. */
  theme?: Theme;
}) {
  const { error, logout } = useAdminSession(user.uid);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${SIDEBAR_COOKIE}=${next ? "collapsed" : "expanded"}; path=/admin; max-age=31536000; samesite=lax`;
  }
  const pathname = usePathname();
  const current =
    adminEntries.find((entry) => adminHref(entry.slug) === pathname) ??
    adminEntries.find((entry) => entry.slug && pathname.startsWith(`${adminHref(entry.slug)}/`)) ??
    (pathname.startsWith("/admin/articulos/") ? adminEntries.find((entry) => entry.slug === "documentacion") : undefined);

  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 961px)");
    const closeOnDesktop = () => {
      if (breakpoint.matches) setMenuOpen(false);
    };
    breakpoint.addEventListener("change", closeOnDesktop);
    return () => breakpoint.removeEventListener("change", closeOnDesktop);
  }, []);

  const tabs = tabSlugs.map((slug) => {
    const entry = adminEntries.find((item) => item.slug === slug)!;
    const href = adminHref(slug);
    return {
      href,
      label: tabLabels[slug],
      icon: <AdminIcon name={entry.icon} size={24} />,
      active: slug === "" ? pathname === href : pathname.startsWith(href),
    };
  });

  return (
    <div className={styles.shell} data-collapsed={collapsed || undefined}>
      <a className={"absolute left-[16px] top-[-100px] z-[200] px-[18px] py-[12px] rounded-full bg-ink text-canvas font-bold no-underline focus:top-[16px]"} href="#admin-content">Saltar al contenido</a>
      <aside className={styles.sidebar} aria-label="Barra lateral">
        <div className={styles.sidebarHead}>
          <BrandLink compact={collapsed} />
          <IconButton
            variant="plain"
            className={styles.collapse}
            aria-label={collapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            aria-expanded={!collapsed}
            onClick={toggleSidebar}
          >
            {collapsed ? <PanelLeftOpen size={18} strokeWidth={2} aria-hidden="true" /> : <PanelLeftClose size={18} strokeWidth={2} aria-hidden="true" />}
          </IconButton>
        </div>
        <AdminNav compact={collapsed} />
        <SessionPanel user={user} logout={logout} compact={collapsed} />
      </aside>
      <div className={styles.workspace}>
        <TopBar
          left={<MobileMenu open={menuOpen} onOpenChange={setMenuOpen} user={user} logout={logout} />}
          center={
            <>
              <Link href="/admin" className={styles.crumbRoot}>Daury Admin</Link>
              <ChevronRight className={styles.crumbSep} size={14} strokeWidth={2.2} aria-hidden="true" />
              <span className={styles.crumbCurrent}>{current?.title ?? (pathname.startsWith("/admin/articulos/") ? "Artículo" : "Página no encontrada")}</span>
            </>
          }
          right={<><SearchDialog /><ThemeSwitch initial={theme} /></>}
        />
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        <main id="admin-content" className={styles.main} tabIndex={-1}>
          {children}
        </main>
      </div>
      <TabBar items={tabs} label="Pestañas del admin" />
    </div>
  );
}
