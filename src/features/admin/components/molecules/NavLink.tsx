import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./NavLink.styles";

type NavLinkProps = {
  href: string;
  icon: ReactNode;
  active: boolean;
  /** Sidebar contraído: solo el icono, con la etiqueta como tooltip. */
  compact?: boolean;
  onNavigate?: () => void;
  children: string;
};

/** Elemento de navegación lateral: píldora azul suave y texto azul cuando está activo (tab bar de la app). */
export function NavLink({ href, icon, active, compact = false, onNavigate, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={styles.link}
      data-compact={compact || undefined}
      data-tip={compact ? children : undefined}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      {icon}
      <span className={compact ? "sr-only" : styles.label}>{children}</span>
    </Link>
  );
}
