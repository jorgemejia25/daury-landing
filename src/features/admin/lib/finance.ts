import { adminAllowedEmails } from "./access";
import { isDateOnly } from "./dates";
import { object, type Metadata } from "./workspace";

export type Currency = "USD" | "GTQ";
export type FinanceData = {
  title: string; kind: "expense" | "income"; amount: number; currency: Currency; date: string; frequency: "once" | "monthly" | "yearly"; endDate: string; category: string; notes: string; paidDates: string[];
  /** Gasto de equipo: entre quiénes se divide cada vencimiento (vacío = no se reparte). */
  members?: string[];
  /** Quién pagó cada vencimiento (fecha → correo). */
  payers?: Record<string, string>;
  /** Por vencimiento, quiénes ya le devolvieron su parte a quien pagó. */
  settled?: Record<string, string[]>;
};
export type FinanceEntry = FinanceData & Metadata & { id: string };
export type FinanceOccurrence = { entry: FinanceEntry; date: string; paid: boolean; key: string };
export const money = (amount: number, currency: Currency) => new Intl.NumberFormat("es-GT", { style: "currency", currency }).format(amount / 100);
export function parseAmount(value: string) {
  if (!/^\d{1,10}([.,]\d{1,2})?$/.test(value.trim())) throw new Error("Escribe un importe positivo con hasta dos decimales, sin separadores de miles.");
  const [whole, cents = ""] = value.trim().replace(",", ".").split(".");
  const result = Number(whole) * 100 + Number(cents.padEnd(2, "0"));
  if (!Number.isSafeInteger(result) || result <= 0 || result > 100000000000) throw new Error("El importe debe ser mayor que cero y menor o igual a mil millones.");
  return result;
}
const allowed: readonly string[] = adminAllowedEmails;
/** Miembros válidos, sin repetir y en el orden del equipo (así el reparto de centavos es estable). */
export function parseMembers(value: unknown): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !allowed.includes(item))) throw new Error("Elige integrantes del equipo para repartir el gasto.");
  return allowed.filter((email) => value.includes(email));
}
export function parseFinanceData(input: unknown): Omit<FinanceData, "paidDates" | "payers" | "settled"> & { members: string[] } {
  const d = object(input);
  const text = (key: string, max: number, required = false) => { const value = d[key]; if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new Error(`Revisa ${key}.`); return value.trim(); };
  const title = text("title", 200, true), date = text("date", 10, true), endDate = d.frequency === "once" ? "" : text("endDate", 10), category = text("category", 60, true), notes = text("notes", 3000);
  if (!isDateOnly(date) || date < "1900-01-01" || date > "2200-12-31" || (endDate && (!isDateOnly(endDate) || endDate < date || endDate > "2200-12-31"))) throw new Error("Revisa las fechas del movimiento.");
  if (!["expense", "income"].includes(String(d.kind)) || !["USD", "GTQ"].includes(String(d.currency)) || !["once", "monthly", "yearly"].includes(String(d.frequency))) throw new Error("Revisa el tipo, moneda y frecuencia.");
  if (!Number.isSafeInteger(d.amount) || Number(d.amount) <= 0 || Number(d.amount) > 100000000000) throw new Error("El importe no es válido.");
  const members = d.kind === "expense" ? parseMembers(d.members) : [];
  if (members.length === 1) throw new Error("Un gasto de equipo se reparte entre dos o más personas.");
  return { title, kind: d.kind as FinanceData["kind"], amount: Number(d.amount), currency: d.currency as Currency, date, frequency: d.frequency as FinanceData["frequency"], endDate: d.frequency === "once" ? "" : endDate, category, notes, members };
}
function scheduledDate(year: number, month: number, day: number) {
  const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(day, last)).padStart(2, "0")}`;
}
export function occursOn(entry: Pick<FinanceData, "date" | "frequency" | "endDate">, date: string) {
  if (!isDateOnly(date) || date > "2200-12-31" || date < entry.date || (entry.endDate && date > entry.endDate)) return false;
  if (entry.frequency === "once") return entry.date === date;
  const [year, month, day] = date.split("-").map(Number), [, initialMonth, initialDay] = entry.date.split("-").map(Number);
  return (entry.frequency !== "yearly" || month === initialMonth) && scheduledDate(year, month - 1, initialDay) === scheduledDate(year, month - 1, day);
}
export function financeOccurrences(entries: FinanceEntry[], year: number): FinanceOccurrence[] {
  if (!Number.isInteger(year) || year < 1900 || year > 2200) return [];
  return entries.filter((entry) => !entry.archived).flatMap((entry) => {
    const [, initialMonth, day] = entry.date.split("-").map(Number);
    const dates = entry.frequency === "once" ? [entry.date] : entry.frequency === "yearly" ? [scheduledDate(year, initialMonth - 1, day)] : Array.from({ length: 12 }, (_, month) => scheduledDate(year, month, day));
    return dates.filter((date) => date.startsWith(`${year}-`) && occursOn(entry, date)).map((date) => ({ entry, date, paid: entry.paidDates.includes(date), key: `${entry.id}:${date}` }));
  }).toSorted((a, b) => a.date.localeCompare(b.date) || a.entry.title.localeCompare(b.entry.title, "es"));
}
export function financeTotals(items: FinanceOccurrence[], currency: Currency) {
  const result = { expense: 0, income: 0, paidExpense: 0, paidIncome: 0, balance: 0 };
  for (const item of items) if (item.entry.currency === currency) { result[item.entry.kind] += item.entry.amount; if (item.paid) result[item.entry.kind === "expense" ? "paidExpense" : "paidIncome"] += item.entry.amount; }
  result.balance = result.income - result.expense;
  return result;
}

// ——— Gastos de equipo ———
export const isTeamExpense = (entry: Pick<FinanceData, "kind" | "members">) => entry.kind === "expense" && (entry.members?.length ?? 0) > 1;
/** Parte de cada integrante en centavos exactos: los centavos sobrantes van a los primeros de la lista. */
export function splitShares(amount: number, members: string[]): Record<string, number> {
  if (!members.length) return {};
  const base = Math.floor(amount / members.length), extra = amount - base * members.length;
  return Object.fromEntries(members.map((member, index) => [member, base + (index < extra ? 1 : 0)]));
}
export type ShareStatus = { member: string; share: number; state: "payer" | "settled" | "pending" };
/** Estado de cada parte de un vencimiento pagado: quién pagó, quién ya devolvió y quién debe. */
export function occurrenceShares(entry: FinanceData, date: string): { payer: string; shares: ShareStatus[] } | null {
  const payer = entry.payers?.[date];
  if (!isTeamExpense(entry) || !entry.paidDates.includes(date) || !payer) return null;
  const done = new Set(entry.settled?.[date] ?? []), shares = splitShares(entry.amount, entry.members!);
  return { payer, shares: entry.members!.map((member) => ({ member, share: shares[member], state: member === payer ? "payer" : done.has(member) ? "settled" : "pending" })) };
}
export type LedgerItem = { id: string; revision: number; title: string; date: string; debtor: string; creditor: string; share: number };
/** Deuda neta entre dos personas en una moneda; `from` le debe `amount` a `to`. Saldarla marca todas sus partes. */
export type Debt = { from: string; to: string; currency: Currency; amount: number; items: LedgerItem[] };
export type PersonBalance = { member: string; currency: Currency; contributed: number; owed: number; balance: number };
/**
 * Libro del equipo con los vencimientos pagados de gastos compartidos.
 * Aportado: lo que alguien pagó menos lo que ya le devolvieron, más lo que devolvió a otros.
 * Saldo = aportado − lo que le corresponde (positivo: le deben; negativo: debe).
 */
export function teamLedger(entries: FinanceEntry[]): { people: PersonBalance[]; debts: Debt[] } {
  const people = new Map<string, PersonBalance>(), pairs = new Map<string, Debt>();
  const person = (member: string, currency: Currency) => {
    const key = `${currency}:${member}`;
    if (!people.has(key)) people.set(key, { member, currency, contributed: 0, owed: 0, balance: 0 });
    return people.get(key)!;
  };
  for (const entry of entries) {
    if (entry.archived || !isTeamExpense(entry)) continue;
    for (const date of entry.paidDates) {
      const detail = occurrenceShares(entry, date);
      if (!detail) continue;
      person(detail.payer, entry.currency).contributed += entry.amount;
      for (const { member, share, state } of detail.shares) {
        person(member, entry.currency).owed += share;
        if (state === "settled") { person(member, entry.currency).contributed += share; person(detail.payer, entry.currency).contributed -= share; }
        if (state !== "pending") continue;
        const [a, b] = [member, detail.payer].toSorted(), key = `${entry.currency}:${a}:${b}`;
        const pair = pairs.get(key) ?? { from: a, to: b, currency: entry.currency, amount: 0, items: [] };
        pair.amount += member === a ? share : -share;
        pair.items.push({ id: entry.id, revision: entry.revision, title: entry.title, date, debtor: member, creditor: detail.payer, share });
        pairs.set(key, pair);
      }
    }
  }
  for (const item of people.values()) item.balance = item.contributed - item.owed;
  const debts = [...pairs.values()].map((pair) => (pair.amount < 0 ? { ...pair, from: pair.to, to: pair.from, amount: -pair.amount } : pair)).filter((pair) => pair.items.length)
    .toSorted((a, b) => b.amount - a.amount || a.from.localeCompare(b.from));
  return { people: [...people.values()].toSorted((a, b) => b.balance - a.balance || a.member.localeCompare(b.member)), debts };
}
