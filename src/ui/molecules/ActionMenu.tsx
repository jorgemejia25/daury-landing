"use client";

import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@ui-sdk/react/menu";
import { MoreHorizontal } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { iconButtonClass } from "@/ui/atoms/IconButton";
import styles from "./ActionMenu.styles";

export type MenuAction = { value: string; label: string; icon?: ReactNode; danger?: boolean; separatorBefore?: boolean; disabled?: boolean };

/** Menú de acciones secundarias detrás de un botón "más" (o un disparador propio). */
export function ActionMenu({ label, actions, onAction, trigger, size }: { label: string; actions: MenuAction[]; onAction: (value: string) => unknown; trigger?: ReactNode; size?: "sm" }) {
  return (
    <Menu onAction={(value) => onAction(value)}>
      <MenuTrigger className={trigger ? `${styles.textTrigger}${size === "sm" ? " min-h-[32px]! px-[10px]! text-[13px]! gap-[4px]!" : ""}` : iconButtonClass} data-variant={trigger ? undefined : "soft"} aria-label={trigger ? undefined : label}>
        {trigger ?? <MoreHorizontal size={20} strokeWidth={2.2} aria-hidden="true" />}
      </MenuTrigger>
      <MenuContent className={styles.content} align="end" sideOffset={6}>
        {actions.map((action) => (
          <Fragment key={action.value}>
            {action.separatorBefore ? <MenuSeparator className={styles.separator} /> : null}
            <MenuItem value={action.value} className={styles.item} data-danger={action.danger || undefined} disabled={action.disabled}>
              {action.icon}
              {action.label}
            </MenuItem>
          </Fragment>
        ))}
      </MenuContent>
    </Menu>
  );
}
