"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsPanel } from "@ui-sdk/react/tabs";
import { Archive, ArchiveRestore, CalendarClock, ChevronLeft, ChevronRight, List, Plus, Users, X } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { IconButton } from "@/ui/atoms/IconButton";
import { Skeleton } from "@/ui/atoms/Skeleton";
import { SearchField } from "@/ui/molecules/SearchField";
import { SegmentedField } from "@/ui/molecules/SegmentedField";
import { SegmentedTabs } from "@/ui/molecules/SegmentedTabs";
import { SelectField } from "@/ui/molecules/SelectField";
import { archiveFinanceEntry, settleFinanceEntry, settleTeamShares } from "@/features/admin/actions/finance";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import { financeOccurrences, isTeamExpense, money, occurrenceShares, type Currency, type FinanceEntry, type FinanceOccurrence, type LedgerItem } from "@/features/admin/lib/finance";
import { localDate } from "@/features/admin/lib/dates";
import { normalizeText } from "@/features/admin/lib/text";
import { memberOptions, personName } from "@/features/admin/lib/people";
import { WorkspaceStatus } from "../workspace/WorkspaceParts";
import { ExpenseRow, GroupedList, MonthChart, Overview, TeamView, UpcomingHeader, groupTotals, monthNames, useSessionEmail } from "./FinanceParts";

type Result = { ok: boolean; error?: string };
const views = ["movements", "upcoming", "team"] as const;

/** Gastos: resumen del año, gasto por mes, movimientos agrupados, próximos pagos y saldos del equipo. */
export function FinanceWorkspace() {
  const data = useWorkspace("financeEntries"), { params, update } = useAdminQuery(), router = useRouter(), me = useSessionEmail();
  const today = localDate(new Date()), thisYear = Number(today.slice(0, 4));
  const requestedYear = Number(params.get("year")), year = requestedYear >= 1900 && requestedYear <= 2200 ? requestedYear : thisYear;
  const archived = params.get("archived") === "yes", q = params.get("q") ?? "", kind = params.get("kind") ?? "all", status = params.get("status") ?? "all", month = params.get("month") ?? "all", who = params.get("who") ?? "";
  const view = views.find((value) => value === params.get("view")) ?? "movements";
  const active = useMemo(() => data.items.filter((entry) => !entry.archived), [data.items]);
  // Moneda: la elegida, o la que tenga movimientos (USD primero).
  const requested = params.get("currency");
  const currency: Currency = requested === "GTQ" || requested === "USD" ? requested : active.some((entry) => entry.currency === "USD") || !active.length ? "USD" : "GTQ";
  // Cada acción bloquea solo lo suyo (clave entrada:fecha o deuda), no toda la página.
  const [pending, setPending] = useState<ReadonlySet<string>>(() => new Set()), [error, setError] = useState("");
  const occurrences = useMemo(() => financeOccurrences(data.items, year), [data.items, year]);
  const horizon = `${thisYear + 1}${today.slice(4)}`;
  const upcoming = useMemo(() => [...financeOccurrences(data.items, thisYear), ...financeOccurrences(data.items, thisYear + 1)]
    .filter((item) => item.entry.kind === "expense" && item.entry.currency === currency && !item.paid && item.date < horizon && (item.date >= today || item.date.startsWith(`${thisYear}-`))), [data.items, thisYear, today, horizon, currency]);
  const filtered = useMemo(() => {
    const words = normalizeText(q);
    return occurrences.filter((item) => item.entry.currency === currency && (kind === "all" || item.entry.kind === kind)
      && (status === "all" || (status === "paid" ? item.paid : status === "overdue" ? !item.paid && item.date < today : status === "shares" ? Boolean(occurrenceShares(item.entry, item.date)?.shares.some((share) => share.state === "pending")) : !item.paid))
      && (month === "all" || Number(item.date.slice(5, 7)) === Number(month))
      && (!who || item.entry.payers?.[item.date] === who || Boolean(item.entry.members?.includes(who)))
      && normalizeText(`${item.entry.title} ${item.entry.category} ${item.entry.notes}`).includes(words));
  }, [occurrences, currency, kind, status, month, who, q, today]);
  const teamPending = useMemo(() => active.filter((entry) => isTeamExpense(entry) && entry.currency === currency).reduce((sum, entry) => sum + entry.paidDates.filter((date) => occurrenceShares(entry, date)?.shares.some((share) => share.state === "pending")).length, 0), [active, currency]);
  const otherCurrency = currency === "USD" ? "GTQ" : "USD", otherCount = active.filter((entry) => entry.currency === otherCurrency).length;

  async function run(key: string, action: () => Promise<Result>) {
    if (pending.has(key)) return;
    setPending((current) => new Set(current).add(key)); setError("");
    try { const result = await action(); if (!result.ok) setError(result.error ?? "No se pudo guardar."); }
    catch { setError("No se pudo guardar. Revisa tu conexión."); }
    finally { setPending((current) => { const next = new Set(current); next.delete(key); return next; }); }
  }
  const shares = (entry: FinanceEntry, date: string, members: string[], settled: boolean) => run(`${entry.id}:${date}`, () => settleTeamShares(members.map((member) => ({ id: entry.id, revision: entry.revision, date, member })), settled));
  const settleDebt = (items: LedgerItem[], key: string) => run(key, () => settleTeamShares(items.map((item) => ({ id: item.id, revision: item.revision, date: item.date, member: item.debtor })), true));
  const pay = (item: FinanceOccurrence, payer: string) => run(item.key, () => settleFinanceEntry(item.entry.id, item.entry.revision, item.date, true, payer));
  const row = (item: FinanceOccurrence, showCountdown = false) => <ExpenseRow key={item.key} item={item} today={today} busy={pending.has(item.key)} showCountdown={showCountdown} handlers={{
    onPay: (payer) => pay(item, payer),
    onSettle: (paid) => run(item.key, () => settleFinanceEntry(item.entry.id, item.entry.revision, item.date, paid)),
    onShares: (members, settled) => shares(item.entry, item.date, members, settled),
    onArchive: () => run(item.key, () => archiveFinanceEntry(item.entry.id, item.entry.revision, true)),
    onEdit: () => router.push(`/admin/gastos/${item.entry.id}`),
  }} />;

  const monthGroups = monthNames.map((label, index) => {
    const items = filtered.filter((item) => Number(item.date.slice(5, 7)) === index + 1);
    const open = items.filter((item) => !item.paid && item.entry.kind === "expense").length;
    return { key: String(index + 1), title: `${label} ${year}`, note: <>{groupTotals(items)}{open ? ` · ${open} por pagar` : ""}</>, items };
  });
  const in30 = localDate(new Date(Date.parse(today) + 30 * 86400000)), in90 = localDate(new Date(Date.parse(today) + 90 * 86400000));
  const upcomingGroups = [
    { key: "overdue", title: "Vencidos", items: upcoming.filter((item) => item.date < today) },
    { key: "30", title: "Próximos 30 días", items: upcoming.filter((item) => item.date >= today && item.date <= in30) },
    { key: "90", title: "En 1 a 3 meses", items: upcoming.filter((item) => item.date > in30 && item.date <= in90) },
    { key: "later", title: "Más adelante", items: upcoming.filter((item) => item.date > in90) },
  ].map((group) => ({ ...group, note: groupTotals(group.items) }));
  const filtersActive = q || kind !== "all" || status !== "all" || month !== "all" || who;

  return (
    <section className="min-w-0 flex flex-col gap-[20px]">
      <header className="flex items-end justify-between gap-[16px] flex-wrap">
        <div className="min-w-0">
          <p className="m-0 text-ink-soft text-[11.5px] font-semibold uppercase tracking-[0.07em] font-mono">Finanzas del equipo</p>
          <h1 className="m-0 mt-[4px] font-display text-[clamp(28px,3vw,36px)] font-semibold tracking-[-0.03em] leading-[1.1]">Gastos e ingresos</h1>
        </div>
        <div className="flex items-center gap-[10px] flex-wrap">
          <div className="flex items-center gap-[2px] h-[40px] px-[4px] rounded-[12px] bg-surface [box-shadow:inset_0_0_0_1px_var(--rule)]">
            <IconButton aria-label="Año anterior" variant="plain" disabled={year <= 1900} onClick={() => update({ year: String(year - 1) })}><ChevronLeft size={17} aria-hidden="true" /></IconButton>
            <h2 className="m-0 min-w-[56px] text-center font-display text-[17px] font-semibold tabular-nums">{year}</h2>
            <IconButton aria-label="Año siguiente" variant="plain" disabled={year >= 2200} onClick={() => update({ year: String(year + 1) })}><ChevronRight size={17} aria-hidden="true" /></IconButton>
          </div>
          <SegmentedField label="Moneda" hideLabel value={currency} options={[{ value: "USD", label: "USD" }, { value: "GTQ", label: "GTQ" }]} onChange={(value) => update({ currency: value })} />
          <Button size="sm" variant={archived ? "soft" : "text"} aria-pressed={archived} icon={<Archive size={15} aria-hidden="true" />} onClick={() => update({ archived: archived ? null : "yes" })}>{archived ? "Ver activos" : "Archivados"}</Button>
          <Button icon={<Plus size={18} aria-hidden="true" />} render={<Link href="/admin/gastos/nuevo" />}>Nuevo gasto</Button>
        </div>
      </header>
      <WorkspaceStatus loading={false} errors={[data.error, error]} />
      {data.loading ? <FinanceSkeleton /> : archived ? <ArchivedList entries={data.items.filter((entry) => entry.archived)} busy={pending} onRestore={(entry) => run(entry.id, () => archiveFinanceEntry(entry.id, entry.revision, false))} /> : <>
        {otherCount ? <p className="m-0 -mt-[8px] text-ink-soft text-[12.5px]">Viendo {currency}. Hay {otherCount} {otherCount === 1 ? "plan" : "planes"} en {otherCurrency}: <button type="button" className="border-0 bg-transparent p-0 text-brand font-semibold cursor-pointer hover:underline" onClick={() => update({ currency: otherCurrency })}>ver {otherCurrency}</button>. Las monedas no se mezclan.</p> : null}
        <Overview year={year} currency={currency} occurrences={occurrences} entries={data.items} me={me} today={today} busy={pending} onPay={pay} onOverdue={() => update({ view: null, status: "overdue", month: null })} onTeam={() => update({ view: "team" })} />
        <MonthChart currency={currency} occurrences={occurrences} month={month} onMonth={(value) => update({ month: value, view: null })} />
        <Tabs value={view} onValueChange={(value) => update({ view: value === "movements" ? null : String(value) })}>
          <div className="mb-[14px]"><SegmentedTabs label="Vistas de gastos" options={[
            { value: "movements", label: "Movimientos", icon: <List size={16} aria-hidden="true" /> },
            { value: "upcoming", label: upcoming.length ? `Próximos · ${upcoming.length}` : "Próximos", icon: <CalendarClock size={16} aria-hidden="true" /> },
            { value: "team", label: teamPending ? `Equipo · ${teamPending}` : "Equipo", icon: <Users size={16} aria-hidden="true" /> },
          ]} /></div>
          <TabsPanel value="movements" className="min-w-0 focus:outline-none">
            <div className="grid grid-cols-[minmax(220px,2fr)_repeat(3,minmax(150px,1fr))] gap-[10px] mb-[14px] max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">
              <SearchField aria-label="Buscar movimientos" placeholder="Concepto, categoría o notas…" value={q} onValueChange={(value) => update({ q: value || null })} />
              <SelectField label="Tipo de movimientos" hideLabel value={kind} options={[{ value: "all", label: "Gastos e ingresos" }, { value: "expense", label: "Solo gastos" }, { value: "income", label: "Solo ingresos" }]} onChange={(value) => update({ kind: value === "all" ? null : value })} />
              <SelectField label="Estado de los movimientos" hideLabel value={status} options={[{ value: "all", label: "Todos los estados" }, { value: "planned", label: "Por pagar" }, { value: "overdue", label: "Vencidos" }, { value: "paid", label: "Pagados o cobrados" }, { value: "shares", label: "Con partes pendientes" }]} onChange={(value) => update({ status: value === "all" ? null : value })} />
              <SelectField label="Persona de los movimientos" hideLabel value={who} options={[{ value: "", label: "Todas las personas" }, ...memberOptions.slice(1)]} onChange={(value) => update({ who: value || null })} />
            </div>
            {filtersActive ? <div className="flex items-center gap-[8px] mb-[12px] text-ink-soft text-[13px]"><span>{filtered.length} {filtered.length === 1 ? "movimiento" : "movimientos"}{month !== "all" ? ` en ${monthNames[Number(month) - 1]}` : ""}{who ? ` de ${personName(who)}` : ""}</span><Button size="sm" variant="text" icon={<X size={14} aria-hidden="true" />} onClick={() => update({ q: null, kind: null, status: null, month: null, who: null })}>Quitar filtros</Button></div> : null}
            <GroupedList groups={monthGroups} render={(item) => row(item)} empty={<><p className="m-0 font-display text-[17px] font-semibold">No hay movimientos para este período</p><p className="m-0 mt-[6px] text-ink-soft text-[14px]">Crea un gasto o ajusta los filtros.</p></>} />
          </TabsPanel>
          <TabsPanel value="upcoming" className="min-w-0 focus:outline-none flex flex-col gap-[14px]">
            <UpcomingHeader count={upcoming.length} onNew={() => router.push("/admin/gastos/nuevo")} />
            <GroupedList groups={upcomingGroups} render={(item) => row(item, true)} empty={<><p className="m-0 font-display text-[17px] font-semibold">No hay pagos pendientes en {currency}</p><p className="m-0 mt-[6px] text-ink-soft text-[14px]">Registra gastos con su fecha prevista: licencias, dominio, servicios.</p></>} />
          </TabsPanel>
          <TabsPanel value="team" className="min-w-0 focus:outline-none">
            <TeamView entries={data.items} currency={currency} me={me} busy={pending} onSettle={settleDebt} onShares={shares} />
          </TabsPanel>
        </Tabs>
      </>}
    </section>
  );
}

function ArchivedList({ entries, busy, onRestore }: { entries: FinanceEntry[]; busy: ReadonlySet<string>; onRestore: (entry: FinanceEntry) => void }) {
  return (
    <section className="rounded-[22px] bg-surface [box-shadow:inset_0_0_0_1px_var(--rule)] overflow-hidden" aria-labelledby="archivados">
      <h2 id="archivados" className="m-0 py-[16px] px-[22px] border-b border-rule font-display text-[17px] font-semibold">Planes archivados</h2>
      {entries.length ? <ul className="m-0 p-0 list-none">{entries.map((entry) => (
        <li key={entry.id} className="flex items-center gap-[14px] py-[14px] px-[22px] border-t border-rule first:border-t-0">
          <div className="flex-1 min-w-0"><b className="block text-[15px] truncate">{entry.title}</b><small className="text-ink-soft text-[12.5px]">{money(entry.amount, entry.currency)} · {entry.category} · Creado por {personName(entry.createdBy)}</small></div>
          <Button size="sm" variant="secondary" disabled={busy.has(entry.id)} icon={<ArchiveRestore size={16} aria-hidden="true" />} onClick={() => onRestore(entry)}>Restaurar</Button>
        </li>
      ))}</ul> : <p className="m-0 py-[20px] px-[22px] text-ink-soft text-[14px]">No hay planes archivados.</p>}
    </section>
  );
}

/** Esqueleto con la forma de la página: resumen, gráfica mensual, pestañas y lista. */
function FinanceSkeleton() {
  const box = "rounded-[22px] bg-surface [box-shadow:inset_0_0_0_1px_var(--rule)]";
  return (
    <div role="status" aria-label="Cargando gastos e ingresos" aria-busy="true" className="flex flex-col gap-[20px]">
      <div className="grid grid-cols-[1.35fr_1fr_1fr] gap-[16px] max-[1180px]:grid-cols-2 max-[700px]:grid-cols-1">
        {[0, 1, 2].map((item) => <div key={item} className={`${box} p-[24px] flex flex-col gap-[14px]`}><Skeleton width="45%" height={12} radius={6} /><Skeleton width="70%" height={34} radius={8} /><Skeleton width="100%" height={8} radius={6} /><Skeleton width="60%" height={12} radius={6} /></div>)}
      </div>
      <div className={`${box} p-[24px]`}><Skeleton width={160} height={12} radius={6} /><div className="grid grid-cols-12 gap-[8px] items-end h-[130px] mt-[16px]">{Array.from({ length: 12 }, (_, index) => <Skeleton key={index} height={30 + ((index * 37) % 90)} radius={6} />)}</div></div>
      <Skeleton width={340} height={38} radius={10} />
      <div className={`${box} overflow-hidden`}>{[0, 1, 2, 3].map((item) => <div key={item} className="flex items-center gap-[14px] py-[16px] px-[20px] border-t border-rule first:border-t-0"><Skeleton width={40} height={40} radius={12} /><div className="flex-1 flex flex-col gap-[8px]"><Skeleton width="40%" height={14} radius={6} /><Skeleton width="60%" height={12} radius={6} /></div><Skeleton width={90} height={18} radius={6} /><Skeleton width={120} height={32} radius={8} /></div>)}</div>
    </div>
  );
}
