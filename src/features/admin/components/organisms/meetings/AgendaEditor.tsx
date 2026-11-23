"use client";

import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { ArrowDown, ArrowUp, Check, Plus, X } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { IconButton } from "@/ui/atoms/IconButton";
import { ProgressBar } from "@/ui/atoms/ProgressBar";
import { SelectField } from "@/ui/molecules/SelectField";
import { memberOptions } from "@/features/admin/lib/people";
import { agendaTiming, meetingLimits, type AgendaItem } from "@/features/admin/lib/meetings";
import type { WorkEvent } from "@/features/admin/lib/workspace";
import { meetingStyles as styles } from "./MeetingParts";

const ownerOptions = memberOptions.map((option) => (option.value ? option : { value: "", label: "Sin responsable" }));

/** Puntos de la agenda con duración y responsable; compara el tiempo previsto con la duración del evento. */
export function AgendaEditor({ agenda, event, onChange }: { agenda: AgendaItem[]; event: Pick<WorkEvent, "allDay" | "start" | "end">; onChange: (agenda: AgendaItem[]) => void }) {
  const timing = agendaTiming(agenda, event), done = agenda.filter((item) => item.done).length;
  const patch = (id: string, changes: Partial<AgendaItem>) => onChange(agenda.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  const move = (index: number, offset: number) => {
    const next = [...agenda], [item] = next.splice(index, 1);
    next.splice(index + offset, 0, item);
    onChange(next);
  };

  return (
    <div className={styles.stack}>
      {agenda.length ? (
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between gap-[12px] flex-wrap text-[13px]">
            <span className={timing.over ? "text-[var(--coral)] font-semibold" : "text-ink-soft"}>
              {timing.available === null ? `${timing.planned} min previstos` : `${timing.planned} de ${timing.available} min previstos${timing.over ? ` · se pasa ${timing.planned - timing.available} min` : ""}`}
            </span>
            <span className={styles.count}>{done} de {agenda.length} tratados</span>
          </div>
          <ProgressBar value={done} max={agenda.length} label="Puntos de la agenda tratados" tone="green" />
        </div>
      ) : (
        <p className={styles.muted}>La agenda está vacía.</p>
      )}
      {agenda.length ? (
        <ol className={`${styles.list} border-y border-rule`} aria-label="Agenda">
          {agenda.map((item, index) => (
            <li key={item.id} className={styles.agendaRow}>
              <Checkbox className={styles.check} aria-label={`Marcar como tratado el punto ${index + 1}`} checked={item.done} onCheckedChange={(value) => patch(item.id, { done: value === true })}>
                <CheckboxIndicator><Check size={12} strokeWidth={3.2} aria-hidden="true" /></CheckboxIndicator>
              </Checkbox>
              <input className={styles.agendaInput} data-done={item.done || undefined} aria-label={`Tema del punto ${index + 1}`} value={item.title} maxLength={meetingLimits.title} placeholder="Tema a tratar" onChange={(e) => patch(item.id, { title: e.target.value })} />
              <label className={styles.minutes} data-wide="">
                <input type="number" inputMode="numeric" min={0} max={meetingLimits.minutes} step={5} aria-label={`Minutos del punto ${index + 1}`} value={item.minutes}
                  onChange={(e) => patch(item.id, { minutes: Math.max(0, Math.min(meetingLimits.minutes, Math.round(Number(e.target.value) || 0))) })} />
                <span>min</span>
              </label>
              <div data-wide=""><SelectField label={`Responsable del punto ${index + 1}`} hideLabel size="compact" value={item.owner} fallback="" options={ownerOptions} onChange={(value) => patch(item.id, { owner: value })} /></div>
              <div className={styles.rowButtons}>
                <IconButton variant="plain" aria-label={`Subir el punto ${index + 1}`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={16} aria-hidden="true" /></IconButton>
                <IconButton variant="plain" aria-label={`Bajar el punto ${index + 1}`} disabled={index === agenda.length - 1} onClick={() => move(index, 1)}><ArrowDown size={16} aria-hidden="true" /></IconButton>
                <IconButton variant="plain" aria-label={`Quitar el punto ${index + 1}`} onClick={() => onChange(agenda.filter((row) => row.id !== item.id))}><X size={17} aria-hidden="true" /></IconButton>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
      <div>
        <Button variant="soft" disabled={agenda.length >= meetingLimits.agenda} icon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
          onClick={() => onChange([...agenda, { id: crypto.randomUUID(), title: "", minutes: 10, owner: "", done: false }])}>
          Agregar punto
        </Button>
      </div>
    </div>
  );
}
