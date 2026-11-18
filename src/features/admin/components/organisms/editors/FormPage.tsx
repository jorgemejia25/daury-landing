"use client";

import type { ReactNode } from "react";
import { Panel } from "@/ui/molecules/Panel";
import type { Metadata } from "@/features/admin/lib/workspace";
import { Attribution } from "../workspace/Attribution";
import { EditorPage } from "./EditorPage";

type FormPageProps = {
  /** Título de la página ("Crear carpeta", "Configurar tablero"). */
  title: string;
  /** Ubicación sobre el título ("Documentación › Marketing"). */
  breadcrumb: ReactNode;
  backLabel: string;
  saveLabel: string;
  initial?: Metadata;
  stale?: boolean;
  busy: boolean;
  error: string;
  dirty: boolean;
  onSave: () => void;
  onClose: () => void;
  /** Título del panel principal del formulario. */
  section?: string;
  /** Paneles adicionales bajo el principal (columnas de un tablero). */
  after?: ReactNode;
  children: ReactNode;
};

/** Formulario de configuración (tableros, calendarios, carpetas) como página propia dentro del shell. */
export function FormPage({ title, breadcrumb, backLabel, saveLabel, initial, stale, busy, error, dirty, onSave, onClose, section = "Detalles", after, children }: FormPageProps) {
  return (
    <EditorPage
      title={title}
      heading={title}
      backLabel={backLabel}
      breadcrumb={breadcrumb}
      saveLabel={saveLabel}
      busy={busy}
      error={error}
      dirty={dirty}
      isNew={!initial}
      stale={stale}
      onSave={onSave}
      onClose={onClose}
      aside={initial ? (
        <Panel title="Registro" titleAs="h2">
          <Attribution item={initial} detailed />
        </Panel>
      ) : null}
    >
      <Panel title={section}>{children}</Panel>
      {after}
    </EditorPage>
  );
}
