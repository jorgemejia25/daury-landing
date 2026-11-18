"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import { brandTabs, type BrandTab } from "@/features/admin/lib/brand";
import styles from "./BrandGuide.styles";

const DEFAULT_TAB: BrandTab = "esencial";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const readHash = () => window.location.hash.slice(1);

function toTab(hash: string): BrandTab {
  return brandTabs.some((tab) => tab.value === hash) ? (hash as BrandTab) : DEFAULT_TAB;
}

/**
 * Pestañas por público. La pestaña activa vive en el hash (#mascota, #redes…),
 * así cada persona recibe un enlace directo a su parte y los enlaces internos
 * cambian de pestaña sin JavaScript adicional.
 */
export function BrandTabs({ panels }: { panels: Record<BrandTab, ReactNode> }) {
  const value = toTab(useSyncExternalStore(subscribe, readHash, () => ""));
  const root = useRef<HTMLDivElement>(null);
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    // Al cambiar de pestaña desde abajo, vuelve al inicio de la guía.
    const anchor = root.current;
    if (anchor && anchor.getBoundingClientRect().top < 0) anchor.scrollIntoView({ block: "start" });
  }, [value]);

  function select(next: unknown) {
    const tab = toTab(String(next));
    if (tab === value) return;
    window.location.hash = tab;
  }

  return (
    <Tabs value={value} onValueChange={select}>
      <div ref={root} className="scroll-mt-[calc(var(--topbar-h)+8px)]" aria-hidden="true" />
      <div className={styles.tabbar}>
        <TabsList className={styles.tabList} aria-label="Partes de la guía">
          {brandTabs.map((tab) => (
            <TabsTab key={tab.value} value={tab.value} className={styles.tab}>
              <b>{tab.label}</b>
              <span>{tab.hint}</span>
            </TabsTab>
          ))}
        </TabsList>
      </div>
      {brandTabs.map((tab) => (
        <TabsPanel key={tab.value} value={tab.value} className={styles.panel}>
          {panels[tab.value]}
        </TabsPanel>
      ))}
    </Tabs>
  );
}
