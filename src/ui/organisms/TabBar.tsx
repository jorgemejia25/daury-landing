import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./TabBar.styles";

export type TabBarItem = { href: string; label: string; icon: ReactNode; active: boolean };

/**
 * Barra de pestañas inferior de la app: blanca translúcida con una píldora
 * azul suave en la pestaña activa. Visible solo en pantallas pequeñas.
 */
export function TabBar({ items, label }: { items: TabBarItem[]; label: string }) {
  return (
    <nav className={styles.bar} aria-label={label}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={styles.tab}
          aria-current={item.active ? "page" : undefined}
        >
          <span className={styles.pill}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
