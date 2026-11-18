"use client";

import { Dialog } from "@ui-sdk/react/dialog";
import type { ReactNode } from "react";
import { Button } from "@/ui/atoms/Button";
import { Modal } from "@/ui/organisms/Modal";
import type { Metadata } from "@/features/admin/lib/workspace";
import { Attribution } from "../workspace/Attribution";
import styles from "./Editor.styles";

type EditorDialogProps = {
  title: string;
  saveLabel: string;
  initial?: Metadata;
  /** El elemento cambió en otra sesión desde que se abrió el editor. */
  stale?: boolean;
  busy: boolean;
  error: string;
  onSave: () => void;
  onClose: () => void;
  children: ReactNode;
  /** Contenido debajo del formulario (comentarios). */
  after?: ReactNode;
  wide?: boolean;
  /** Acción a la izquierda del pie (archivar). */
  footerStart?: ReactNode;
};

/** Hoja de edición: formulario con secciones, error visible y pie fijo con Cancelar y Guardar. */
export function EditorDialog({ title, saveLabel, initial, stale, busy, error, onSave, onClose, children, after, wide, footerStart }: EditorDialogProps) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open && !busy) onClose(); }}>
      <Modal className={styles.dialog} data-wide={wide || undefined} title={title} closeLabel="Cerrar editor" initialFocus="content">
        {initial ? <Attribution item={initial} detailed /> : null}
        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); onSave(); }}>
          {stale ? <p className={styles.warning} role="status">Hay cambios de otra persona. Cierra y vuelve a abrir el editor para cargar la última versión; tu borrador sigue aquí.</p> : null}
          {children}
          {error ? <p role="alert" className={styles.error}>{error}</p> : null}
          <div className={styles.footer}>
            {footerStart ? <div className={styles.footerStart}>{footerStart}</div> : null}
            <Button variant="secondary" disabled={busy} onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={busy} pendingAnnouncement="Guardando cambios" onClick={(event) => { event.preventDefault(); onSave(); }}>{saveLabel}</Button>
          </div>
        </form>
        {after}
      </Modal>
    </Dialog>
  );
}
