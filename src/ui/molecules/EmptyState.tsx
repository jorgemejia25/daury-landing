import type { ReactNode } from "react";
import { IconTile } from "@/ui/atoms/IconTile";
import type { Tone } from "@/ui/lib/tones";
import styles from "./EmptyState.styles";

type EmptyStateProps = {
  icon: ReactNode;
  tone?: Tone;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
};

/** Estado vacío: tile, título en Bricolage, texto y acción opcional. */
export function EmptyState({ icon, tone = "neutral", title, children, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <IconTile tone={tone} size={56}>{icon}</IconTile>
      <h2 className={styles.title}>{title}</h2>
      {children ? <p className={styles.text}>{children}</p> : null}
      {action}
    </div>
  );
}
