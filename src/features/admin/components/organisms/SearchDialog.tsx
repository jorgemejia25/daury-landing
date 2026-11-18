"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@ui-sdk/react/dialog";
import { Search } from "lucide-react";
import { Kbd } from "@/ui/atoms/Kbd";
import { IconTile } from "@/ui/atoms/IconTile";
import { Card } from "@/ui/molecules/Card";
import { ListRow } from "@/ui/molecules/ListRow";
import { SearchField } from "@/ui/molecules/SearchField";
import { Modal } from "@/ui/organisms/Modal";
import { normalizeText } from "@/features/admin/lib/text";
import { adminHref, sectionPages } from "@/features/admin/lib/navigation";
import { entryTone } from "@/features/admin/lib/presentation";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { AdminIcon } from "@/features/admin/components/atoms/AdminIcon";
import styles from "./SearchDialog.styles";

/** Búsqueda de páginas (⌘K / Ctrl+K). */
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const cloud = useWorkspace("wikiPages");
  const entries = [...sectionPages.filter((page) => !cloud.items.some((item) => item.id === page.slug)), ...cloud.items.filter((page) => !page.archived).map((page) => ({ slug: `articulos/${page.id}`, title: page.title, description: page.description, icon: "book", status: "ready" }))];
  const results = entries.filter((page) =>
    normalizeText(`${page.slug} ${page.title} ${page.description}`).includes(normalizeText(query)),
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={styles.trigger}>
        <Search size={16} strokeWidth={2.2} aria-hidden="true" />
        <span className={styles.triggerLabel}>Buscar en el admin</span>
        <span className={styles.shortcut}><Kbd hidden>⌘ K</Kbd></span>
      </DialogTrigger>
      <Modal title="Buscar páginas" closeLabel="Cerrar búsqueda" keepMounted initialFocus="#admin-search-input">
        <SearchField
          id="admin-search-input"
          name="admin-search"
          size="lg"
          className={styles.field}
          aria-label="Buscar por título o descripción"
          autoComplete="off"
          placeholder="Prueba con diseño, producto…"
          value={query}
          onValueChange={setQuery}
        />
        <p className={styles.count} aria-live="polite">
          {results.length} {results.length === 1 ? "página encontrada" : "páginas encontradas"}
        </p>
        {results.length ? (
          <Card padding="none" tone="warm" as="ul" className={"m-0 p-0 list-none"}>
            {results.map((page, index) => (
              <li key={page.slug}>
                <ListRow
                  href={adminHref(page.slug)}
                  onClick={() => setOpen(false)}
                  divider={index > 0}
                  leading={<IconTile tone={entryTone(page.slug)} size={40}><AdminIcon name={page.icon} size={20} /></IconTile>}
                  title={page.title}
                  subtitle={page.description}
                />
              </li>
            ))}
          </Card>
        ) : (
          <p className={styles.empty}>No hay páginas con ese término. Prueba otra palabra.</p>
        )}
        <div className={styles.footer}>
          <span>Busca por título o descripción</span>
          <span><Kbd>esc</Kbd> para cerrar</span>
        </div>
      </Modal>
    </Dialog>
  );
}
