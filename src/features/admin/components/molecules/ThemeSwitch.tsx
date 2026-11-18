"use client";

import { useState } from "react";
import { Menu, MenuContent, MenuGroupLabel, MenuItemIndicator, MenuRadioGroup, MenuRadioItem, MenuTrigger } from "@ui-sdk/react/menu";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { iconButtonClass } from "@/ui/atoms/IconButton";
import { THEME_COOKIE, parseTheme, type Theme } from "@/features/admin/lib/preferences";
import styles from "./ThemeSwitch.styles";

const options = [{ value: "system", label: "Sistema", Icon: Monitor }, { value: "light", label: "Claro", Icon: Sun }, { value: "dark", label: "Oscuro", Icon: Moon }] as const;

export function ThemeSwitch({ initial = "system" }: { initial?: Theme }) {
  const [theme, setTheme] = useState<Theme>(initial);
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.value === theme)!;
  function choose(value: string | null) {
    const next = parseTheme(value ?? undefined);
    setTheme(next);
    if (next === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
    document.cookie = `${THEME_COOKIE}=${next}; path=/admin; max-age=31536000; samesite=lax`;
    setOpen(false);
  }
  return <Menu open={open} onOpenChange={setOpen}>
    <MenuTrigger className={iconButtonClass} data-variant="plain" aria-label="Cambiar tema" title={`Tema: ${current.label}`}><current.Icon size={20} aria-hidden="true" /></MenuTrigger>
    <MenuContent className={styles.popup} align="end" sideOffset={8}>
      <MenuRadioGroup value={theme} onValueChange={choose} aria-label="Tema de apariencia">
        <MenuGroupLabel className={styles.label}>Apariencia</MenuGroupLabel>
        {options.map(({ value, label, Icon }) => <MenuRadioItem className={styles.option} key={value} value={value}><Icon size={17} aria-hidden="true" /><span>{label}</span><MenuItemIndicator className={styles.indicator}><Check size={16} aria-hidden="true" /></MenuItemIndicator></MenuRadioItem>)}
      </MenuRadioGroup>
    </MenuContent>
  </Menu>;
}
