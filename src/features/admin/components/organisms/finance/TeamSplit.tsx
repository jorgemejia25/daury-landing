"use client";

import { useMemo, useState } from "react";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@ui-sdk/react/popover";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import { ArrowRight, Check, ChevronDown, HandCoins, Users } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { Chip } from "@/ui/atoms/Chip";
import { Card } from "@/ui/molecules/Card";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { adminAllowedEmails } from "@/features/admin/lib/access";
import { formatDate } from "@/features/admin/lib/dates";
import { getAdminFirebase } from "@/features/admin/lib/firebase-client";
import { money, occurrenceShares, splitShares, teamLedger, type Currency, type Debt, type FinanceEntry, type LedgerItem } from "@/features/admin/lib/finance";
import { personName } from "@/features/admin/lib/people";

export const teamMembers: readonly string[] = adminAllowedEmails;
const firstName = (email: string) => personName(email).split(/[\s(]/)[0];
/** Correo de la sesión, leído al abrir un popover (no durante el render). */
const sessionEmail = () => { try { return getAdminFirebase().auth.currentUser?.email?.toLowerCase() ?? ""; } catch { return ""; } };

const popover = "z-[80] w-[min(340px,calc(100vw-32px))] p-[16px] rounded-[var(--r-lg)] bg-surface text-ink [box-shadow:var(--shadow-menu)] outline-none flex flex-col gap-[12px]";
const popTitle = "m-0 font-display text-[16px] font-semibold leading-[1.3]";
const popText = "m-0 text-ink-soft text-[13px] leading-[1.5]";
const personRow = "flex items-center gap-[10px] w-full min-h-[40px] px-[10px] rounded-[10px] border-0 bg-transparent text-left text-ink text-[14px] font-medium cursor-pointer hover:bg-[var(--bg-2)] data-[pressed]:bg-[var(--blue-soft)] data-[pressed]:text-[var(--blue)] focus-visible:outline-2 focus-visible:outline-[var(--blue)]";
const box = "grid place-items-center flex-none w-[18px] h-[18px] p-0 rounded-[5px] border-[1.5px] border-[var(--rule-hover)] bg-surface text-white cursor-pointer data-[checked]:border-[var(--blue)] data-[checked]:bg-[var(--blue)] data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--blue)] focus-visible:outline-offset-2";

/** Fila de avatares superpuestos, con el excedente como «+n». */
export function AvatarStack({ members, max = 4 }: { members: string[]; max?: number }) {
  const shown = members.slice(0, max);
  return (
    <span className="inline-flex items-center" aria-hidden="true">
      {shown.map((member, index) => <span key={member} className="rounded-full [box-shadow:0_0_0_2px_var(--surface)]" style={{ marginLeft: index ? -6 : 0 }}><Avatar name={personName(member)} size={20} tone="blue" /></span>)}
      {members.length > max ? <span className="ml-[4px] text-ink-soft text-[11px] font-semibold">+{members.length - max}</span> : null}
    </span>
  );
}

/** Selector de integrantes del gasto de equipo: fichas con avatar, «Todos» y vista previa del reparto. */
export function MemberPicker({ value, onChange, amount, currency }: { value: string[]; onChange: (members: string[]) => void; amount: number | null; currency: Currency }) {
  const shares = amount && value.length > 1 ? splitShares(amount, value) : null;
  const min = shares ? Math.min(...Object.values(shares)) : 0, max = shares ? Math.max(...Object.values(shares)) : 0;
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center justify-between gap-[10px]">
        <span className="text-ink-soft text-[12px] font-semibold uppercase tracking-[0.05em] font-mono">Se divide entre · {value.length}</span>
        <span className="flex gap-[4px]">
          <Button size="sm" variant="text" disabled={value.length === teamMembers.length} onClick={() => onChange([...teamMembers])}>Todos</Button>
          <Button size="sm" variant="text" disabled={!value.length} onClick={() => onChange([])}>Ninguno</Button>
        </span>
      </div>
      <ToggleGroup multiple aria-label="Integrantes que comparten el gasto" value={value} onValueChange={(next) => onChange(teamMembers.filter((member) => next.includes(member)))} className="flex flex-wrap gap-[6px]">
        {teamMembers.map((member) => (
          <Toggle key={member} value={member} className="group inline-flex items-center gap-[7px] h-[34px] pl-[4px] pr-[12px] rounded-full border-0 bg-[var(--surface-2)] text-ink text-[13px] font-semibold cursor-pointer [box-shadow:inset_0_0_0_1px_var(--rule)] hover:bg-[var(--bg-2)] data-[pressed]:bg-[var(--blue-soft)] data-[pressed]:text-[var(--blue)] data-[pressed]:[box-shadow:inset_0_0_0_1.5px_var(--blue)] focus-visible:outline-2 focus-visible:outline-[var(--blue)]">
            <Avatar name={personName(member)} size={26} tone="blue" />
            {firstName(member)}
            <Check size={14} aria-hidden="true" className="hidden group-data-[pressed]:block" />
          </Toggle>
        ))}
      </ToggleGroup>
      {value.length === 1 ? <p role="alert" className="m-0 text-[var(--coral)] text-[13px]">Elige al menos dos personas, o desactiva el gasto de equipo.</p>
        : shares ? <p className="m-0 flex items-center gap-[8px] text-[13px] text-[var(--ink-2)]"><Users size={15} aria-hidden="true" /><span><b className="text-ink tabular-nums">{money(max, currency)}</b> por persona{min !== max ? ` (algunas pagan ${money(min, currency)})` : ""} · cada vencimiento</span></p>
        : <p className="m-0 text-ink-soft text-[13px]">Escribe el importe para ver cuánto le toca a cada persona.</p>}
    </div>
  );
}

/** «Marcar pagado» con la persona que pagó (por defecto, tú). En gastos de equipo muestra cuánto le deben. */
export function PayButton({ entry, date, disabled, onPay }: { entry: FinanceEntry; date: string; disabled: boolean; onPay: (payer: string) => void }) {
  const [open, setOpen] = useState(false), [payer, setPayer] = useState("");
  const team = (entry.members?.length ?? 0) > 1, shares = team ? splitShares(entry.amount, entry.members!) : {};
  const others = team ? entry.members!.filter((member) => member !== payer) : [];
  const owed = others.reduce((sum, member) => sum + shares[member], 0);
  return (
    <Popover open={open} onOpenChange={(next) => { if (next) setPayer(teamMembers.includes(sessionEmail()) ? sessionEmail() : entry.createdBy); setOpen(next); }}>
      <PopoverTrigger disabled={disabled} aria-label={`Marcar pagado ${entry.title} ${date}`} render={<Button size="sm" variant="secondary" icon={<Check size={15} aria-hidden="true" />}>Marcar pagado</Button>} />
      <PopoverContent className={popover} sideOffset={6}>
        <div>
          <PopoverTitle className={popTitle}>¿Quién pagó?</PopoverTitle>
          <PopoverDescription className={popText}>{entry.title} · {formatDate(date)} · {money(entry.amount, entry.currency)}</PopoverDescription>
        </div>
        <ToggleGroup aria-label="Persona que pagó" value={payer ? [payer] : []} onValueChange={([next]) => next && setPayer(next)} className="flex flex-col gap-[2px] max-h-[260px] overflow-y-auto">
          {teamMembers.map((member) => (
            <Toggle key={member} value={member} className={personRow}>
              <Avatar name={personName(member)} size={24} tone="blue" />
              <span className="flex-1 truncate">{personName(member)}</span>
              {team && !entry.members!.includes(member) ? <span className="text-ink-soft text-[11px] font-normal">no participa</span> : null}
              {member === payer ? <Check size={16} aria-hidden="true" /> : null}
            </Toggle>
          ))}
        </ToggleGroup>
        {team && payer ? <p className={popText}>{others.length} {others.length === 1 ? "persona le debe" : "personas le deben"} a {firstName(payer)}: <b className="text-ink tabular-nums">{money(owed, entry.currency)}</b> en total.</p> : null}
        <div className="flex justify-end gap-[6px]">
          <Button size="sm" variant="text" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button size="sm" disabled={!payer} onClick={() => { setOpen(false); onPay(payer); }}>Registrar pago</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Estado de las partes de un vencimiento pagado: quién pagó y quién ya devolvió, con casillas para registrarlo. */
export function SharesButton({ entry, date, disabled, onToggle }: { entry: FinanceEntry; date: string; disabled: boolean; onToggle: (members: string[], settled: boolean) => void }) {
  const detail = occurrenceShares(entry, date);
  if (!detail) return null;
  const debtors = detail.shares.filter((item) => item.state !== "payer"), done = debtors.filter((item) => item.state === "settled").length, pending = debtors.filter((item) => item.state === "pending");
  return (
    <Popover>
      <PopoverTrigger aria-label={`Partes de ${entry.title} ${date}: ${done} de ${debtors.length} devueltas`} className="inline-flex items-center gap-[8px] h-[30px] pl-[6px] pr-[10px] rounded-full border-0 bg-[var(--surface-2)] text-[var(--ink-2)] text-[12px] font-semibold cursor-pointer [box-shadow:inset_0_0_0_1px_var(--rule)] hover:text-ink data-[open]:bg-[var(--bg-2)] focus-visible:outline-2 focus-visible:outline-[var(--blue)]">
        <AvatarStack members={entry.members!} />
        <span className="tabular-nums">{done}/{debtors.length}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent className={popover} sideOffset={6}>
        <div>
          <PopoverTitle className={popTitle}>Partes de «{entry.title}»</PopoverTitle>
          <PopoverDescription className={popText}>Pagó {personName(detail.payer)} el {formatDate(date)}. Marca a quien ya le devolvió su parte.</PopoverDescription>
        </div>
        <ul className="m-0 p-0 list-none flex flex-col gap-[2px]">
          {detail.shares.map(({ member, share, state }) => (
            <li key={member}>
              <label className="flex items-center gap-[10px] min-h-[38px] px-[8px] rounded-[10px] hover:bg-[var(--bg-2)] cursor-pointer has-[[data-disabled]]:cursor-default">
                <Checkbox className={box} checked={state !== "pending"} disabled={disabled || state === "payer"} onCheckedChange={(value) => onToggle([member], value === true)} aria-label={`${personName(member)} devolvió su parte`}>
                  <CheckboxIndicator><Check size={12} strokeWidth={3.2} aria-hidden="true" /></CheckboxIndicator>
                </Checkbox>
                <Avatar name={personName(member)} size={22} tone="blue" />
                <span className="flex-1 truncate text-[14px] font-medium">{personName(member)}</span>
                {state === "payer" ? <Chip size="sm" tone="blue">Pagó</Chip> : <span className={`tabular-nums text-[13px] ${state === "settled" ? "text-ink-soft line-through" : "text-ink font-semibold"}`}>{money(share, entry.currency)}</span>}
              </label>
            </li>
          ))}
        </ul>
        {pending.length > 1 ? <Button size="sm" variant="secondary" disabled={disabled} onClick={() => onToggle(pending.map((item) => item.member), true)}>Todos devolvieron su parte</Button> : null}
      </PopoverContent>
    </Popover>
  );
}

/** Saldos del equipo: cuánto aportó cada persona, cuánto le corresponde y quién le debe a quién. */
export function TeamBalances({ entries, busy, onSettle }: { entries: FinanceEntry[]; busy: boolean; onSettle: (items: LedgerItem[]) => void }) {
  const ledger = useMemo(() => teamLedger(entries), [entries]);
  const currencies = (["USD", "GTQ"] as Currency[]).filter((unit) => ledger.people.some((person) => person.currency === unit));
  if (!currencies.length) return (
    <Card><EmptyState icon={<Users size={25} aria-hidden="true" />} tone="blue" title="Aún no hay gastos de equipo pagados">Activa «Gasto de equipo» en un gasto para dividirlo entre las personas elegidas. Al marcarlo pagado, eliges quién pagó y aquí ves quién le debe a quién.</EmptyState></Card>
  );
  return (
    <div className="flex flex-col gap-[20px]">
      {currencies.map((unit) => {
        const people = ledger.people.filter((person) => person.currency === unit), debts = ledger.debts.filter((debt) => debt.currency === unit);
        const pending = debts.reduce((sum, debt) => sum + debt.amount, 0);
        return (
          <Card key={unit} padding="none">
            <div className="flex justify-between items-center gap-[12px] py-[20px] px-[24px] max-[760px]:px-[18px]">
              <div className="min-w-0"><h3 className="m-0 font-display text-[18px] font-semibold leading-[1.4]">Saldos del equipo · {unit}</h3><p className="m-0 mt-[4px] text-ink-soft text-[13px]">{pending ? `Pendiente de devolver: ${money(pending, unit)}` : "Todo el equipo está al día."}</p></div>
            </div>
            <ul className="m-0 p-0 list-none">
              {people.map((person) => (
                <li key={person.member} className="flex items-center gap-[12px] py-[14px] px-[24px] border-t border-rule max-[760px]:px-[18px] max-[560px]:flex-wrap">
                  <Avatar name={personName(person.member)} size={34} tone="blue" />
                  <div className="flex-1 min-w-0 flex flex-col gap-[2px]"><b className="text-[15px] leading-[1.4] truncate">{personName(person.member)}</b><small className="text-ink-soft text-[12px] tabular-nums">Aportó {money(person.contributed, unit)} · Le corresponde {money(person.owed, unit)}</small></div>
                  <Chip size="sm" tone={person.balance > 0 ? "green" : person.balance < 0 ? "coral" : "neutral"}>{person.balance > 0 ? `Le deben ${money(person.balance, unit)}` : person.balance < 0 ? `Debe ${money(-person.balance, unit)}` : "Al día"}</Chip>
                </li>
              ))}
            </ul>
            {debts.length ? <>
              <h4 className="m-0 pt-[18px] pb-[8px] px-[24px] border-t border-rule text-ink-soft text-[12px] font-semibold uppercase tracking-[0.05em] font-mono max-[760px]:px-[18px]">Pagos pendientes entre personas</h4>
              <ul className="m-0 p-0 list-none">{debts.map((debt) => <DebtRow key={`${debt.from}-${debt.to}`} debt={debt} busy={busy} onSettle={onSettle} />)}</ul>
            </> : null}
          </Card>
        );
      })}
    </div>
  );
}

function DebtRow({ debt, busy, onSettle }: { debt: Debt; busy: boolean; onSettle: (items: LedgerItem[]) => void }) {
  const gastos = new Set(debt.items.map((item) => `${item.id}:${item.date}`)).size;
  return (
    <li className="py-[12px] px-[24px] border-t border-rule max-[760px]:px-[18px]">
      <div className="flex items-center gap-[10px] max-[560px]:flex-wrap">
        <span className="flex items-center gap-[8px] flex-1 min-w-0 text-[14px] font-semibold max-[560px]:basis-full">
          <Avatar name={personName(debt.from)} size={26} tone="coral" /><span className="truncate">{firstName(debt.from)}</span>
          <ArrowRight size={15} aria-label="le debe a" className="flex-none text-ink-soft" />
          <Avatar name={personName(debt.to)} size={26} tone="green" /><span className="truncate">{firstName(debt.to)}</span>
        </span>
        <strong className="tabular-nums text-[16px] max-[560px]:mr-auto">{money(debt.amount, debt.currency)}</strong>
        <Popover>
          <PopoverTrigger render={<Button size="sm" variant="text">{gastos} {gastos === 1 ? "gasto" : "gastos"}</Button>} />
          <PopoverContent className={popover} sideOffset={6}>
            <PopoverTitle className={popTitle}>{firstName(debt.from)} y {firstName(debt.to)}</PopoverTitle>
            <PopoverDescription className={popText}>Partes pendientes que se compensan en el saldo.</PopoverDescription>
            <ul className="m-0 p-0 list-none flex flex-col gap-[6px] text-[13px]">
              {debt.items.map((item) => <li key={`${item.id}:${item.date}:${item.debtor}`} className="flex justify-between gap-[10px]"><span className="min-w-0 truncate">{item.title} · {formatDate(item.date)}<br /><small className="text-ink-soft">{firstName(item.debtor)} → {firstName(item.creditor)}</small></span><b className="tabular-nums">{money(item.share, debt.currency)}</b></li>)}
            </ul>
          </PopoverContent>
        </Popover>
        <Button size="sm" variant="secondary" disabled={busy} icon={<HandCoins size={15} aria-hidden="true" />} aria-label={`Marcar saldado: ${personName(debt.from)} le pagó ${money(debt.amount, debt.currency)} a ${personName(debt.to)}`} onClick={() => onSettle(debt.items)}>Saldado</Button>
      </div>
    </li>
  );
}
