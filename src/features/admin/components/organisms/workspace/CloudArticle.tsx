"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MarkdownPreview } from "../editors/markdown/MarkdownPreview";
import { Archive, ArchiveRestore, ChevronRight, Folder, Pencil } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { useWorkspace, useWorkspaceDocument } from "@/features/admin/hooks/useWorkspace";
import { formatDate, localDate } from "@/features/admin/lib/dates";
import { collectHeadings } from "@/features/admin/lib/markdown-editor";
import { personName } from "@/features/admin/lib/people";
import { libraryHref } from "@/features/admin/lib/routes";
import type { Entity } from "@/features/admin/lib/workspace";
import { editArticleHref } from "./ArticleEditorPage";
import { toggleArchive, WorkspaceStatus } from "./WorkspaceParts";
import styles from "./Article.styles";

/** Artículo de la documentación: lectura a la izquierda; propiedades e índice en un panel lateral fijo. */
export function CloudArticle({ id }: { id: string }) {
  const page = useWorkspaceDocument("wikiPages", id), content = useWorkspaceDocument("wikiContent", id), folders = useWorkspace("folders");
  const [actionError, setActionError] = useState("");
  const item = page.item;
  const body = content.item?.body ?? "";
  const headings = useMemo(() => collectHeadings(body).filter((heading) => heading.level <= 3), [body]);
  const prefix = `article-content-${id}`;
  const path: Entity<"folders">[] = [];
  for (let current = item ? folders.items.find((entry) => entry.id === item.folderId) : undefined; current && path.length < 12; current = folders.items.find((entry) => entry.id === current!.parentId)) path.unshift(current);
  const folder = path.at(-1);
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const date = (iso: string) => formatDate(localDate(iso), { day: "numeric", month: "long", year: "numeric" });

  return (
    <article className={styles.article}>
      <nav className={styles.crumbs} aria-label="Ubicación">
        <Link href={libraryHref()}>Documentación</Link>
        {path.map((entry) => (
          <span key={entry.id}>
            <ChevronRight size={13} aria-hidden="true" />
            <Link href={libraryHref(entry.id)}>{entry.name}</Link>
          </span>
        ))}
      </nav>
      <WorkspaceStatus loading={page.loading || content.loading} errors={[page.error, content.error, folders.error, actionError]} />
      {item ? (
        <div className={styles.layout}>
          <div className={styles.main}>
            {item.archived ? <p className={styles.notice} role="status">Este artículo está archivado. Restáuralo para editarlo.</p> : null}
            <div className={styles.paper}>
              <header className={styles.header}>
                <h1 className={styles.title}>{item.title}</h1>
                {item.description ? <p className={styles.description}>{item.description}</p> : null}
                <div className={styles.byline}>
                  <Avatar name={personName(item.updatedBy)} size={28} tone="violet" />
                  <span>
                    <b>{personName(item.updatedBy)}</b>
                    <small>Actualizado el {date(item.updatedAt)} · {Math.max(1, Math.round(words / 220))} min de lectura</small>
                  </span>
                </div>
              </header>
              {content.item ? <MarkdownPreview body={body} embedded idPrefix={prefix} /> : null}
            </div>
          </div>

          <aside className={styles.aside} aria-label="Detalles del artículo">
            <div className={styles.asideActions}>
              {!item.archived && content.item ? (
                <Button fullWidth icon={<Pencil size={15} strokeWidth={2.2} aria-hidden="true" />} render={<Link href={editArticleHref(id)} />}>Editar artículo</Button>
              ) : null}
              <ActionMenu
                label="Opciones del artículo"
                onAction={async (value) => { if (value === "archive") setActionError(await toggleArchive("wikiPages", item)); }}
                actions={[{ value: "archive", label: item.archived ? "Restaurar artículo" : "Archivar artículo", icon: item.archived ? <ArchiveRestore size={16} strokeWidth={2} aria-hidden="true" /> : <Archive size={16} strokeWidth={2} aria-hidden="true" />, danger: !item.archived }]}
              />
            </div>

            <section className={styles.block} aria-labelledby="article-properties">
              <h2 id="article-properties">Propiedades</h2>
              <dl className={styles.props}>
                <div>
                  <dt>Carpeta</dt>
                  <dd>
                    {folder ? (
                      <Link href={libraryHref(folder.id)} className={styles.folder}>
                        <span className={styles.dot} data-tone={folder.color} aria-hidden="true" />
                        {folder.name}
                      </Link>
                    ) : <span className={styles.muted}><Folder size={13} aria-hidden="true" /> Sin carpeta</span>}
                  </dd>
                </div>
                <div>
                  <dt>Creado por</dt>
                  <dd><span className={styles.person}><Avatar name={personName(item.createdBy)} size={20} tone="violet" />{personName(item.createdBy)}</span></dd>
                </div>
                <div>
                  <dt>Creado</dt>
                  <dd>{formatDate(localDate(item.createdAt), { day: "numeric", month: "short", year: "numeric" })}</dd>
                </div>
                <div>
                  <dt>Versión</dt>
                  <dd className={styles.mono}>v{item.revision}</dd>
                </div>
                <div>
                  <dt>Extensión</dt>
                  <dd>{words.toLocaleString("es-GT")} palabras</dd>
                </div>
                {item.tags.length ? (
                  <div className={styles.tagRow}>
                    <dt>Etiquetas</dt>
                    <dd className={styles.tags}>{item.tags.map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}</dd>
                  </div>
                ) : null}
              </dl>
            </section>

            {headings.length > 1 ? (
              <nav className={styles.block} aria-labelledby="article-outline">
                <h2 id="article-outline">En este artículo</h2>
                <ol className={`m-0 p-0 list-none ${styles.outline}`}>
                  {headings.map((heading) => (
                    <li key={heading.id} data-level={heading.level}>
                      <a href={`#${prefix}-${heading.id}`}>{heading.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
          </aside>
        </div>
      ) : !page.loading && !page.error ? (
        <EmptyState icon={<Folder size={24} strokeWidth={2} />} tone="neutral" title="Este artículo no existe" action={<Button variant="secondary" render={<Link href={libraryHref()} />}>Volver a la documentación</Button>}>
          Puede que se haya movido o que el enlace esté incompleto.
        </EmptyState>
      ) : null}
    </article>
  );
}
