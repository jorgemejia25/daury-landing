import Link from "next/link";
import type { ReactNode } from "react";
import { IconTile } from "@/ui/atoms/IconTile";
import type { Tone } from "@/ui/lib/tones";
import styles from "./StatTile.styles";

type StatTileProps = { label: string; value: ReactNode; note?: ReactNode; icon: ReactNode; tone?: Tone; href?: string; alert?: boolean };

/** Cifra destacada: tile de color, número grande en Bricolage y una nota corta. */
export function StatTile({ label, value, note, icon, tone = "blue", href, alert }: StatTileProps) {
  const body = (
    <>
      <IconTile tone={tone} size={40}>{icon}</IconTile>
      <span className={styles.label}>{label}</span>
      <span className={styles.value} data-alert={alert || undefined}>{value}</span>
      {note ? <span className={styles.note}>{note}</span> : null}
    </>
  );
  return href ? <Link href={href} className={styles.tile}>{body}</Link> : <div className={styles.tile}>{body}</div>;
}
