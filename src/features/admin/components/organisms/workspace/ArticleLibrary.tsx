"use client";

import Link from "next/link";
import { useState } from "react";
import { Button as SdkButton } from "@ui-sdk/react/button";
import { Archive, ArchiveRestore, ChevronRight, FileText, Folder, FolderPlus, LayoutGrid, Pencil, Plus, Rows3 } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { IconTile } from "@/ui/atoms/IconTile";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { ScreenHeader } from "@/ui/molecules/ScreenHeader";
import { SearchField } from "@/ui/molecules/SearchField";
import { SelectField } from "@/ui/molecules/SelectField";
import type { Tone } from "@/ui/lib/tones";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import { formatDate, localDate } from "@/features/admin/lib/dates";
import { personName } from "@/features/admin/lib/people";
import { editFolderHref, newFolderHref } from "@/features/admin/lib/routes";
import { normalizeText } from "@/features/admin/lib/text";
import { folderPath, type Entity } from "@/features/admin/lib/workspace";
import { newArticleHref } from "./ArticleEditorPage";
import { toggleArchive, WorkspaceStatus } from "./WorkspaceParts";
import styles from "./Library.styles";

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** Biblioteca de documentación: alcance, búsqueda y orden en una barra; carpetas en mosaico y documentos en tabla o tarjetas. */
export function ArticleLibrary() {
  const pages = useWorkspace("wikiPages"), folders = useWorkspace("folders");
  const { params, update } = useAdminQuery();
  const selected = params.get("folder") === "root" ? "" : params.get("folder") ?? "*";
  const archived = params.get("archived") === "yes";
  const search = params.get("q") ?? "", sort = params.get("sort") === "title" ? "title" : "recent";
  const layout = params.get("view") === "grid" ? "grid" : "list";
  const [actionError, setActionError] = useState("");
  const folder = folders.items.find((item) => item.id === selected);
  const needle = normalizeText(search);
  const activePages = pages.items.filter((page) => !page.archived);
  const activeFolders = folders.items.filter((item) => !item.archived);
  const archivedCount = pages.items.length - activePages.length + folders.items.length - activeFolders.length;
  const childFolders = folders.items
    .filter((item) => item.archived === archived && (archived || (selected !== "" && (needle && selected === "*" ? true : item.parentId === (folder?.id ?? "")))))
    .filter((item) => normalizeText(item.name).includes(needle))
    .toSorted((a, b) => a.name.localeCompare(b.name, "es"));
  const articles = pages.items
    .filter((page) => page.archived === archived && (selected === "*" || page.folderId === selected))
    .filter((page) => normalizeText(`${page.title} ${page.description} ${page.tags.join(" ")}`).includes(needle))
    .toSorted((a, b) => (sort === "title" ? a.title.localeCompare(b.title, "es") : b.updatedAt.localeCompare(a.updatedAt)));
  const countIn = (id: string) => activePages.filter((page) => page.folderId === id).length;
  const subfolders = (id: string) => activeFolders.filter((entry) => entry.parentId === id).length;
  const path: Entity<"folders">[] = [];
  for (let current = folder; current && path.length < 12; current = folders.items.find((item) => item.id === current!.parentId)) path.unshift(current);
  const updated = (iso: string) => (localDate(iso) === localDate(new Date()) ? "Hoy" : formatDate(localDate(iso), { day: "numeric", month: "short" }));
  const switchLocation = (value: string | null, archive = false) => update({ folder: value, archived: archive ? "yes" : null, q: null });
  const scope = archived ? "archived" : selected === "*" ? "all" : selected === "" ? "root" : "folder";
  const location = archived ? "Archivados" : folder?.name ?? (selected === "" ? "Sin carpeta" : "Todos los documentos");
  const folderOf = (page: Entity<"wikiPages">) => folders.items.find((item) => item.id === page.folderId);
  const restoreArticle = async (page: Entity<"wikiPages">) => setActionError(await toggleArchive("wikiPages", page));

  const scopes = [
    { id: "all", label: "Todos", count: activePages.length, onClick: () => switchLocation(null) },
    { id: "root", label: "Sin carpeta", count: countIn(""), onClick: () => switchLocation("root") },
    { id: "archived", label: "Archivados", count: archivedCount, onClick: () => switchLocation(null, true) },
  ];

  return (
    <section className={styles.library} aria-label="Biblioteca de documentación">
      <ScreenHeader
        title="Documentación"
        subtitle={`${plural(activePages.length, "documento", "documentos")} en ${plural(activeFolders.length, "carpeta", "carpetas")}. El conocimiento del equipo, en un solo lugar.`}
        right={
          <div className={styles.actions}>
            <Button variant="secondary" disabled={archived} icon={<FolderPlus size={16} aria-hidden="true" />} render={archived ? undefined : <Link href={newFolderHref(folder?.id)} />}>Nueva carpeta</Button>
            <Button disabled={archived} icon={<Plus size={17} strokeWidth={2.4} aria-hidden="true" />} render={<Link href={newArticleHref(folder?.id)} />}>Nuevo artículo</Button>
          </div>
        }
      />
      <WorkspaceStatus loading={pages.loading || folders.loading} errors={[pages.error, folders.error, actionError]} />

      <div className={styles.toolbar}>
        <nav className={styles.scopes} aria-label="Vistas de documentación">
          {scopes.map((item) => (
            <button key={item.id} type="button" className={styles.scope} aria-current={scope === item.id ? "page" : undefined} onClick={item.onClick}>
              {item.label}
              <span className={styles.scopeCount}>{item.count}</span>
            </button>
          ))}
        </nav>
        <div className={styles.tools}>
          <SearchField size="sm" className={styles.search} aria-label="Buscar artículos y carpetas" placeholder="Buscar documentos y carpetas…" value={search} onValueChange={(value) => update({ q: value || null })} />
          <SelectField label="Ordenar documentos" hideLabel size="compact" value={sort} fallback="recent" options={[{ value: "recent", label: "Más recientes" }, { value: "title", label: "Título: A–Z" }]} onChange={(value) => update({ sort: value === "recent" ? null : value })} />
          <div className={styles.layout} role="group" aria-label="Presentación de documentos">
            <button type="button" aria-pressed={layout === "list"} aria-label="Ver como lista" title="Lista" onClick={() => update({ view: null })}><Rows3 size={16} aria-hidden="true" /></button>
            <button type="button" aria-pressed={layout === "grid"} aria-label="Ver como tarjetas" title="Tarjetas" onClick={() => update({ view: "grid" })}><LayoutGrid size={16} aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      <div className={styles.location}>
        <div className={styles.locationText}>
          {folder ? (
            <nav aria-label="Ubicación" className={styles.crumbs}>
              <button type="button" onClick={() => switchLocation(null)}>Documentación</button>
              {path.map((item) => (
                <span key={item.id}>
                  <ChevronRight size={13} aria-hidden="true" />
                  <button type="button" aria-current={item.id === folder.id ? "page" : undefined} onClick={() => switchLocation(item.id)}>{item.name}</button>
                </span>
              ))}
            </nav>
          ) : null}
          <h2>
            {folder ? <span className={styles.locationDot} data-tone={folder.color} aria-hidden="true" /> : null}
            {location}
          </h2>
          <p>
            {plural(articles.length, "documento", "documentos")}
            {childFolders.length ? ` · ${plural(childFolders.length, "carpeta", "carpetas")}` : ""}
            {search ? ` para “${search}”` : ""}
          </p>
        </div>
        {folder ? (
          <div className={styles.folderActions}>
            {!folder.archived ? <Button variant="secondary" size="sm" icon={<Pencil size={14} aria-hidden="true" />} render={<Link href={editFolderHref(folder.id)} />}>Editar carpeta</Button> : null}
            <ActionMenu
              label={`Opciones de ${folder.name}`}
              onAction={async (value) => { if (value === "archive") setActionError(await toggleArchive("folders", folder)); }}
              actions={[{ value: "archive", label: folder.archived ? "Restaurar carpeta" : "Archivar carpeta", icon: folder.archived ? <ArchiveRestore size={16} aria-hidden="true" /> : <Archive size={16} aria-hidden="true" />, danger: !folder.archived }]}
            />
          </div>
        ) : null}
      </div>

      {childFolders.length ? (
        <section className={styles.section} aria-labelledby="library-folders">
          <h3 id="library-folders" className={styles.sectionTitle}>Carpetas <span>{childFolders.length}</span></h3>
          <ul className={`m-0 p-0 list-none ${styles.folderGrid}`}>
            {childFolders.map((item) => (
              <li key={item.id} className={styles.folder}>
                <SdkButton className={styles.folderOpen} aria-label={`Abrir carpeta ${item.name}`} disabled={item.archived} onClick={() => switchLocation(item.id)}>
                  <IconTile tone={item.color as Tone} size={36}><Folder size={18} aria-hidden="true" /></IconTile>
                  <span className={styles.folderText}>
                    <b>{item.name}</b>
                    <small>{plural(countIn(item.id), "documento", "documentos")}{subfolders(item.id) ? ` · ${plural(subfolders(item.id), "subcarpeta", "subcarpetas")}` : ""}</small>
                  </span>
                  <ChevronRight size={16} className={styles.chevron} aria-hidden="true" />
                </SdkButton>
                {item.archived ? <Button variant="secondary" size="sm" className={styles.restore} onClick={async () => setActionError(await toggleArchive("folders", item))}>Restaurar</Button> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.section} aria-labelledby="library-documents">
        <h3 id="library-documents" className={styles.sectionTitle}>Documentos <span>{articles.length}</span></h3>
        {articles.length ? (
          layout === "list" ? (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Documento</th>
                    <th scope="col" className={styles.colFolder}>Carpeta</th>
                    <th scope="col" className={styles.colTags}>Etiquetas</th>
                    <th scope="col" className={styles.colAuthor}>Creado por</th>
                    <th scope="col" className={styles.colDate}>Actualizado</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((page) => {
                    const parent = folderOf(page);
                    return (
                      <tr key={page.id}>
                        <td>
                          <div className={styles.docCell}>
                            <span className={styles.docIcon} aria-hidden="true"><FileText size={16} /></span>
                            <span className={styles.docText}>
                              <Link href={`/admin/articulos/${page.id}`} className={styles.docLink}>{page.title}</Link>
                              {page.description ? <small>{page.description}</small> : null}
                            </span>
                            {page.archived ? (
                              <Button variant="secondary" size="sm" icon={<ArchiveRestore size={14} aria-hidden="true" />} onClick={() => restoreArticle(page)}>Restaurar</Button>
                            ) : null}
                          </div>
                        </td>
                        <td className={styles.colFolder}>
                          {parent ? (
                            <span className={styles.folderChip}><span className={styles.locationDot} data-tone={parent.color} aria-hidden="true" />{folderPath(folders.items, parent.id)}</span>
                          ) : <span className={styles.muted}>—</span>}
                        </td>
                        <td className={styles.colTags}>
                          <span className={styles.tags}>
                            {page.tags.slice(0, 2).map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
                            {page.tags.length > 2 ? <span className={styles.tagMore}>+{page.tags.length - 2}</span> : null}
                            {!page.tags.length ? <span className={styles.muted}>—</span> : null}
                          </span>
                        </td>
                        <td className={styles.colAuthor}>
                          <span className={styles.person}><Avatar size={22} name={personName(page.createdBy)} tone="violet" />{personName(page.createdBy)}</span>
                        </td>
                        <td className={styles.colDate}><time dateTime={page.updatedAt}>{updated(page.updatedAt)}</time></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <ul className={`m-0 p-0 list-none ${styles.cardGrid}`}>
              {articles.map((page) => {
                const parent = folderOf(page);
                return (
                  <li key={page.id} className={styles.card} data-tone={parent?.color ?? "neutral"}>
                    <Link href={`/admin/articulos/${page.id}`} className={styles.cardLink}>
                      <span className={styles.cardFolder}>
                        <Folder size={13} aria-hidden="true" />
                        {parent ? folderPath(folders.items, parent.id) : "Sin carpeta"}
                      </span>
                      <span className={styles.cardTitle}>{page.title}</span>
                      {page.description ? <span className={styles.cardDescription}>{page.description}</span> : null}
                      {page.tags.length ? (
                        <span className={styles.tags}>
                          {page.tags.slice(0, 3).map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
                          {page.tags.length > 3 ? <span className={styles.tagMore}>+{page.tags.length - 3}</span> : null}
                        </span>
                      ) : null}
                      <span className={styles.cardFooter}>
                        <span className={styles.person}><Avatar size={22} name={personName(page.createdBy)} tone="violet" />{personName(page.createdBy)}</span>
                        <time dateTime={page.updatedAt}>{updated(page.updatedAt)}</time>
                      </span>
                    </Link>
                    {page.archived ? (
                      <div className={styles.cardRestore}>
                        <Button variant="secondary" size="sm" icon={<ArchiveRestore size={14} aria-hidden="true" />} onClick={() => restoreArticle(page)}>Restaurar artículo</Button>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )
        ) : !pages.loading ? (
          <div className={styles.empty}>
            <EmptyState
              icon={<FileText size={24} aria-hidden="true" />}
              tone="blue"
              title={search ? "No hay documentos con esta búsqueda" : archived ? "No hay documentos archivados" : "Esta carpeta está lista para tus documentos"}
              action={!archived && !search ? <Button variant="secondary" render={<Link href={newArticleHref(folder?.id)} />}>Crear un artículo</Button> : undefined}
            >
              {search ? "Prueba otro título o etiqueta." : archived ? "Los documentos que archives aparecerán aquí." : "Escribe un artículo o importa un archivo Markdown."}
            </EmptyState>
          </div>
        ) : null}
      </section>
    </section>
  );
}
