import { isDateOnly } from "./dates";
import { object, type Metadata } from "./workspace";

export type Currency = "USD" | "GTQ";
export type FinanceData = { title: string; kind: "expense" | "income"; amount: number; currency: Currency; date: string; frequency: "once" | "monthly" | "yearly"; endDate: string; category: string; notes: string; paidDates: string[] };
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
export function parseFinanceData(input: unknown): Omit<FinanceData, "paidDates"> {
  const d = object(input);
  const text = (key: string, max: number, required = false) => { const value = d[key]; if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new Error(`Revisa ${key}.`); return value.trim(); };
  const title = text("title", 200, true), date = text("date", 10, true), endDate = d.frequency === "once" ? "" : text("endDate", 10), category = text("category", 60, true), notes = text("notes", 3000);
  if (!isDateOnly(date) || date < "1900-01-01" || date > "2200-12-31" || (endDate && (!isDateOnly(endDate) || endDate < date || endDate > "2200-12-31"))) throw new Error("Revisa las fechas del movimiento.");
  if (!["expense", "income"].includes(String(d.kind)) || !["USD", "GTQ"].includes(String(d.currency)) || !["once", "monthly", "yearly"].includes(String(d.frequency))) throw new Error("Revisa el tipo, moneda y frecuencia.");
  if (!Number.isSafeInteger(d.amount) || Number(d.amount) <= 0 || Number(d.amount) > 100000000000) throw new Error("El importe no es válido.");
  return { title, kind: d.kind as FinanceData["kind"], amount: Number(d.amount), currency: d.currency as Currency, date, frequency: d.frequency as FinanceData["frequency"], endDate: d.frequency === "once" ? "" : endDate, category, notes };
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
