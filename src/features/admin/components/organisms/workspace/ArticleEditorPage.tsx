"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { useWorkspace, useWorkspaceDocument } from "@/features/admin/hooks/useWorkspace";
import { ArticleForm } from "../editors/ArticleForm";
import { WorkspaceStatus } from "./WorkspaceParts";

export const newArticleHref = (folderId?: string) => `/admin/articulos/nuevo${folderId ? `?folder=${encodeURIComponent(folderId)}` : ""}`;
export const editArticleHref = (id: string) => `/admin/articulos/${encodeURIComponent(id)}/editar`;

export function ArticleEditorPage({ id, folderId }: { id?: string; folderId?: string }) {
  const router = useRouter();
  const folders = useWorkspace("folders");
  const page = useWorkspaceDocument("wikiPages", id ?? null);
  const content = useWorkspaceDocument("wikiContent", id ?? null);
  const back = id ? `/admin/articulos/${encodeURIComponent(id)}` : `/admin/documentacion${folderId ? `?folder=${encodeURIComponent(folderId)}` : ""}`;
  const error = folders.error || page.error || content.error;
  if (folders.loading || page.loading || content.loading || error) return <WorkspaceStatus loading={folders.loading || page.loading || content.loading} errors={[error]} />;
  if (id && (!page.item || !content.item || page.item.archived)) return <EmptyState icon={<FileText size={26} aria-hidden="true" />} tone="blue" title={page.item?.archived ? "Este artículo está archivado" : "No se puede abrir el artículo"} action={<Button render={<Link href={back} />}>Volver a documentación</Button>}>Vuelve al artículo para restaurarlo o revisa el enlace.</EmptyState>;
  return <ArticleForm key={id ?? "new"} initial={page.item ?? undefined} body={content.item?.body} folders={folders.items} defaults={{ folderId }} onClose={() => router.push(back)} onSaved={(savedId) => router.push(`/admin/articulos/${encodeURIComponent(savedId)}`)} />;
}
