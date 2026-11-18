"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible";
import { ChevronDown } from "lucide-react";
import { adminGroups, adminHref } from "@/features/admin/lib/navigation";
import { AdminIcon } from "@/features/admin/components/atoms/AdminIcon";
import { NavLink } from "@/features/admin/components/molecules/NavLink";
import { DocsTree } from "./DocsTree";
import styles from "./AdminNav.styles";

const DOCS = "documentacion";

export function AdminNav({ onNavigate, label = "Navegación del admin", compact = false }: { onNavigate?: () => void; label?: string; compact?: boolean }) {
  const pathname = usePathname();
  const inDocs = pathname === adminHref(DOCS) || pathname.startsWith(`${adminHref(DOCS)}/`) || pathname.startsWith("/admin/articulos/");
  const [docsOpen, setDocsOpen] = useState(inDocs);
  return (
    <nav className={styles.nav} aria-label={label} data-compact={compact || undefined}>
      {adminGroups.map((group) => (
        <div key={group.label}>
          <p className={compact ? "sr-only" : styles.group}>{group.label}</p>
          <ul className={`m-0 p-0 list-none ${styles.list}`}>
            {group.items.map((entry) => {
              const link = (
                <NavLink
                  href={adminHref(entry.slug)}
                  icon={<AdminIcon name={entry.icon} />}
                  active={entry.slug === DOCS ? inDocs : entry.slug ? pathname === adminHref(entry.slug) || pathname.startsWith(`${adminHref(entry.slug)}/`) : pathname === adminHref(entry.slug)}
                  onNavigate={onNavigate}
                  compact={compact}
                >
                  {entry.title}
                </NavLink>
              );
              if (entry.slug !== DOCS || compact) return <li key={entry.slug}>{link}</li>;
              return (
                <li key={entry.slug}>
                  <Collapsible open={docsOpen} onOpenChange={setDocsOpen}>
                    <div className={styles.branch}>
                      {link}
                      <CollapsibleTrigger className={styles.toggle} aria-label={docsOpen ? "Ocultar documentos" : "Mostrar documentos"}>
                        <ChevronDown size={18} strokeWidth={2.2} aria-hidden="true" />
                      </CollapsibleTrigger>
                    </div>
                    <CollapsiblePanel>
                      <DocsTree onNavigate={onNavigate} />
                    </CollapsiblePanel>
                  </Collapsible>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
