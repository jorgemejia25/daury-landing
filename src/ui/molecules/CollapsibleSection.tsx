"use client";

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { IconTile } from "@/ui/atoms/IconTile";
import type { Tone } from "@/ui/lib/tones";
import styles from "./CollapsibleSection.styles";

type CollapsibleSectionProps = {
  title: string;
  /** Resumen corto a la derecha del título ("3 columnas", "2 de 5"). */
  summary?: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
  defaultOpen?: boolean;
  children: ReactNode;
};

/** Sección plegable en tarjeta: tile, título, resumen y chevron; el contenido aparece al abrir. */
export function CollapsibleSection({ title, summary, icon, tone = "neutral", defaultOpen = false, children }: CollapsibleSectionProps) {
  return (
    <Collapsible className={styles.section} defaultOpen={defaultOpen}>
      <CollapsibleTrigger className={styles.trigger}>
        {icon ? <IconTile tone={tone} size={36}>{icon}</IconTile> : null}
        <span className={styles.title}>{title}</span>
        {summary ? <span className={styles.summary}>{summary}</span> : null}
        <ChevronDown className={styles.chevron} size={20} strokeWidth={2.2} aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsiblePanel className={styles.panel}>{children}</CollapsiblePanel>
    </Collapsible>
  );
}
