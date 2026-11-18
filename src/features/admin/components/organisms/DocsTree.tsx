"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Tree, TreeGroup, TreeItem, TreeItemIndicator, TreeItemLabel, type TreeItemData } from "@ui-sdk/react/tree";
import { ChevronRight, FileText, Folder, FolderOpen } from "lucide-react";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import type { Entity } from "@/features/admin/lib/workspace";
import styles from "./DocsTree.styles";

type Node = TreeItemData & { kind: "folder" | "page"; children?: Node[] };

/** Arma el árbol: carpetas (con subcarpetas y artículos) y, al final, los artículos sin carpeta. */
function buildTree(folders: Entity<"folders">[], pages: Entity<"wikiPages">[]): Node[] {
  const byName = <T extends { name?: string; title?: string }>(a: T, b: T) => (a.name ?? a.title ?? "").localeCompare(b.name ?? b.title ?? "", "es");
  const activeFolders = folders.filter((folder) => !folder.archived).toSorted(byName);
  const activePages = pages.filter((page) => !page.archived).toSorted(byName);
  const pageNodes = (folderId: string): Node[] =>
    activePages.filter((page) => page.folderId === folderId).map((page) => ({ kind: "page", value: `page:${page.id}`, label: page.title, href: `/admin/articulos/${page.id}` }));
  const folderNodes = (parentId: string, depth: number): Node[] =>
    depth > 11 ? [] : activeFolders.filter((folder) => folder.parentId === parentId).map((folder) => ({
      kind: "folder",
      value: `folder:${folder.id}`,
      label: folder.name,
      children: [...folderNodes(folder.id, depth + 1), ...pageNodes(folder.id)],
    }));
  return [...folderNodes("", 0), ...pageNodes("")];
}

function Items({ nodes, onNavigate }: { nodes: Node[]; onNavigate?: () => void }) {
  return nodes.map((node) => (
    <TreeItem key={node.value} value={node.value} className={styles.item}>
      <TreeItemLabel className={styles.label} render={node.href ? <Link href={node.href} onClick={onNavigate} /> : undefined}>
        {node.kind === "folder" ? (
          <TreeItemIndicator className={styles.indicator}>
            <ChevronRight size={15} strokeWidth={2.4} aria-hidden="true" />
          </TreeItemIndicator>
        ) : (
          <span className={styles.spacer} aria-hidden="true" />
        )}
        {node.kind === "folder" ? (
          <>
            <Folder className={styles.closedIcon} size={17} strokeWidth={2} aria-hidden="true" />
            <FolderOpen className={styles.openIcon} size={17} strokeWidth={2} aria-hidden="true" />
          </>
        ) : (
          <FileText size={17} strokeWidth={2} aria-hidden="true" />
        )}
        <span className={styles.text} title={node.label}>{node.label}</span>
      </TreeItemLabel>
      {node.children ? (
        <TreeGroup className={styles.group}>
          {node.children.length ? <Items nodes={node.children} onNavigate={onNavigate} /> : null}
        </TreeGroup>
      ) : null}
    </TreeItem>
  ));
}

/** Árbol de la documentación para el sidebar (como el árbol de páginas de Confluence). */
export function DocsTree({ onNavigate }: { onNavigate?: () => void }) {
  const folders = useWorkspace("folders"), pages = useWorkspace("wikiPages");
  const pathname = usePathname();
  const router = useRouter();
  const nodes = buildTree(folders.items, pages.items);
  const currentId = pathname.startsWith("/admin/articulos/") ? pathname.split("/")[3] : null;

  if (folders.loading || pages.loading) return <p className={styles.status}>Cargando documentos…</p>;
  if (folders.error || pages.error) return <p className={styles.status}>No se pudieron cargar los documentos.</p>;
  if (!nodes.length) return <p className={styles.status}>Aún no hay artículos.</p>;

  return (
    <Tree
      aria-label="Documentos"
      className={styles.tree}
      items={nodes}
      mode="none"
      expandOnPress
      current={currentId ? `page:${currentId}` : null}
      onAction={(value, { event }) => {
        if (!value.startsWith("page:")) return;
        // Enter desde el teclado: navegación del lado del cliente.
        if (event && "key" in event) {
          event.preventDefault();
          router.push(`/admin/articulos/${value.slice(5)}`);
          onNavigate?.();
        }
      }}
    >
      <Items nodes={nodes} onNavigate={onNavigate} />
    </Tree>
  );
}
