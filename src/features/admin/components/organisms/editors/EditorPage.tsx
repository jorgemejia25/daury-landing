"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { IconButton } from "@/ui/atoms/IconButton";
import { Kbd } from "@/ui/atoms/Kbd";
import styles from "./EditorPage.styles";

export type EditorNav = {
  /** Posición del elemento actual (desde 1) y total de la lista. */
  index: number;
  total: number;
  onPrevious?: () => void;
  onNext?: () => void;
  /** "tarea", "evento"… para los nombres accesibles. */
  noun: string;
};

type EditorPageProps = {
  /** Nombre accesible de la página ("Editar tarea"). */
  title: string;
  /** Encabezado visible de la pantalla ("Nueva tarea", "Editar evento"). */
  heading?: string;
  /** Texto del botón de volver ("Volver al tablero"). */
  backLabel: string;
  breadcrumb: ReactNode;
  saveLabel: string;
  busy: boolean;
  /** Desactiva Guardar aunque haya cambios (contenido inválido, importación en curso…). */
  saveDisabled?: boolean;
  /** `details`: contenido y panel lateral; `document`: el contenido usa todo el ancho (artículos). */
  layout?: "details" | "document";
  error: string;
  /** Hay cambios sin guardar. */
  dirty: boolean;
  /** Elemento nuevo: se puede guardar aunque no haya cambios detectados. */
  isNew?: boolean;
  /** El elemento cambió en otra sesión desde que se abrió. */
  stale?: boolean;
  nav?: EditorNav;
  actions?: ReactNode;
  onSave: () => void;
  onClose: () => void;
  children: ReactNode;
  /** Panel lateral; `null` para no mostrarlo. */
  aside: ReactNode;
};

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.closest("[role=listbox],[role=menu],[role=dialog]") !== null);

const capitalize = (value: string) => value[0].toUpperCase() + value.slice(1);

/**
 * Pantalla de edición dentro del shell, con la estructura de las pantallas de la app:
 * encabezado (volver, ruta y título), secciones con su etiqueta, panel lateral y una barra
 * inferior fija con Guardar (como `bottomSticky` en ScreenLayout). El sidebar sigue visible.
 */
export function EditorPage({ title, heading, backLabel, breadcrumb, saveLabel, busy, saveDisabled = false, layout = "details", error, dirty, isNew = false, stale, nav, actions, onSave, onClose, children, aside }: EditorPageProps) {
  const [pending, setPending] = useState<null | (() => void)>(null);
  const root = useRef<HTMLElement>(null);
  const guard = (action?: () => void) => () => {
    if (!action) return;
    if (dirty) setPending(() => action);
    else action();
  };

  useEffect(() => {
    root.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return;
      if (event.key === "Escape" && !busy && !(event.target instanceof HTMLElement && event.target.closest("[role=listbox],[role=menu],[role=dialog]"))) {
        event.preventDefault();
        guard(onClose)();
      }
      if (!nav || isTyping(event.target)) return;
      if (event.key === "k" && nav.onPrevious) { event.preventDefault(); guard(nav.onPrevious)(); }
      if (event.key === "j" && nav.onNext) { event.preventDefault(); guard(nav.onNext)(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const canSave = !busy && !saveDisabled && (dirty || isNew);
  return (
    <section ref={root} className={styles.page} aria-label={title} tabIndex={-1} data-layout={layout}>
      <header className={styles.head}>
        <IconButton variant="soft" aria-label={backLabel} onClick={guard(onClose)}>
          <ArrowLeft size={18} strokeWidth={2.2} aria-hidden="true" />
        </IconButton>
        <div className={styles.headText}>
          <nav className={styles.crumbs} aria-label="Ubicación">{breadcrumb}</nav>
          {heading ? <h1 className={styles.heading}>{heading}</h1> : null}
        </div>
        <div className={styles.headActions}>
          {nav ? (
            <div className={styles.nav}>
              <span className={styles.counter} aria-live="polite">{nav.index} de {nav.total}</span>
              <IconButton variant="plain" aria-label={`${capitalize(nav.noun)} anterior`} disabled={!nav.onPrevious} onClick={guard(nav.onPrevious)}>
                <ChevronUp size={17} strokeWidth={2.2} aria-hidden="true" />
              </IconButton>
              <IconButton variant="plain" aria-label={`${capitalize(nav.noun)} siguiente`} disabled={!nav.onNext} onClick={guard(nav.onNext)}>
                <ChevronDown size={17} strokeWidth={2.2} aria-hidden="true" />
              </IconButton>
              <span className={styles.shortcut} aria-hidden="true"><Kbd>K</Kbd><Kbd>J</Kbd></span>
            </div>
          ) : null}
          {actions}
          {nav || actions ? <span className={styles.divider} aria-hidden="true" /> : null}
          {dirty ? <span className={styles.status}>Sin guardar</span> : null}
          <Button variant="secondary" onClick={guard(onClose)}>Cancelar</Button>
          <Button disabled={!canSave} pendingAnnouncement="Guardando cambios" icon={<Check size={16} strokeWidth={2.6} aria-hidden="true" />} onClick={onSave}>{saveLabel}</Button>
        </div>
      </header>

      {pending ? (
        <div className={styles.confirm} role="alert">
          <span>Tienes cambios sin guardar. ¿Quieres descartarlos?</span>
          <Button variant="secondary" size="sm" onClick={() => setPending(null)}>Seguir editando</Button>
          <Button variant="danger" size="sm" onClick={() => { const action = pending; setPending(null); action(); }}>Descartar cambios</Button>
        </div>
      ) : null}
      {stale ? <p className={styles.warning} role="status">Otra persona cambió este elemento. Vuelve a abrirlo para cargar la última versión; tu borrador sigue aquí.</p> : null}
      {error ? <p className={styles.error} role="alert">{error}</p> : null}

      <form className={styles.body} data-aside={aside ? "" : undefined} onSubmit={(event) => { event.preventDefault(); if (canSave) onSave(); }}>
        <div className={styles.main}>{children}</div>
        {aside ? <aside className={styles.aside}>{aside}</aside> : null}
      </form>
    </section>
  );
}
