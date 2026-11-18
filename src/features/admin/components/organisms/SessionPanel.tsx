"use client";

import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { IconButton } from "@/ui/atoms/IconButton";
import { UserBadge } from "@/features/admin/components/molecules/UserBadge";
import type { AdminUser } from "@/features/admin/lib/access";
import styles from "./SessionPanel.styles";

type SessionPanelProps = { user: AdminUser; logout: () => Promise<void>; onNavigate?: () => void; compact?: boolean };

/** Pie del sidebar: enlace a la landing y tarjeta de la sesión con su botón de salida. */
export function SessionPanel({ user, logout, onNavigate, compact = false }: SessionPanelProps) {
  if (compact) {
    return (
      <div className={styles.panel} data-compact="">
        <Link href="/es" className={styles.iconLink} aria-label="Visitar la landing" data-tip="Visitar la landing">
          <ExternalLink size={17} strokeWidth={2} aria-hidden="true" />
        </Link>
        <span className={styles.avatar} title={`${user.name} · ${user.email}`}>
          <Avatar name={user.name} tone="violet" size={32} />
        </span>
        <IconButton variant="plain" className={styles.logout} aria-label="Cerrar sesión" onClick={logout}>
          <LogOut size={17} strokeWidth={2.2} aria-hidden="true" />
        </IconButton>
      </div>
    );
  }
  return (
    <div className={styles.panel}>
      <Link href="/es" className={styles.link} onClick={onNavigate}>
        <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
        <span>Visitar la landing</span>
      </Link>
      <div className={styles.card}>
        <UserBadge user={user} />
        <IconButton variant="plain" className={styles.logout} aria-label="Cerrar sesión" title="Cerrar sesión" onClick={logout}>
          <LogOut size={17} strokeWidth={2.2} aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}
