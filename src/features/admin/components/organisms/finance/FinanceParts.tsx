"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Toggle } from "@ui-sdk/react/toggle";
import { AlertTriangle, ArrowDownLeft, ArrowRight, BadgeCheck, CalendarClock, Check, CircleDashed, Pencil, Archive, Undo2, Users, Wallet } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { Chip } from "@/ui/atoms/Chip";
import { ProgressBar } from "@/ui/atoms/ProgressBar";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import { formatDate } from "@/features/admin/lib/dates";
import { getAdminFirebase } from "@/features/admin/lib/firebase-client";
import { isTeamExpense, money, occurrenceShares, splitShares, teamLedger, type Currency, type FinanceEntry, type FinanceOccurrence, type LedgerItem } from "@/features/admin/lib/finance";
import { personName } from "@/features/admin/lib/people";
import type { Tone } from "@/ui/lib/tones";
import { AvatarStack, DebtRow, PayButton, teamMembers } from "./TeamSplit";

export const monthNames = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat("es-GT", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, index, 15))));
const firstName = (email: string) => personName(email).split(/[\s(]/)[0];
const frequencyLabel = { monthly: "Mensual", yearly: "Anual", once: "Pago único" } as const;
const categoryTones: Tone[] = ["blue", "violet", "green", "amber", "coral"];
/** Color estable por categoría (el mismo nombre siempre da el mismo tono). */
export const categoryTone = (category: string): Tone => categoryTones[Array.from(category.toLowerCase()).reduce((sum, char) => sum + char.charCodeAt(0), 0) % categoryTones.length];
const daysUntil = (date: string, today: string) => Math.round((Date.parse(date) - Date.parse(today)) / 86400000);
const card = "rounded-[var(--r-xl,22px)] bg-surface [box-shadow:inset_0_0_0_1px_var(--rule)]";
const eyebrow = "m-0 text-ink-soft text-[11.5px] font-semibold uppercase tracking-[0.07em] font-mono";

/** Correo de la sesión de Firebase (se suscribe al estado de autenticación; vacío en pruebas). */
export function useSessionEmail() {
  const [email, setEmail] = useState("");
  useEffect(() => {
    try { return onAuthStateChanged(getAdminFirebase().auth, (user) => setEmail(user?.email?.toLowerCase() ?? "")); } catch { return undefined; }
  }, []);
  return email;
}

// ——— Resumen ———
type OverviewProps = { year: number; currency: Currency; occurrences: FinanceOccurrence[]; entries: FinanceEntry[]; me: string; today: string; busy: ReadonlySet<string>; onPay: (item: FinanceOccurrence, payer: string) => void; onOverdue: () => void; onTeam: () => void };
export function Overview({ year, currency, occurrences, entries, me, today, busy, onPay, onOverdue, onTeam }: OverviewProps) {
  const items = occurrences.filter((item) => item.entry.currency === currency);
  const expenses = items.filter((item) => item.entry.kind === "expense"), incomes = items.filter((item) => item.entry.kind === "income");
  const total = expenses.reduce((sum, item) => sum + item.entry.amount, 0), paid = expenses.filter((item) => item.paid).reduce((sum, item) => sum + item.entry.amount, 0);
  const income = incomes.reduce((sum, item) => sum + item.entry.amount, 0);
  const overdue = expenses.filter((item) => !item.paid && item.date < today);
  const next = expenses.find((item) => !item.paid && item.date >= today);
  const ledger = useMemo(() => teamLedger(entries), [entries]);
  const mine = ledger.people.find((person) => person.member === me && person.currency === currency);
  const myDebts = ledger.debts.filter((debt) => debt.currency === currency && (debt.from === me || debt.to === me)).slice(0, 3);
  return (
    <div className="grid grid-cols-[1.35fr_1fr_1fr] gap-[16px] max-[1180px]:grid-cols-2 max-[700px]:grid-cols-1">
      <section className={`${card} p-[24px] flex flex-col gap-[14px] max-[1180px]:col-span-full`} aria-labelledby="gasto-anual">
        <div className="flex items-center justify-between gap-[12px]"><h2 id="gasto-anual" className={eyebrow}>Gastado en {year} · {currency}</h2>{overdue.length ? <button type="button" onClick={onOverdue} className="inline-flex items-center gap-[6px] h-[26px] px-[10px] rounded-full border-0 bg-[var(--coral-soft)] text-[var(--coral-deep)] text-[12px] font-semibold cursor-pointer hover:brightness-95"><AlertTriangle size={13} aria-hidden="true" />{overdue.length} {overdue.length === 1 ? "vencido" : "vencidos"}</button> : null}</div>
        <p className="m-0 flex items-baseline gap-[10px] flex-wrap"><strong className="font-display text-[clamp(32px,3.2vw,44px)] font-semibold tracking-[-0.03em] leading-[1] tabular-nums">{money(paid, currency)}</strong><span className="text-ink-soft text-[14px] tabular-nums">de {money(total, currency)} programados</span></p>
        <ProgressBar value={paid} max={Math.max(total, 1)} label={`Pagado ${money(paid, currency)} de ${money(total, currency)}`} tone="blue" />
        <dl className="m-0 grid grid-cols-3 gap-[12px] pt-[6px] [&_dt]:text-ink-soft [&_dt]:text-[12px] [&_dd]:m-0 [&_dd]:mt-[2px] [&_dd]:font-semibold [&_dd]:text-[15px] [&_dd]:tabular-nums max-[480px]:grid-cols-1">
          <div><dt>Pendiente</dt><dd>{money(total - paid, currency)}</dd></div>
          <div><dt>Ingresos</dt><dd className="text-[var(--green-deep)]">{money(income, currency)}</dd></div>
          <div><dt>Balance previsto</dt><dd className={income - total < 0 ? "text-[var(--coral)]" : ""}>{money(income - total, currency)}</dd></div>
        </dl>
      </section>
      <section className={`${card} p-[24px] flex flex-col gap-[12px]`} aria-labelledby="proximo-pago">
        <h2 id="proximo-pago" className={eyebrow}>Próximo pago</h2>
        {next ? <>
          <div className="flex items-start gap-[12px]">
            <CategoryTile category={next.entry.category} />
            <div className="min-w-0 flex-1"><Link href={`/admin/gastos/${next.entry.id}`} className="block text-ink font-semibold text-[16px] leading-[1.3] no-underline hover:text-brand truncate">{next.entry.title}</Link><span className="text-ink-soft text-[13px]">{formatDate(next.date)}</span></div>
          </div>
          <p className="m-0 flex items-baseline justify-between gap-[10px]"><strong className="font-display text-[26px] font-semibold tracking-[-0.02em] tabular-nums">{money(next.entry.amount, currency)}</strong><Chip size="sm" tone={daysUntil(next.date, today) <= 7 ? "amber" : "neutral"}>{countdown(next.date, today)}</Chip></p>
          {isTeamExpense(next.entry) ? <p className="m-0 flex items-center gap-[8px] text-ink-soft text-[12.5px]"><AvatarStack members={next.entry.members!} max={5} />{money(Math.ceil(next.entry.amount / next.entry.members!.length), currency)} c/u</p> : null}
          <div className="mt-auto"><PayButton entry={next.entry} date={next.date} disabled={busy.has(next.key)} onPay={(payer) => onPay(next, payer)} /></div>
        </> : <p className="m-0 text-ink-soft text-[14px] leading-[1.5]">No hay pagos pendientes en {currency} para lo que queda del año.</p>}
      </section>
      <section className={`${card} p-[24px] flex flex-col gap-[12px]`} aria-labelledby="tu-saldo">
        <h2 id="tu-saldo" className={eyebrow}>Tu saldo en el equipo</h2>
        {mine ? <>
          <strong className={`font-display text-[26px] font-semibold tracking-[-0.02em] tabular-nums ${mine.balance > 0 ? "text-[var(--green-deep)]" : mine.balance < 0 ? "text-[var(--coral)]" : ""}`}>{mine.balance > 0 ? `Te deben ${money(mine.balance, currency)}` : mine.balance < 0 ? `Debes ${money(-mine.balance, currency)}` : "Estás al día"}</strong>
          <ul className="m-0 p-0 list-none flex flex-col gap-[6px] text-[13px]">
            {myDebts.map((debt) => <li key={`${debt.from}-${debt.to}`} className="flex items-center justify-between gap-[8px]"><span className="truncate">{debt.from === me ? `Le debes a ${firstName(debt.to)}` : `${firstName(debt.from)} te debe`}</span><b className="tabular-nums">{money(debt.amount, currency)}</b></li>)}
          </ul>
        </> : <p className="m-0 text-ink-soft text-[14px] leading-[1.5]">{me ? "No participas en gastos de equipo pagados en esta moneda." : "Los gastos de equipo pagados aparecen aquí."}</p>}
        <div className="mt-auto"><Button size="sm" variant="text" icon={<ArrowRight size={15} aria-hidden="true" />} iconPosition="trailing" onClick={onTeam}>Ver saldos del equipo</Button></div>
      </section>
    </div>
  );
}
const countdown = (date: string, today: string) => { const days = daysUntil(date, today); return days < 0 ? `Venció hace ${-days} ${days === -1 ? "día" : "días"}` : days === 0 ? "Hoy" : days === 1 ? "Mañana" : `En ${days} días`; };

// ——— Gráfica mensual ———
export function MonthChart({ currency, occurrences, month, onMonth }: { currency: Currency; occurrences: FinanceOccurrence[]; month: string; onMonth: (month: string | null) => void }) {
  const bars = monthNames.map((label, index) => {
    const items = occurrences.filter((item) => item.entry.currency === currency && item.entry.kind === "expense" && Number(item.date.slice(5, 7)) === index + 1);
    const paid = items.filter((item) => item.paid).reduce((sum, item) => sum + item.entry.amount, 0), total = items.reduce((sum, item) => sum + item.entry.amount, 0);
    return { label, month: String(index + 1), paid, total };
  });
  const max = Math.max(1, ...bars.map((bar) => bar.total));
  return (
    <section className={`${card} px-[24px] pt-[20px] pb-[16px]`} aria-labelledby="gasto-mensual">
      <div className="flex items-center justify-between gap-[12px] mb-[14px]">
        <h2 id="gasto-mensual" className={eyebrow}>Gasto por mes · {currency}</h2>
        <span className="flex items-center gap-[14px] text-ink-soft text-[12px]"><span className="inline-flex items-center gap-[6px]"><i className="w-[10px] h-[10px] rounded-[3px] bg-[var(--blue)]" />Pagado</span><span className="inline-flex items-center gap-[6px]"><i className="w-[10px] h-[10px] rounded-[3px] bg-[var(--blue-soft)] [box-shadow:inset_0_0_0_1px_var(--blue)]" />Pendiente</span>{month !== "all" ? <Button size="sm" variant="text" onClick={() => onMonth(null)}>Ver todo el año</Button> : null}</span>
      </div>
      <div className="grid grid-cols-12 gap-[8px] h-[150px] items-end max-[640px]:gap-[4px]">
        {bars.map((bar) => {
          const active = month === bar.month, dim = month !== "all" && !active;
          return (
            <button key={bar.month} type="button" aria-pressed={active} aria-label={`${bar.label}: pagado ${money(bar.paid, currency)}, pendiente ${money(bar.total - bar.paid, currency)}`} onClick={() => onMonth(active ? null : bar.month)}
              className={`group h-full flex flex-col justify-end items-stretch gap-[6px] border-0 bg-transparent p-0 cursor-pointer rounded-[8px] focus-visible:outline-2 focus-visible:outline-[var(--blue)] ${dim ? "opacity-40" : ""}`}>
              <span className="relative flex-1 flex flex-col justify-end rounded-[7px] overflow-hidden group-hover:bg-[var(--bg-2)] transition-colors" title={`${bar.label}: ${money(bar.total, currency)}`}>
                {bar.total ? <span className="flex flex-col justify-end rounded-[6px] overflow-hidden" style={{ height: `${Math.max(4, (bar.total / max) * 100)}%` }}>
                  <span className="bg-[var(--blue-soft)] [box-shadow:inset_0_0_0_1px_var(--blue)] rounded-t-[6px]" style={{ flex: bar.total - bar.paid }} />
                  <span className="bg-[var(--blue)]" style={{ flex: bar.paid }} />
                </span> : <span className="h-[3px] rounded-full bg-[var(--rule)]" />}
              </span>
              <span aria-hidden="true" className={`text-center text-[11px] font-semibold uppercase ${active ? "text-[var(--blue)]" : "text-ink-soft"}`}><span className="max-[640px]:hidden">{bar.label.slice(0, 3)}</span><span className="hidden max-[640px]:inline">{bar.label.slice(0, 1)}</span></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ——— Filas ———
export function CategoryTile({ category, income = false }: { category: string; income?: boolean }) {
  return <span data-tone={income ? "green" : categoryTone(category)} className="grid place-items-center w-[40px] h-[40px] flex-none rounded-[12px] bg-[var(--tone-soft)] text-[var(--tone-ink)]" aria-hidden="true">{income ? <ArrowDownLeft size={19} /> : <Wallet size={18} />}</span>;
}

/** Quién pagó y quién no: cada integrante es un botón que registra si ya devolvió su parte. */
export function PaymentTracker({ entry, date, disabled, onShares }: { entry: FinanceEntry; date: string; disabled: boolean; onShares: (members: string[], settled: boolean) => void }) {
  const detail = occurrenceShares(entry, date);
  if (!isTeamExpense(entry)) return null;
  if (!detail) {
    const share = splitShares(entry.amount, entry.members!)[entry.members![0]];
    return <div className="flex items-center gap-[8px] text-ink-soft text-[12.5px]"><AvatarStack members={entry.members!} max={6} /><span>Se divide entre {entry.members!.length} · {money(share, entry.currency)} c/u</span></div>;
  }
  const pending = detail.shares.filter((item) => item.state === "pending"), owed = pending.reduce((sum, item) => sum + item.share, 0);
  return (
    <div className="flex items-center gap-[10px] flex-wrap" role="group" aria-label={`Quién ha pagado su parte de ${entry.title}`}>
      <span className="flex items-center gap-[4px]">
        {detail.shares.map(({ member, share, state }) => state === "payer"
          ? <span key={member} title={`${personName(member)} pagó el total`} className="relative rounded-full [box-shadow:0_0_0_2px_var(--surface),0_0_0_3.5px_var(--blue)]"><Avatar name={personName(member)} size={26} tone="blue" /><Wallet size={11} aria-hidden="true" className="absolute -right-[3px] -bottom-[3px] p-[1.5px] rounded-full bg-[var(--blue)] text-white box-content" /><span className="sr-only">{personName(member)} pagó el total</span></span>
          : <Toggle key={member} pressed={state === "settled"} disabled={disabled} onPressedChange={(pressed) => onShares([member], pressed)} aria-label={`${personName(member)} pagó su parte (${money(share, entry.currency)})`} title={`${personName(member)} · ${money(share, entry.currency)} · ${state === "settled" ? "pagó" : "pendiente"}`}
              className="relative grid p-0 border-0 bg-transparent rounded-full cursor-pointer transition-[filter,opacity] [filter:grayscale(1)] opacity-55 [box-shadow:0_0_0_2px_var(--surface),0_0_0_3.5px_var(--rule-strong)] hover:opacity-90 data-[pressed]:[filter:none] data-[pressed]:opacity-100 data-[pressed]:[box-shadow:0_0_0_2px_var(--surface),0_0_0_3.5px_var(--green)] disabled:cursor-progress focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--blue)] group">
              <Avatar name={personName(member)} size={26} tone="green" />
              <Check size={10} strokeWidth={3.5} aria-hidden="true" className="absolute -right-[3px] -bottom-[3px] p-[2px] rounded-full bg-[var(--green)] text-white box-content hidden group-data-[pressed]:block" />
            </Toggle>)}
      </span>
      <span className={`text-[12.5px] font-medium ${pending.length ? "text-[var(--ink-2)]" : "text-[var(--green-deep)]"}`}>
        {pending.length ? <>Faltan {pending.length} · <b className="tabular-nums">{money(owed, entry.currency)}</b> para {firstName(detail.payer)}</> : <span className="inline-flex items-center gap-[5px]"><BadgeCheck size={14} aria-hidden="true" />Todos pagaron su parte</span>}
      </span>
      {pending.length > 1 ? <Button size="sm" variant="text" disabled={disabled} onClick={() => onShares(pending.map((item) => item.member), true)}>Todos pagaron</Button> : null}
    </div>
  );
}

export type RowHandlers = { onPay: (payer: string) => void; onSettle: (paid: boolean) => void; onShares: (members: string[], settled: boolean) => void; onArchive: () => void; onEdit: () => void };
/** Un vencimiento: categoría, concepto, quién pagó y quién no, importe, estado y acciones. */
export function ExpenseRow({ item, today, busy, showCountdown = false, handlers }: { item: FinanceOccurrence; today: string; busy: boolean; showCountdown?: boolean; handlers: RowHandlers }) {
  const { entry, date, paid } = item, expense = entry.kind === "expense", payer = entry.payers?.[date];
  const overdue = !paid && date < today;
  const status = paid ? { tone: "green" as Tone, label: expense ? "Pagado" : "Cobrado" } : overdue ? { tone: "coral" as Tone, label: "Vencido" } : { tone: "amber" as Tone, label: "Previsto" };
  return (
    <li aria-busy={busy || undefined} className="grid grid-cols-[40px_minmax(0,1fr)_auto_auto] items-start gap-x-[14px] gap-y-[10px] py-[16px] px-[20px] border-t border-rule first:border-t-0 transition-colors hover:bg-[color-mix(in_srgb,var(--bg-2)_45%,transparent)] aria-busy:opacity-70 max-[760px]:grid-cols-[40px_minmax(0,1fr)] max-[760px]:px-[16px]">
      <CategoryTile category={entry.category} income={!expense} />
      <div className="min-w-0 flex flex-col gap-[6px]">
        <div className="min-w-0">
          <Link href={`/admin/gastos/${entry.id}`} className="text-ink text-[15px] font-semibold leading-[1.35] no-underline hover:text-brand [overflow-wrap:anywhere]">{entry.title}</Link>
          <p className="m-0 mt-[2px] text-ink-soft text-[12.5px] leading-[1.5]">{formatDate(date)} · {entry.category} · {frequencyLabel[entry.frequency]}{paid && payer && !isTeamExpense(entry) ? ` · Pagó ${personName(payer)}` : ""}</p>
        </div>
        <PaymentTracker entry={entry} date={date} disabled={busy} onShares={handlers.onShares} />
      </div>
      <div className="flex flex-col items-end gap-[6px] tabular-nums max-[760px]:col-start-2 max-[760px]:flex-row max-[760px]:items-center max-[760px]:justify-start">
        <strong className={`text-[16px] font-semibold leading-[1.35] ${expense ? "text-ink" : "text-[var(--green-deep)]"}`}>{expense ? "" : "+"}{money(entry.amount, entry.currency)}</strong>
        {showCountdown && !paid ? <Chip size="sm" tone={overdue ? "coral" : daysUntil(date, today) <= 30 ? "amber" : "neutral"}>{countdown(date, today)}</Chip> : <Chip size="sm" tone={status.tone} dot>{status.label}</Chip>}
      </div>
      <div className="flex items-center gap-[4px] max-[760px]:col-start-2 max-[760px]:gap-[6px]">
        {paid ? null : expense ? <PayButton entry={entry} date={date} disabled={busy} onPay={handlers.onPay} />
          : <Button size="sm" variant="secondary" disabled={busy} icon={<Check size={15} aria-hidden="true" />} aria-label={`Marcar cobrado ${entry.title} ${date}`} onClick={() => handlers.onSettle(true)}>Cobrado</Button>}
        <ActionMenu label={`Acciones de ${entry.title} ${date}`} size="sm" onAction={(value) => { if (value === "undo") handlers.onSettle(false); if (value === "edit") handlers.onEdit(); if (value === "archive") handlers.onArchive(); }}
          actions={[...(paid ? [{ value: "undo", label: expense ? "Deshacer pago" : "Deshacer cobro", icon: <Undo2 size={16} aria-hidden="true" /> }] : []), { value: "edit", label: "Editar plan", icon: <Pencil size={16} aria-hidden="true" /> }, { value: "archive", label: "Archivar plan", icon: <Archive size={16} aria-hidden="true" />, danger: true, separatorBefore: true }]} />
      </div>
    </li>
  );
}

/** Lista agrupada con encabezado y total por grupo (mes o plazo). */
export function GroupedList({ groups, empty, render }: { groups: { key: string; title: string; note?: ReactNode; items: FinanceOccurrence[] }[]; empty: ReactNode; render: (item: FinanceOccurrence) => ReactNode }) {
  const visible = groups.filter((group) => group.items.length);
  if (!visible.length) return <div className={`${card} py-[44px] px-[24px] text-center`}>{empty}</div>;
  return (
    <div className="flex flex-col gap-[16px]">
      {visible.map((group) => (
        <section key={group.key} className={`${card} overflow-hidden`} aria-label={group.title}>
          <header className="flex items-center justify-between gap-[12px] py-[12px] px-[20px] bg-[color-mix(in_srgb,var(--bg-2)_55%,var(--surface))] border-b border-rule max-[760px]:px-[16px]">
            <h3 className="m-0 font-display text-[15px] font-semibold capitalize">{group.title}</h3>
            <span className="text-ink-soft text-[12.5px] tabular-nums">{group.note}</span>
          </header>
          <ul className="m-0 p-0 list-none">{group.items.map(render)}</ul>
        </section>
      ))}
    </div>
  );
}
export function groupTotals(items: FinanceOccurrence[]) {
  return (["USD", "GTQ"] as Currency[]).map((unit) => {
    const list = items.filter((item) => item.entry.currency === unit && item.entry.kind === "expense");
    return list.length ? money(list.reduce((sum, item) => sum + item.entry.amount, 0), unit) : "";
  }).filter(Boolean).join(" · ");
}

// ——— Equipo ———
type TeamProps = { entries: FinanceEntry[]; currency: Currency; me: string; busy: ReadonlySet<string>; onSettle: (items: LedgerItem[], key: string) => void; onShares: (entry: FinanceEntry, date: string, members: string[], settled: boolean) => void };
export function TeamView({ entries, currency, me, busy, onSettle, onShares }: TeamProps) {
  const ledger = useMemo(() => teamLedger(entries), [entries]);
  const [onlyPending, setOnlyPending] = useState(true);
  const people = ledger.people.filter((person) => person.currency === currency), debts = ledger.debts.filter((debt) => debt.currency === currency);
  const rows = useMemo(() => entries.filter((entry) => !entry.archived && isTeamExpense(entry) && entry.currency === currency)
    .flatMap((entry) => entry.paidDates.map((date) => ({ entry, date, detail: occurrenceShares(entry, date) })))
    .filter((row): row is typeof row & { detail: NonNullable<typeof row.detail> } => Boolean(row.detail))
    .toSorted((a, b) => b.date.localeCompare(a.date)), [entries, currency]);
  const shown = onlyPending ? rows.filter((row) => row.detail.shares.some((share) => share.state === "pending")) : rows;
  const columns = teamMembers.filter((member) => rows.some((row) => row.entry.members!.includes(member)));
  if (!rows.length) return (
    <div className={`${card} py-[48px] px-[24px] flex flex-col items-center gap-[10px] text-center`}>
      <span className="grid place-items-center w-[52px] h-[52px] rounded-[16px] bg-[var(--blue-soft)] text-[var(--blue)]"><Users size={24} aria-hidden="true" /></span>
      <h3 className="m-0 font-display text-[18px] font-semibold">Aún no hay gastos de equipo pagados en {currency}</h3>
      <p className="m-0 max-w-[460px] text-ink-soft text-[14px] leading-[1.55]">Activa «Gasto de equipo» al crear un gasto para dividirlo. Cuando lo marques como pagado, aquí verás quién ha pagado su parte y quién no.</p>
      <Button size="sm" render={<Link href="/admin/gastos/nuevo" />}>Nuevo gasto de equipo</Button>
    </div>
  );
  return (
    <div className="flex flex-col gap-[18px]">
      <ul className="m-0 p-0 list-none grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-[12px] max-[560px]:grid-cols-2 max-[560px]:gap-[8px] max-[560px]:[&>li]:p-[12px] max-[560px]:[&_strong]:text-[18px]" aria-label={`Saldos por persona en ${currency}`}>
        {people.map((person) => {
          const tone: Tone = person.balance > 0 ? "green" : person.balance < 0 ? "coral" : "neutral";
          return (
            <li key={person.member} className={`${card} p-[16px] flex flex-col gap-[10px] ${person.member === me ? "[box-shadow:inset_0_0_0_1.5px_var(--blue)]" : ""}`}>
              <div className="flex items-center gap-[10px] min-w-0"><Avatar name={personName(person.member)} size={32} tone="blue" /><b className="text-[14px] truncate">{personName(person.member)}{person.member === me ? <span className="ml-[6px] text-[var(--blue)] text-[11px] font-semibold">Tú</span> : null}</b></div>
              <p className="m-0" data-tone={tone}><span className="block text-ink-soft text-[11.5px]">{tone === "green" ? "Le deben" : tone === "coral" ? "Debe" : "Saldo"}</span><strong className="font-display text-[22px] font-semibold tabular-nums text-[var(--tone-ink)]">{tone === "neutral" ? "Al día" : money(Math.abs(person.balance), currency)}</strong></p>
              <ProgressBar value={Math.min(person.contributed, person.owed)} max={Math.max(person.owed, 1)} tone={tone === "coral" ? "coral" : "green"} label={`${personName(person.member)} aportó ${money(person.contributed, currency)} de ${money(person.owed, currency)}`} />
              <span className="text-ink-soft text-[12px] tabular-nums">Aportó {money(person.contributed, currency)} · Le toca {money(person.owed, currency)}</span>
            </li>
          );
        })}
      </ul>
      {debts.length ? (
        <section className={`${card} overflow-hidden`} aria-labelledby="pendientes-equipo">
          <header className="flex items-center justify-between gap-[12px] py-[14px] px-[24px] border-b border-rule max-[760px]:px-[18px]"><h3 id="pendientes-equipo" className="m-0 font-display text-[16px] font-semibold">Pagos pendientes entre personas</h3><span className="text-ink-soft text-[12.5px] tabular-nums">{money(debts.reduce((sum, debt) => sum + debt.amount, 0), currency)} en total</span></header>
          <ul className="m-0 p-0 list-none [&>li:first-child]:border-t-0">{debts.map((debt) => <DebtRow key={`${debt.from}-${debt.to}`} debt={debt} busy={busy.has(`debt:${debt.from}:${debt.to}`)} onSettle={(items) => onSettle(items, `debt:${debt.from}:${debt.to}`)} />)}</ul>
        </section>
      ) : <p className={`${card} m-0 py-[16px] px-[20px] flex items-center gap-[8px] text-[var(--green-deep)] text-[14px] font-semibold`}><BadgeCheck size={18} aria-hidden="true" />Todo el equipo está al día en {currency}.</p>}
      <section className={`${card} overflow-hidden`} aria-labelledby="matriz-pagos">
        <header className="flex items-center justify-between gap-[12px] py-[14px] px-[24px] border-b border-rule flex-wrap max-[760px]:px-[18px]">
          <div><h3 id="matriz-pagos" className="m-0 font-display text-[16px] font-semibold">Quién ha pagado su parte</h3><p className="m-0 mt-[2px] text-ink-soft text-[12.5px]">Toca una casilla para registrar el pago de esa persona.</p></div>
          <Button size="sm" variant={onlyPending ? "soft" : "text"} aria-pressed={onlyPending} icon={<CircleDashed size={15} aria-hidden="true" />} onClick={() => setOnlyPending(!onlyPending)}>Solo con pendientes</Button>
        </header>
        {shown.length ? <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <caption className="sr-only">Pagos de cada persona por gasto de equipo en {currency}</caption>
            <thead><tr className="[&_th]:py-[10px] [&_th]:px-[10px] [&_th]:font-semibold [&_th]:text-ink-soft [&_th]:text-[11.5px] [&_th]:whitespace-nowrap">
              <th scope="col" className="text-left !pl-[24px] sticky left-0 bg-surface z-[1]">Gasto</th>
              {columns.map((member) => <th key={member} scope="col" className="text-center"><span className="inline-flex flex-col items-center gap-[4px]"><Avatar name={personName(member)} size={24} tone="blue" />{firstName(member)}</span></th>)}
            </tr></thead>
            <tbody>
              {shown.map(({ entry, date, detail }) => (
                <tr key={`${entry.id}:${date}`} className="border-t border-rule">
                  <th scope="row" className="text-left font-normal py-[10px] pl-[24px] pr-[12px] sticky left-0 bg-surface z-[1] min-w-[190px]"><Link href={`/admin/gastos/${entry.id}`} className="text-ink font-semibold no-underline hover:text-brand">{entry.title}</Link><span className="block text-ink-soft text-[11.5px]">{formatDate(date)} · {money(entry.amount, currency)}</span></th>
                  {columns.map((member) => {
                    const share = detail.shares.find((item) => item.member === member);
                    if (!share) return <td key={member} className="text-center text-ink-soft">—</td>;
                    if (share.state === "payer") return <td key={member} className="text-center"><span className="inline-flex items-center gap-[4px] h-[24px] px-[8px] rounded-full bg-[var(--blue-soft)] text-[var(--blue)] text-[11px] font-semibold"><Wallet size={12} aria-hidden="true" />Pagó</span></td>;
                    const done = share.state === "settled";
                    return (
                      <td key={member} className="text-center">
                        <Toggle pressed={done} disabled={busy.has(`${entry.id}:${date}`)} onPressedChange={(pressed) => onShares(entry, date, [member], pressed)} aria-label={`${personName(member)} pagó su parte de ${entry.title} del ${date}`}
                          className="inline-grid place-items-center w-[30px] h-[30px] p-0 rounded-[9px] border-0 cursor-pointer bg-transparent text-ink-soft [box-shadow:inset_0_0_0_1.5px_var(--rule-strong)] hover:[box-shadow:inset_0_0_0_1.5px_var(--green)] data-[pressed]:bg-[var(--green)] data-[pressed]:text-white data-[pressed]:[box-shadow:none] disabled:cursor-progress focus-visible:outline-2 focus-visible:outline-[var(--blue)]" title={`${money(share.share, currency)}`}>
                          {done ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : <span className="text-[10px] tabular-nums">{(share.share / 100).toFixed(0)}</span>}
                        </Toggle>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div> : <p className="m-0 py-[22px] px-[24px] text-ink-soft text-[14px]">No hay partes pendientes. <Button size="sm" variant="text" onClick={() => setOnlyPending(false)}>Ver todos los gastos</Button></p>}
      </section>
    </div>
  );
}

export function UpcomingHeader({ count, onNew }: { count: number; onNew: () => void }) {
  return <div className="flex items-center justify-between gap-[12px]"><p className="m-0 flex items-center gap-[8px] text-ink-soft text-[13.5px]"><CalendarClock size={16} aria-hidden="true" />{count} {count === 1 ? "pago pendiente" : "pagos pendientes"} en los próximos 12 meses</p><Button size="sm" variant="secondary" onClick={onNew}>Agregar gasto previsto</Button></div>;
}
