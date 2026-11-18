"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { Check, Minus, Trash2, X } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { IconButton } from "@/ui/atoms/IconButton";
import { cx } from "@/ui/lib/tones";

/** Casilla para seleccionar un elemento (o todos, con `indeterminate`) en las acciones masivas. */
export function SelectBox({ checked, indeterminate = false, onChange, label, className }: { checked: boolean; indeterminate?: boolean; onChange: (value: boolean) => void; label: string; className?: string }) {
  return (
    <Checkbox
      checked={indeterminate ? "indeterminate" : checked}
      onCheckedChange={(value) => onChange(value === true)}
      aria-label={label}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      className={cx(
        "grid place-items-center flex-none w-[18px] h-[18px] p-0 rounded-[5px] border-[1.5px] border-[var(--rule-hover)] bg-surface text-white cursor-pointer transition-colors",
        "hover:border-[var(--blue)] data-[checked]:border-[var(--blue)] data-[checked]:bg-[var(--blue)] data-[indeterminate]:border-[var(--blue)] data-[indeterminate]:bg-[var(--blue)]",
        "focus-visible:outline-2 focus-visible:outline-[var(--blue)] focus-visible:outline-offset-2",
        className,
      )}
    >
      <CheckboxIndicator>
        {indeterminate ? <Minus size={12} strokeWidth={3.2} aria-hidden="true" /> : <Check size={12} strokeWidth={3.2} aria-hidden="true" />}
      </CheckboxIndicator>
    </Checkbox>
  );
}

type BulkBarProps = {
  /** Número de elementos seleccionados; la barra solo aparece con uno o más. */
  count: number;
  /** Sustantivo en singular y plural ("tarea", "tareas"). */
  noun: [string, string];
  busy: boolean;
  error: string;
  onClear: () => void;
  /** Borrado permanente: pide confirmación antes de llamarse. */
  onDelete?: () => void;
  children: ReactNode;
};

/** Barra flotante de acciones masivas: recuento, acciones, eliminar con confirmación y limpiar la selección. */
export function BulkBar({ count, noun, busy, error, onClear, onDelete, children }: BulkBarProps) {
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (!count) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (event.target instanceof HTMLElement && event.target.closest("[role=menu],[role=listbox],[role=dialog]")) return;
      if (confirming) setConfirming(false);
      else onClear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, confirming, onClear]);
  if (!count) return null;
  const label = `${count} ${count === 1 ? noun[0] : noun[1]}`;
  return (
    <div
      role="toolbar"
      aria-label={`Acciones para ${label}`}
      className="fixed z-40 left-1/2 -translate-x-1/2 bottom-[max(20px,env(safe-area-inset-bottom))] max-[960px]:bottom-[calc(var(--tabbar-h)+16px+env(safe-area-inset-bottom))] w-max max-w-[calc(100vw-32px)]"
    >
      <div className="flex items-center flex-wrap gap-[8px] py-[8px] pl-[14px] pr-[8px] rounded-[14px] bg-surface border border-rule [box-shadow:var(--shadow-pop)] animate-[tw-bulk-in_0.18s_var(--ease)]">
        {confirming ? (
          <>
            <span className="text-[13.5px] font-medium text-[var(--danger-ink)] mr-[4px]">¿Eliminar {label} para siempre? No se puede deshacer.</span>
            <Button variant="secondary" size="sm" onClick={() => setConfirming(false)} disabled={busy}>Cancelar</Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={14} aria-hidden="true" />} disabled={busy} pendingAnnouncement="Eliminando" onClick={() => { setConfirming(false); onDelete?.(); }}>Eliminar {label}</Button>
          </>
        ) : (
          <>
            <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap" aria-live="polite">{label}</span>
            <span className="w-px h-[22px] bg-[var(--rule-strong)] mx-[2px]" aria-hidden="true" />
            {children}
            {onDelete ? <Button variant="danger" size="sm" icon={<Trash2 size={14} aria-hidden="true" />} disabled={busy} onClick={() => setConfirming(true)}>Eliminar</Button> : null}
            <IconButton variant="plain" aria-label="Quitar la selección" onClick={onClear}><X size={16} aria-hidden="true" /></IconButton>
          </>
        )}
      </div>
      {error ? <p role="alert" className="mt-[8px] mx-auto max-w-[520px] py-[8px] px-[12px] rounded-[10px] border border-[var(--danger-line)] bg-[var(--coral-soft)] text-[var(--danger-ink)] text-[13px] font-medium text-center">{error}</p> : null}
    </div>
  );
}
