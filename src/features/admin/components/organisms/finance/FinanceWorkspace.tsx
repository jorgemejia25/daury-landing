"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsPanel } from "@ui-sdk/react/tabs";
import { Archive, ArchiveRestore, ArrowDownLeft, ArrowUpRight, Check, ChevronLeft, ChevronRight, List, CalendarDays, Plus, CalendarClock, Users, Undo2 } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { Chip } from "@/ui/atoms/Chip";
import { IconButton } from "@/ui/atoms/IconButton";
import { Card } from "@/ui/molecules/Card";
import { Skeleton } from "@/ui/atoms/Skeleton";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { ScreenHeader } from "@/ui/molecules/ScreenHeader";
import { SearchField } from "@/ui/molecules/SearchField";
import { SegmentedTabs } from "@/ui/molecules/SegmentedTabs";
import { SelectField } from "@/ui/molecules/SelectField";
import { archiveFinanceEntry, settleFinanceEntry, settleTeamShares } from "@/features/admin/actions/finance";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import { financeOccurrences, financeTotals, isTeamExpense, money, type Currency, type FinanceOccurrence, type LedgerItem } from "@/features/admin/lib/finance";
import { localDate, formatDate } from "@/features/admin/lib/dates";
import { normalizeText } from "@/features/admin/lib/text";
import { memberOptions, personName } from "@/features/admin/lib/people";
import { PayButton, SharesButton, TeamBalances } from "./TeamSplit";
import { WorkspaceStatus } from "../workspace/WorkspaceParts";
import { financeStyles as styles } from "./finance-styles";

const months = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat("es-GT", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, index, 15))));
export function FinanceWorkspace() {
  const data = useWorkspace("financeEntries"), { params, update } = useAdminQuery();
  const today = localDate(new Date()), requestedYear = Number(params.get("year")), year = requestedYear >= 1900 && requestedYear <= 2200 ? requestedYear : Number(today.slice(0, 4));
  const archived = params.get("archived") === "yes", q = params.get("q") ?? "", currency = params.get("currency") ?? "all", kind = params.get("kind") ?? "all", status = params.get("status") ?? "all", month = params.get("month") ?? "all";
  const who = params.get("who") ?? "";
  const view = (["forecast", "planned", "team"] as const).find((value) => value === params.get("view")) ?? "movements";
  const results = useRef<HTMLDivElement>(null), focusResults = useRef(false);
  useEffect(() => { if (view === "movements" && focusResults.current) { focusResults.current = false; results.current?.focus(); } }, [view, month]);
  // Cada acción bloquea solo su fila (clave entrada:fecha), no toda la página.
  const [pending, setPending] = useState<ReadonlySet<string>>(() => new Set()), [error, setError] = useState("");
  const occurrences = useMemo(() => financeOccurrences(data.items, year), [data.items, year]);
  // Gastos previstos: lo que falta pagar en los próximos 12 meses (cruza el cambio de año).
  const thisYear = Number(today.slice(0, 4)), horizon = `${thisYear + 1}${today.slice(4)}`;
  const planned = useMemo(() => [...financeOccurrences(data.items, thisYear), ...financeOccurrences(data.items, thisYear + 1)].filter((item) => item.entry.kind === "expense" && !item.paid && item.date >= today && item.date < horizon), [data.items, thisYear, today, horizon]);
  const filtered = useMemo(() => {
    const words = normalizeText(q);
    return occurrences.filter((item) => (currency === "all" || item.entry.currency === currency) && (kind === "all" || item.entry.kind === kind) && (status === "all" || (status === "paid") === item.paid) && (month === "all" || Number(item.date.slice(5, 7)) === Number(month))
      && (!who || item.entry.payers?.[item.date] === who || Boolean(item.entry.members?.includes(who))) && normalizeText(`${item.entry.title} ${item.entry.category} ${item.entry.notes}`).includes(words));
  }, [occurrences, currency, kind, status, month, who, q]);
  const teamCount = useMemo(() => data.items.filter((entry) => !entry.archived && isTeamExpense(entry)).length, [data.items]);
  async function run(key: string, action: () => Promise<{ ok: boolean; error?: string }>) {
    if (pending.has(key)) return;
    setPending((current) => new Set(current).add(key)); setError("");
    try { const result = await action(); if (!result.ok) setError(result.error ?? "No se pudo guardar."); }
    catch { setError("No se pudo guardar. Revisa tu conexión."); }
    finally { setPending((current) => { const next = new Set(current); next.delete(key); return next; }); }
  }
  const settleShares = (items: LedgerItem[] | { id: string; revision: number; date: string; member: string }[], settled: boolean, key: string) => run(key, () => settleTeamShares(items.map((item) => ({ id: item.id, revision: item.revision, date: item.date, member: "debtor" in item ? item.debtor : item.member })), settled));
  const row = (item: FinanceOccurrence, mode: "movement" | "planned") => <MovementRow key={item.key} item={item} mode={mode} today={today} busy={pending.has(item.key)}
    onPay={(payer) => run(item.key, () => settleFinanceEntry(item.entry.id, item.entry.revision, item.date, true, payer))}
    onSettle={(paid) => run(item.key, () => settleFinanceEntry(item.entry.id, item.entry.revision, item.date, paid))}
    onShares={(members, settled) => settleShares(members.map((member) => ({ id: item.entry.id, revision: item.entry.revision, date: item.date, member })), settled, item.key)}
    onArchive={() => run(item.key, () => archiveFinanceEntry(item.entry.id, item.entry.revision, true))} />;
  return <section className={styles.workspace}>
    <ScreenHeader title="Gastos e ingresos" subtitle="Costos de Daury, pagos previstos y entradas de dinero." right={<Button icon={<Plus size={18} aria-hidden="true" />} render={<Link href="/admin/gastos/nuevo" />}>Nuevo movimiento</Button>} />
    <WorkspaceStatus loading={false} errors={[data.error, error]} />
    {data.loading ? <FinanceSkeleton /> : <>
    <div className={styles.yearBar}><div className={styles.year}><IconButton aria-label="Año anterior" variant="plain" disabled={year <= 1900} onClick={() => update({ year: String(year - 1) })}><ChevronLeft size={19} aria-hidden="true" /></IconButton><h2>{year}</h2><IconButton aria-label="Año siguiente" variant="plain" disabled={year >= 2200} onClick={() => update({ year: String(year + 1) })}><ChevronRight size={19} aria-hidden="true" /></IconButton></div><Button size="sm" variant={archived ? "soft" : "text"} aria-pressed={archived} icon={<Archive size={15} aria-hidden="true" />} onClick={() => update({ archived: archived ? null : "yes" })}>{archived ? "Ver activos" : "Ver archivados"}</Button></div>
    {!archived ? <>
      <div className={styles.summary}>{(["USD", "GTQ"] as Currency[]).map((unit) => { const totals = financeTotals(occurrences, unit); return <Card key={unit}><span className={styles.currency}>{unit === "USD" ? "Dólares · USD" : "Quetzales · GTQ"}</span><div className={styles.totals}><div><span>Costos del año</span><strong>{money(totals.expense, unit)}</strong><small>Pagado {money(totals.paidExpense, unit)} · Pendiente {money(totals.expense - totals.paidExpense, unit)}</small></div><div><span>Ingresos del año</span><strong>{money(totals.income, unit)}</strong><small>Cobrado {money(totals.paidIncome, unit)}</small></div><div><span>Balance previsto</span><strong data-negative={totals.balance < 0 || undefined}>{money(totals.balance, unit)}</strong><small>Ingresos menos costos programados</small></div></div></Card>; })}</div>
      <p className={styles.hint}>Los totales incluyen todos los vencimientos del año y se mantienen separados por moneda.</p>
      <Tabs value={view} onValueChange={(value) => update({ view: value === "forecast" || value === "planned" || value === "team" ? value : null })}>
        <div className={styles.tabs}><SegmentedTabs label="Vistas de gastos" options={[{ value: "movements", label: "Movimientos", icon: <List size={16} aria-hidden="true" /> }, { value: "planned", label: "Gastos previstos", icon: <CalendarClock size={16} aria-hidden="true" /> }, { value: "forecast", label: "Previsión mensual", icon: <CalendarDays size={16} aria-hidden="true" /> }, { value: "team", label: teamCount ? `Equipo · ${teamCount}` : "Equipo", icon: <Users size={16} aria-hidden="true" /> }]} /></div>
        <TabsPanel value="movements" className={styles.tabPanel} ref={results} tabIndex={-1}>
      <div className={styles.filters}><SearchField aria-label="Buscar movimientos" placeholder="Concepto, categoría o notas…" value={q} onValueChange={(value) => update({ q: value || null })} /><SelectField label="Moneda de los movimientos" hideLabel value={currency} options={[{ value: "all", label: "Ambas monedas" }, { value: "USD", label: "Dólares" }, { value: "GTQ", label: "Quetzales" }]} onChange={(value) => update({ currency: value === "all" ? null : value })} /><SelectField label="Tipo de movimientos" hideLabel value={kind} options={[{ value: "all", label: "Ingresos y egresos" }, { value: "expense", label: "Egresos" }, { value: "income", label: "Ingresos" }]} onChange={(value) => update({ kind: value === "all" ? null : value })} /><SelectField label="Estado de los movimientos" hideLabel value={status} options={[{ value: "all", label: "Todos los estados" }, { value: "planned", label: "Previstos" }, { value: "paid", label: "Pagados / cobrados" }]} onChange={(value) => update({ status: value === "all" ? null : value })} /><SelectField label="Mes de los movimientos" hideLabel value={month} options={[{ value: "all", label: "Todo el año" }, ...months.map((label, index) => ({ value: String(index + 1), label }))]} onChange={(value) => update({ month: value === "all" ? null : value })} /><SelectField label="Persona de los movimientos" hideLabel value={who} options={[{ value: "", label: "Todas las personas" }, ...memberOptions.slice(1)]} onChange={(value) => update({ who: value || null })} /></div>
      <Card padding="none"><div className={styles.sectionHead}><h3>Movimientos programados</h3><span>{filtered.length}</span></div>{filtered.length ? <ul className={styles.movements}>{filtered.map((item) => row(item, "movement"))}</ul> : <EmptyState icon={<Archive size={25} aria-hidden="true" />} tone="blue" title="No hay movimientos para este período">Crea un movimiento o ajusta los filtros.</EmptyState>}</Card>
        </TabsPanel>
        <TabsPanel value="planned" className={styles.tabPanel}>
          <Card padding="none">
            <div className={styles.sectionHead}>
              <div className="min-w-0"><h3>Gastos previstos</h3><p className="m-0 mt-[4px] text-ink-soft text-[13px] leading-[1.5]">Pendiente en los próximos 12 meses: {(["USD", "GTQ"] as Currency[]).map((unit) => money(planned.filter((item) => item.entry.currency === unit).reduce((sum, item) => sum + item.entry.amount, 0), unit)).join(" · ")}</p></div>
              <Button size="sm" variant="secondary" icon={<Plus size={15} aria-hidden="true" />} render={<Link href="/admin/gastos/nuevo" />}>Agregar gasto previsto</Button>
            </div>
            {planned.length ? <ul className={styles.movements}>{planned.map((item) => row(item, "planned"))}</ul> : <EmptyState icon={<CalendarClock size={25} aria-hidden="true" />} tone="amber" title="No hay gastos previstos">Registra un gasto con su fecha prevista: licencias, dominio, servicios.</EmptyState>}
          </Card>
        </TabsPanel>
        <TabsPanel value="team" className={styles.tabPanel}>
          <TeamBalances entries={data.items} busy={pending.has("ledger")} onSettle={(items) => settleShares(items, true, "ledger")} />
        </TabsPanel>
        <TabsPanel value="forecast" className={styles.tabPanel}>
          <Card padding="none" className={styles.schedule}><div className={styles.sectionHead}><h3>Previsión mensual</h3><Link href={`/admin/calendarios?month=${year}-01`}>Ver en calendario <ArrowUpRight size={14} aria-hidden="true" /></Link></div><div className={styles.scroll}><table><caption className="sr-only">Costos e ingresos programados por mes, separados por moneda</caption><thead><tr><th scope="col">Mes</th><th scope="col">Egresos USD</th><th scope="col">Ingresos USD</th><th scope="col">Egresos GTQ</th><th scope="col">Ingresos GTQ</th></tr></thead><tbody>{months.map((label, index) => { const items = occurrences.filter((item) => Number(item.date.slice(5, 7)) === index + 1), usd = financeTotals(items, "USD"), gtq = financeTotals(items, "GTQ"); return <tr key={label}><th scope="row"><Button size="sm" variant="text" onClick={() => { focusResults.current = true; update({ month: String(index + 1), view: null }); }}>{label}</Button></th><td>{money(usd.expense, "USD")}</td><td>{money(usd.income, "USD")}</td><td>{money(gtq.expense, "GTQ")}</td><td>{money(gtq.income, "GTQ")}</td></tr>; })}</tbody></table></div></Card>
        </TabsPanel>
      </Tabs>
    </> : <Card><h3>Planes y movimientos archivados</h3><ul className={styles.movements}>{data.items.filter((entry) => entry.archived).map((entry) => <li key={entry.id} className={styles.movement}><div className={styles.info}><b>{entry.title}</b><small>{money(entry.amount, entry.currency)} · Creado por {personName(entry.createdBy)}</small></div><Button size="sm" variant="secondary" disabled={pending.has(entry.id)} icon={<ArchiveRestore size={16} aria-hidden="true" />} onClick={() => run(entry.id, () => archiveFinanceEntry(entry.id, entry.revision, false))}>Restaurar</Button></li>)}</ul>{!data.items.some((entry) => entry.archived) ? <p className={styles.hint}>No hay movimientos archivados.</p> : null}</Card>}
    </>}
  </section>;
}

/** Esqueleto con la forma de la página: año, totales por moneda, pestañas, filtros y movimientos. */
function FinanceSkeleton() {
  return (
    <div role="status" aria-label="Cargando gastos e ingresos" aria-busy="true">
      <div className={styles.yearBar}>
        <div className="flex items-center gap-[12px]"><Skeleton width={36} height={36} radius={9} /><Skeleton width={72} height={28} radius={8} /><Skeleton width={36} height={36} radius={9} /></div>
        <Skeleton width={128} height={32} radius={8} />
      </div>
      <div className={styles.summary}>
        {[0, 1].map((card) => (
          <Card key={card}>
            <Skeleton width={120} height={12} radius={6} />
            <div className="grid grid-cols-2 gap-[22px] mt-[24px]">
              {[0, 1].map((stat) => <div key={stat} className="flex flex-col gap-[8px]"><Skeleton width="55%" height={12} radius={6} /><Skeleton width="80%" height={28} radius={8} /><Skeleton width="70%" height={12} radius={6} /></div>)}
              <div className="col-span-full flex flex-col gap-[8px] pt-[18px] border-t border-rule"><Skeleton width="30%" height={12} radius={6} /><Skeleton width="45%" height={28} radius={8} /></div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-[38px] mb-[20px]"><Skeleton width={300} height={38} radius={9} /></div>
      <div className={styles.filters}>{[0, 1, 2, 3, 4, 5].map((field) => <Skeleton key={field} height={40} radius={9} />)}</div>
      <Card padding="none">
        <div className={styles.sectionHead}><Skeleton width={200} height={18} radius={6} /><Skeleton width={24} height={14} radius={6} /></div>
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className={styles.movement}>
            <Skeleton width={42} height={42} radius={14} />
            <div className="flex flex-col gap-[8px] flex-1"><Skeleton width="40%" height={14} radius={6} /><Skeleton width="60%" height={12} radius={6} /></div>
            <div className="flex flex-col items-end gap-[8px]"><Skeleton width={90} height={16} radius={6} /><Skeleton width={64} height={20} radius={6} /></div>
            <Skeleton width={128} height={32} radius={8} />
          </div>
        ))}
      </Card>
    </div>
  );
}

const frequencyLabel = { monthly: "Mensual", yearly: "Anual", once: "Pago único" } as const;
type RowProps = { item: FinanceOccurrence; mode: "movement" | "planned"; today: string; busy: boolean; onPay: (payer: string) => void; onSettle: (paid: boolean) => void; onShares: (members: string[], settled: boolean) => void; onArchive: () => void };
/** Un vencimiento: estado, quién pagó, reparto del equipo y acciones. Se usa en Movimientos y en Gastos previstos. */
function MovementRow({ item, mode, today, busy, onPay, onSettle, onShares, onArchive }: RowProps) {
  const { entry, date, paid } = item, expense = entry.kind === "expense", team = isTeamExpense(entry), payer = entry.payers?.[date];
  const days = Math.round((Date.parse(date) - Date.parse(today)) / 86400000);
  return <li className={styles.movement} aria-busy={busy || undefined}>
    <span className={styles.kind} data-kind={mode === "planned" ? "expense" : entry.kind}>{mode === "planned" ? <CalendarClock size={20} aria-hidden="true" /> : expense ? <ArrowUpRight size={21} aria-hidden="true" /> : <ArrowDownLeft size={21} aria-hidden="true" />}</span>
    <div className={styles.info}>
      <Link href={`/admin/gastos/${entry.id}`}>{entry.title}</Link>
      <small>{formatDate(date)} · {entry.category} · {frequencyLabel[entry.frequency]}{team ? ` · Equipo de ${entry.members!.length}: ${money(Math.ceil(entry.amount / entry.members!.length), entry.currency)} c/u` : ""}</small>
      {paid && payer ? <small>Pagó {personName(payer)}</small> : mode === "planned" && entry.notes ? <small>{entry.notes}</small> : mode === "movement" ? <small>Creado por {personName(entry.createdBy)}</small> : null}
    </div>
    <div className={styles.amount}>
      <strong>{money(entry.amount, entry.currency)}</strong>
      {mode === "planned" ? <Chip size="sm" tone={days <= 30 ? "amber" : "neutral"}>{days === 0 ? "Hoy" : days === 1 ? "Mañana" : `En ${days} días`}</Chip>
        : <Chip size="sm" tone={paid ? "green" : date < today ? "coral" : "amber"}>{paid ? expense ? "Pagado" : "Cobrado" : date < today ? "Vencido" : "Previsto"}</Chip>}
    </div>
    {paid && team ? <SharesButton entry={entry} date={date} disabled={busy} onToggle={onShares} /> : null}
    {paid ? <Button size="sm" variant="text" disabled={busy} icon={<Undo2 size={15} aria-hidden="true" />} aria-label={`Marcar pendiente ${entry.title} ${date}`} onClick={() => onSettle(false)}>{expense ? "Deshacer pago" : "Deshacer cobro"}</Button>
      : expense ? <PayButton entry={entry} date={date} disabled={busy} onPay={onPay} />
      : <Button size="sm" variant="secondary" disabled={busy} icon={<Check size={15} aria-hidden="true" />} aria-label={`Marcar cobrado ${entry.title} ${date}`} onClick={() => onSettle(true)}>Marcar cobrado</Button>}
    {mode === "movement" ? <IconButton variant="plain" disabled={busy} aria-label={`Archivar plan ${entry.title}`} onClick={onArchive}><Archive size={16} aria-hidden="true" /></IconButton> : null}
  </li>;
}
