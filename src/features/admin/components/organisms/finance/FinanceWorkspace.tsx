"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsPanel } from "@ui-sdk/react/tabs";
import { Archive, ArchiveRestore, ArrowDownLeft, ArrowUpRight, Check, ChevronLeft, ChevronRight, List, CalendarDays, Plus, CalendarClock } from "lucide-react";
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
import { archiveFinanceEntry, settleFinanceEntry } from "@/features/admin/actions/finance";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import { financeOccurrences, financeTotals, money, type Currency } from "@/features/admin/lib/finance";
import { localDate, formatDate } from "@/features/admin/lib/dates";
import { normalizeText } from "@/features/admin/lib/text";
import { personName } from "@/features/admin/lib/people";
import { WorkspaceStatus } from "../workspace/WorkspaceParts";
import { financeStyles as styles } from "./finance-styles";

const months = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat("es-GT", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, index, 15))));
export function FinanceWorkspace() {
  const data = useWorkspace("financeEntries"), { params, update } = useAdminQuery();
  const today = localDate(new Date()), requestedYear = Number(params.get("year")), year = requestedYear >= 1900 && requestedYear <= 2200 ? requestedYear : Number(today.slice(0, 4));
  const archived = params.get("archived") === "yes", q = params.get("q") ?? "", currency = params.get("currency") ?? "all", kind = params.get("kind") ?? "all", status = params.get("status") ?? "all", month = params.get("month") ?? "all";
  const view = params.get("view") === "forecast" ? "forecast" : params.get("view") === "planned" ? "planned" : "movements";
  const results = useRef<HTMLDivElement>(null), focusResults = useRef(false);
  useEffect(() => { if (view === "movements" && focusResults.current) { focusResults.current = false; results.current?.focus(); } }, [view, month]);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const occurrences = financeOccurrences(data.items, year);
  // Gastos previstos: lo que falta pagar en los próximos 12 meses (cruza el cambio de año).
  const horizon = `${Number(today.slice(0, 4)) + 1}${today.slice(4)}`;
  const thisYear = Number(today.slice(0, 4));
  const planned = [...financeOccurrences(data.items, thisYear), ...financeOccurrences(data.items, thisYear + 1)].filter((item) => item.entry.kind === "expense" && !item.paid && item.date >= today && item.date < horizon);
  const filtered = occurrences.filter((item) => (currency === "all" || item.entry.currency === currency) && (kind === "all" || item.entry.kind === kind) && (status === "all" || (status === "paid") === item.paid) && (month === "all" || Number(item.date.slice(5, 7)) === Number(month)) && normalizeText(`${item.entry.title} ${item.entry.category} ${item.entry.notes}`).includes(normalizeText(q)));
  async function run(action: () => Promise<{ ok: boolean; error?: string }>) { if (busy) return; setBusy(true); setError(""); try { const result = await action(); if (!result.ok) setError(result.error ?? "No se pudo guardar."); } catch { setError("No se pudo guardar. Revisa tu conexión."); } finally { setBusy(false); } }
  return <section className={styles.workspace}>
    <ScreenHeader title="Gastos e ingresos" subtitle="Costos de Daury, pagos previstos y entradas de dinero." right={<Button icon={<Plus size={18} aria-hidden="true" />} render={<Link href="/admin/gastos/nuevo" />}>Nuevo movimiento</Button>} />
    <WorkspaceStatus loading={false} errors={[data.error, error]} />
    {data.loading ? <FinanceSkeleton /> : <>
    <div className={styles.yearBar}><div className={styles.year}><IconButton aria-label="Año anterior" variant="plain" disabled={year <= 1900} onClick={() => update({ year: String(year - 1) })}><ChevronLeft size={19} aria-hidden="true" /></IconButton><h2>{year}</h2><IconButton aria-label="Año siguiente" variant="plain" disabled={year >= 2200} onClick={() => update({ year: String(year + 1) })}><ChevronRight size={19} aria-hidden="true" /></IconButton></div><Button size="sm" variant={archived ? "soft" : "text"} aria-pressed={archived} icon={<Archive size={15} aria-hidden="true" />} onClick={() => update({ archived: archived ? null : "yes" })}>{archived ? "Ver activos" : "Ver archivados"}</Button></div>
    {!archived ? <>
      <div className={styles.summary}>{(["USD", "GTQ"] as Currency[]).map((unit) => { const totals = financeTotals(occurrences, unit); return <Card key={unit}><span className={styles.currency}>{unit === "USD" ? "Dólares · USD" : "Quetzales · GTQ"}</span><div className={styles.totals}><div><span>Costos del año</span><strong>{money(totals.expense, unit)}</strong><small>Pagado {money(totals.paidExpense, unit)} · Pendiente {money(totals.expense - totals.paidExpense, unit)}</small></div><div><span>Ingresos del año</span><strong>{money(totals.income, unit)}</strong><small>Cobrado {money(totals.paidIncome, unit)}</small></div><div><span>Balance previsto</span><strong data-negative={totals.balance < 0 || undefined}>{money(totals.balance, unit)}</strong><small>Ingresos menos costos programados</small></div></div></Card>; })}</div>
      <p className={styles.hint}>Los totales incluyen todos los vencimientos del año y se mantienen separados por moneda.</p>
      <Tabs value={view} onValueChange={(value) => update({ view: value === "forecast" || value === "planned" ? value : null })}>
        <div className={styles.tabs}><SegmentedTabs label="Vistas de gastos" options={[{ value: "movements", label: "Movimientos", icon: <List size={16} aria-hidden="true" /> }, { value: "planned", label: "Gastos previstos", icon: <CalendarClock size={16} aria-hidden="true" /> }, { value: "forecast", label: "Previsión mensual", icon: <CalendarDays size={16} aria-hidden="true" /> }]} /></div>
        <TabsPanel value="movements" className={styles.tabPanel} ref={results} tabIndex={-1}>
      <div className={styles.filters}><SearchField aria-label="Buscar movimientos" placeholder="Concepto, categoría o notas…" value={q} onValueChange={(value) => update({ q: value || null })} /><SelectField label="Moneda de los movimientos" hideLabel value={currency} options={[{ value: "all", label: "Ambas monedas" }, { value: "USD", label: "Dólares" }, { value: "GTQ", label: "Quetzales" }]} onChange={(value) => update({ currency: value === "all" ? null : value })} /><SelectField label="Tipo de movimientos" hideLabel value={kind} options={[{ value: "all", label: "Ingresos y egresos" }, { value: "expense", label: "Egresos" }, { value: "income", label: "Ingresos" }]} onChange={(value) => update({ kind: value === "all" ? null : value })} /><SelectField label="Estado de los movimientos" hideLabel value={status} options={[{ value: "all", label: "Todos los estados" }, { value: "planned", label: "Previstos" }, { value: "paid", label: "Pagados / cobrados" }]} onChange={(value) => update({ status: value === "all" ? null : value })} /><SelectField label="Mes de los movimientos" hideLabel value={month} options={[{ value: "all", label: "Todo el año" }, ...months.map((label, index) => ({ value: String(index + 1), label }))]} onChange={(value) => update({ month: value === "all" ? null : value })} /></div>
      <Card padding="none"><div className={styles.sectionHead}><h3>Movimientos programados</h3><span>{filtered.length}</span></div>{filtered.length ? <ul className={styles.movements}>{filtered.map((item) => <li className={styles.movement} key={item.key}><span className={styles.kind} data-kind={item.entry.kind}>{item.entry.kind === "expense" ? <ArrowUpRight size={21} aria-hidden="true" /> : <ArrowDownLeft size={21} aria-hidden="true" />}</span><div className={styles.info}><Link href={`/admin/gastos/${item.entry.id}`}>{item.entry.title}</Link><small>{formatDate(item.date)} · {item.entry.category} · {item.entry.frequency === "monthly" ? "Mensual" : item.entry.frequency === "yearly" ? "Anual" : "Pago único"}</small><small>Creado por {personName(item.entry.createdBy)}</small></div><div className={styles.amount}><strong>{money(item.entry.amount, item.entry.currency)}</strong><Chip size="sm" tone={item.paid ? "green" : item.date < today ? "coral" : "amber"}>{item.paid ? item.entry.kind === "expense" ? "Pagado" : "Cobrado" : item.date < today ? "Vencido" : "Previsto"}</Chip></div><Button size="sm" variant={item.paid ? "text" : "secondary"} disabled={busy} icon={item.paid ? undefined : <Check size={15} aria-hidden="true" />} aria-label={`${item.paid ? "Marcar pendiente" : item.entry.kind === "expense" ? "Marcar pagado" : "Marcar cobrado"} ${item.entry.title} ${item.date}`} onClick={() => run(() => settleFinanceEntry(item.entry.id, item.entry.revision, item.date, !item.paid))}>{item.paid ? item.entry.kind === "expense" ? "Deshacer pago" : "Deshacer cobro" : item.entry.kind === "expense" ? "Marcar pagado" : "Marcar cobrado"}</Button><IconButton variant="plain" disabled={busy} aria-label={`Archivar plan ${item.entry.title}`} onClick={() => run(() => archiveFinanceEntry(item.entry.id, item.entry.revision, true))}><Archive size={16} aria-hidden="true" /></IconButton></li>)}</ul> : <EmptyState icon={<Archive size={25} aria-hidden="true" />} tone="blue" title="No hay movimientos para este período">Crea un movimiento o ajusta los filtros.</EmptyState>}</Card>
        </TabsPanel>
        <TabsPanel value="planned" className={styles.tabPanel}>
          <Card padding="none">
            <div className={styles.sectionHead}>
              <div className="min-w-0"><h3>Gastos previstos</h3><p className="m-0 mt-[4px] text-ink-soft text-[13px] leading-[1.5]">Pendiente en los próximos 12 meses: {(["USD", "GTQ"] as Currency[]).map((unit) => money(planned.filter((item) => item.entry.currency === unit).reduce((sum, item) => sum + item.entry.amount, 0), unit)).join(" · ")}</p></div>
              <Button size="sm" variant="secondary" icon={<Plus size={15} aria-hidden="true" />} render={<Link href="/admin/gastos/nuevo" />}>Agregar gasto previsto</Button>
            </div>
            {planned.length ? <ul className={styles.movements}>{planned.map((item) => {
              const days = Math.round((Date.parse(item.date) - Date.parse(today)) / 86400000);
              return <li className={styles.movement} key={item.key}><span className={styles.kind} data-kind="expense"><CalendarClock size={20} aria-hidden="true" /></span><div className={styles.info}><Link href={`/admin/gastos/${item.entry.id}`}>{item.entry.title}</Link><small>{formatDate(item.date)} · {item.entry.category} · {item.entry.frequency === "monthly" ? "Mensual" : item.entry.frequency === "yearly" ? "Anual" : "Pago único"}</small>{item.entry.notes ? <small>{item.entry.notes}</small> : null}</div><div className={styles.amount}><strong>{money(item.entry.amount, item.entry.currency)}</strong><Chip size="sm" tone={days <= 30 ? "amber" : "neutral"}>{days === 0 ? "Hoy" : days === 1 ? "Mañana" : `En ${days} días`}</Chip></div><Button size="sm" variant="secondary" disabled={busy} icon={<Check size={15} aria-hidden="true" />} aria-label={`Marcar pagado ${item.entry.title} ${item.date}`} onClick={() => run(() => settleFinanceEntry(item.entry.id, item.entry.revision, item.date, true))}>Marcar pagado</Button></li>;
            })}</ul> : <EmptyState icon={<CalendarClock size={25} aria-hidden="true" />} tone="amber" title="No hay gastos previstos">Registra un gasto con su fecha prevista: licencias, dominio, servicios.</EmptyState>}
          </Card>
        </TabsPanel>
        <TabsPanel value="forecast" className={styles.tabPanel}>
          <Card padding="none" className={styles.schedule}><div className={styles.sectionHead}><h3>Previsión mensual</h3><Link href={`/admin/calendarios?month=${year}-01`}>Ver en calendario <ArrowUpRight size={14} aria-hidden="true" /></Link></div><div className={styles.scroll}><table><caption className="sr-only">Costos e ingresos programados por mes, separados por moneda</caption><thead><tr><th scope="col">Mes</th><th scope="col">Egresos USD</th><th scope="col">Ingresos USD</th><th scope="col">Egresos GTQ</th><th scope="col">Ingresos GTQ</th></tr></thead><tbody>{months.map((label, index) => { const items = occurrences.filter((item) => Number(item.date.slice(5, 7)) === index + 1), usd = financeTotals(items, "USD"), gtq = financeTotals(items, "GTQ"); return <tr key={label}><th scope="row"><Button size="sm" variant="text" onClick={() => { focusResults.current = true; update({ month: String(index + 1), view: null }); }}>{label}</Button></th><td>{money(usd.expense, "USD")}</td><td>{money(usd.income, "USD")}</td><td>{money(gtq.expense, "GTQ")}</td><td>{money(gtq.income, "GTQ")}</td></tr>; })}</tbody></table></div></Card>
        </TabsPanel>
      </Tabs>
    </> : <Card><h3>Planes y movimientos archivados</h3><ul className={styles.movements}>{data.items.filter((entry) => entry.archived).map((entry) => <li key={entry.id} className={styles.movement}><div className={styles.info}><b>{entry.title}</b><small>{money(entry.amount, entry.currency)} · Creado por {personName(entry.createdBy)}</small></div><Button size="sm" variant="secondary" disabled={busy} icon={<ArchiveRestore size={16} aria-hidden="true" />} onClick={() => run(() => archiveFinanceEntry(entry.id, entry.revision, false))}>Restaurar</Button></li>)}</ul>{!data.items.some((entry) => entry.archived) ? <p className={styles.hint}>No hay movimientos archivados.</p> : null}</Card>}
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
      <div className={styles.filters}>{[0, 1, 2, 3, 4].map((field) => <Skeleton key={field} height={40} radius={9} />)}</div>
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
