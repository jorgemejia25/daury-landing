"use client";

import { TabsList, TabsTab } from "@ui-sdk/react/tabs";
import type { ComponentProps, ReactNode } from "react";
import styles from "./SegmentedTabs.styles";

/**
 * Segmento de opciones (ToggleSelector de la app): pista bg-2 con radio 16
 * y la opción activa en blanco con sombra suave. Va dentro de `<Tabs>`.
 */
export function SegmentedTabs({
  label,
  options,
}: {
  label: string;
  options: { value: string; label: string; icon?: ReactNode }[];
}) {
  return (
    <TabsList className={styles.track} aria-label={label}>
      {options.map((option) => (
        <SegmentedTab key={option.value} value={option.value}>
          {option.icon}
          {option.label}
        </SegmentedTab>
      ))}
    </TabsList>
  );
}

function SegmentedTab(props: ComponentProps<typeof TabsTab>) {
  return <TabsTab {...props} className={styles.tab} />;
}
