import Link from "next/link";
import { AppLogo } from "@/ui/atoms/AppLogo";
import styles from "./BrandLink.styles";

/** Logo de la app enlazado al inicio del admin. Contraído, muestra solo el icono. */
export function BrandLink({ onNavigate, compact = false }: { onNavigate?: () => void; compact?: boolean }) {
  return (
    <Link href="/admin" className={styles.brand} aria-label="Daury Admin, inicio" onClick={onNavigate}>
      <AppLogo size={30} word={compact ? "" : "Daury"} />
      {compact ? null : <span className={styles.badge} aria-hidden="true">Admin</span>}
    </Link>
  );
}
