"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { DateField } from "@/ui/molecules/DateField";
import { SelectField } from "@/ui/molecules/SelectField";
import { TextField } from "@/ui/molecules/TextField";
import { saveFinanceEntry } from "@/features/admin/actions/finance";
import { useWorkspaceDocument } from "@/features/admin/hooks/useWorkspace";
import { localDate } from "@/features/admin/lib/dates";
import { parseAmount, type FinanceEntry } from "@/features/admin/lib/finance";
import { EditorPage } from "../editors/EditorPage";
import { EditorSection } from "../editors/EditorSection";
import { useDraft } from "../editors/useDraft";
import { Attribution } from "../workspace/Attribution";
import { WorkspaceStatus } from "../workspace/WorkspaceParts";
import { Button } from "@/ui/atoms/Button";
import Link from "next/link";

export function FinanceEditorPage({ id }: { id?: string }) {
  const data = useWorkspaceDocument("financeEntries", id ?? null);
  if (data.loading || data.error) return <WorkspaceStatus loading={data.loading} errors={[data.error]} />;
  if (id && (!data.item || data.item.archived)) return <div><p>El movimiento no existe o está archivado.</p><Button render={<Link href="/admin/gastos?archived=yes" />}>Ver movimientos archivados</Button></div>;
  return <FinanceEditor key={id ?? "new"} initial={data.item ?? undefined} />;
}
export function FinanceEditor({ initial }: { initial?: FinanceEntry }) {
  const router = useRouter();
  const { draft, set, latest } = useDraft(() => ({ title: initial?.title ?? "", kind: initial?.kind ?? "expense", amount: initial ? (initial.amount / 100).toFixed(2) : "", currency: initial?.currency ?? "USD", date: initial?.date ?? localDate(new Date()), frequency: initial?.frequency ?? "once", endDate: initial?.endDate ?? "", category: initial?.category ?? "Operación", notes: initial?.notes ?? "" }));
  const [baseline] = useState(() => JSON.stringify(draft));
  const [revision] = useState(initial?.revision);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const dirty = JSON.stringify(draft) !== baseline;
  const locked = Boolean(initial?.paidDates.length);
  async function save() {
    if (busy) return;
    setError(""); setBusy(true);
    try {
      const data = { ...latest.current, amount: parseAmount(latest.current.amount) };
      const result = await saveFinanceEntry({ id: initial?.id, revision, data });
      if (!result.ok) throw new Error(result.error);
      router.push(`/admin/gastos?year=${data.date.slice(0, 4)}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar el movimiento."); }
    finally { setBusy(false); }
  }
  return <EditorPage title={initial ? "Editar movimiento" : "Crear movimiento"} heading={initial ? "Editar movimiento" : "Nuevo movimiento"} backLabel="Volver a gastos" breadcrumb={<><span>Gastos</span><ChevronRight size={14} aria-hidden="true" /><b>{initial ? "Editar" : "Nuevo"}</b></>} saveLabel="Guardar movimiento" busy={busy} stale={Boolean(initial && initial.revision !== revision)} dirty={dirty} isNew={!initial} error={error} onSave={() => void save()} onClose={() => router.push("/admin/gastos")} aside={<>
    <EditorSection label="Programación" first><DateField label="Fecha de inicio o vencimiento" value={draft.date} required onChange={(value) => set("date", value)} /><SelectField label="Frecuencia" value={draft.frequency} options={[{ value: "once", label: "Una sola vez" }, { value: "monthly", label: "Cada mes" }, { value: "yearly", label: "Cada año" }]} onChange={(value) => set("frequency", value as typeof draft.frequency)} />{draft.frequency !== "once" ? <DateField label="Última fecha (opcional)" clearable value={draft.endDate} onChange={(value) => set("endDate", value)} /> : null}<p>Los vencimientos futuros quedan previstos hasta que los marques como pagados o cobrados.</p></EditorSection>
    {initial ? <Attribution item={initial} detailed /> : null}
  </>}>
    <EditorSection label="Movimiento" first><TextField label="Concepto" appearance="big" value={draft.title} required maxLength={200} onChange={(value) => set("title", value)} placeholder="Ej.: Dominio de Daury" /><SelectField label="Tipo de movimiento" value={draft.kind} options={[{ value: "expense", label: "Egreso / costo" }, { value: "income", label: "Ingreso" }]} onChange={(value) => set("kind", value as typeof draft.kind)} /><TextField label="Importe por vencimiento" value={draft.amount} onChange={(value) => set("amount", value)} required placeholder="0.00" /><SelectField label="Moneda" value={draft.currency} options={[{ value: "USD", label: "USD · Dólares" }, { value: "GTQ", label: "GTQ · Quetzales" }]} onChange={(value) => set("currency", value as typeof draft.currency)} />{locked ? <p role="status">Este plan tiene pagos registrados. Su importe, moneda, tipo, fecha y frecuencia se conservan; crea otro plan para cambios futuros.</p> : null}</EditorSection>
    <EditorSection label="Detalles"><TextField label="Categoría" value={draft.category} onChange={(value) => set("category", value)} required maxLength={60} /><TextField label="Notas" value={draft.notes} onChange={(value) => set("notes", value)} multiline maxLength={3000} placeholder="Proveedor, referencia, alcance o condiciones…" /></EditorSection>
  </EditorPage>;
}
