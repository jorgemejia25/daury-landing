"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Folder } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { libraryHref } from "@/features/admin/lib/routes";
import { CollectionForm } from "../editors/CollectionForm";
import { WorkspaceStatus } from "./WorkspaceParts";

/** Página para crear o editar una carpeta de la documentación. */
export function FolderPage({ id, parentId }: { id?: string; parentId?: string }) {
  const router = useRouter();
  const folders = useWorkspace("folders");
  const folder = id ? folders.items.find((item) => item.id === id) : undefined;
  if (folders.loading || folders.error) return <WorkspaceStatus loading={folders.loading} errors={[folders.error]} />;
  if (id && (!folder || folder.archived)) {
    return (
      <EmptyState icon={<Folder size={24} aria-hidden="true" />} tone="blue" title={folder?.archived ? "Esta carpeta está archivada" : "Esta carpeta no existe"} action={<Button variant="secondary" render={<Link href={libraryHref()} />}>Volver a documentación</Button>}>
        Restáurala desde Archivados o revisa el enlace.
      </EmptyState>
    );
  }
  const back = libraryHref(folder?.id ?? parentId);
  return (
    <CollectionForm
      key={folder?.id ?? "new"}
      kind="folders"
      initial={folder}
      folders={folders.items}
      defaults={{ parentId: parentId ?? "" }}
      onClose={() => router.push(back)}
      onSaved={(savedId) => router.push(libraryHref(savedId))}
    />
  );
}
