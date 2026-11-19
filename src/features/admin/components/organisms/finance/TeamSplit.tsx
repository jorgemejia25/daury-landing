"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@ui-sdk/react/popover";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import { ArrowRight, Check, HandCoins, Users } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { adminAllowedEmails } from "@/features/admin/lib/access";
import { formatDate } from "@/features/admin/lib/dates";
import { getAdminFirebase } from "@/features/admin/lib/firebase-client";
import { money, splitShares, type Currency, type Debt, type FinanceEntry, type LedgerItem } from "@/features/admin/lib/finance";
import { personName } from "@/features/admin/lib/people";

export const teamMembers: readonly string[] = adminAllowedEmails;
const firstName = (email: string) => personName(email).split(/[\s(]/)[0];
/** Correo de la sesión, leído al abrir un popover (no durante el render). */
const sessionEmail = () => { try { return getAdminFirebase().auth.currentUser?.email?.toLowerCase() ?? ""; } catch { return ""; } };

const popover = "z-[80] w-[min(340px,calc(100vw-32px))] p-[16px] rounded-[var(--r-lg)] bg-surface text-ink [box-shadow:var(--shadow-menu)] outline-none flex flex-col gap-[12px]";
const popTitle = "m-0 font-display text-[16px] font-semibold leading-[1.3]";
const popText = "m-0 text-ink-soft text-[13px] leading-[1.5]";
const personRow = "flex items-center gap-[10px] w-full min-h-[40px] px-[10px] rounded-[10px] border-0 bg-transparent text-left text-ink text-[14px] font-medium cursor-pointer hover:bg-[var(--bg-2)] data-[pressed]:bg-[var(--blue-soft)] data-[pressed]:text-[var(--blue)] focus-visible:outline-2 focus-visible:outline-[var(--blue)]";

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

export function DebtRow({ debt, busy, onSettle }: { debt: Debt; busy: boolean; onSettle: (items: LedgerItem[]) => void }) {
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
