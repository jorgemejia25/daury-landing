import { expect, test } from "vitest";
import { financeOccurrences, financeTotals, occursOn, parseAmount, parseFinanceData, splitShares, teamLedger, type FinanceEntry } from "./finance";
import { sampleFinance } from "./finance.fixtures";

test("los importes se guardan en centavos exactos y rechazan negativos o más decimales", () => {
  expect(parseAmount("12.50")).toBe(1250); expect(parseAmount("0,10")).toBe(10); expect(parseAmount("1.1")).toBe(110);
  for (const value of ["-1", "0", "1.234", "1e3", "1,000.00", "NaN"]) expect(() => parseAmount(value)).toThrow();
});
test("los costos mensuales ajustan el último día sin desplazar los meses posteriores", () => {
  const entries = financeOccurrences([sampleFinance], 2026);
  expect(entries).toHaveLength(12); expect(entries[1].date).toBe("2026-02-28"); expect(entries[2].date).toBe("2026-03-31");
  expect(entries[0].paid).toBe(true); expect(entries[1].paid).toBe(false);
  expect(occursOn(sampleFinance, "2026-02-27")).toBe(false);
});
test("los costos anuales y los límites de inicio y fin respetan años bisiestos", () => {
  const annual = { ...sampleFinance, date: "2024-02-29", frequency: "yearly" as const, endDate: "2027-02-28", paidDates: ["2024-02-29"] };
  expect(financeOccurrences([annual], 2025)[0].date).toBe("2025-02-28"); expect(financeOccurrences([annual], 2028)).toEqual([]);
  expect(financeOccurrences([{ ...sampleFinance, date: "2026-11-15", endDate: "2027-02-15" }], 2026)).toHaveLength(2);
});
test("los ingresos y egresos reales y previstos no mezclan USD y GTQ", () => {
  const items = financeOccurrences([sampleFinance, { ...sampleFinance, id: "income", kind: "income", currency: "GTQ", amount: 10000, frequency: "once" }], 2026);
  expect(financeTotals(items, "USD")).toEqual({ expense: 15000, income: 0, paidExpense: 1250, paidIncome: 0, balance: -15000 });
  expect(financeTotals(items, "GTQ")).toEqual({ expense: 0, income: 10000, paidExpense: 0, paidIncome: 10000, balance: 10000 });
  expect(financeOccurrences([{ ...sampleFinance, archived: true }], 2026)).toEqual([]);
});
test("valida moneda, fechas e importes e ignora marcas de pago enviadas por el editor", () => {
  expect(parseFinanceData({ ...sampleFinance, paidDates: ["2026-03-31"] })).not.toHaveProperty("paidDates");
  expect(parseFinanceData({ ...sampleFinance, frequency: "once", endDate: "2025-01-01" }).endDate).toBe("");
  expect(occursOn(sampleFinance, "2201-01-31")).toBe(false);
  for (const patch of [{ date: "2026-02-30" }, { currency: "EUR" }, { amount: 1.5 }, { endDate: "2025-01-01" }]) expect(() => parseFinanceData({ ...sampleFinance, ...patch })).toThrow();
});

test("el reparto en equipo usa centavos exactos y valida a las personas", () => {
  expect(splitShares(1000, ["a", "b", "c"])).toEqual({ a: 334, b: 333, c: 333 });
  expect(Object.values(splitShares(7001, ["a", "b", "c", "d", "e", "f", "g"])).reduce((sum, value) => sum + value, 0)).toBe(7001);
  expect(parseFinanceData({ ...sampleFinance, members: ["devjorgemejia@gmail.com", "valeryalarconra@gmail.com"] }).members).toEqual(["valeryalarconra@gmail.com", "devjorgemejia@gmail.com"]);
  expect(parseFinanceData({ ...sampleFinance, kind: "income", members: ["devjorgemejia@gmail.com", "valeryalarconra@gmail.com"] }).members).toEqual([]);
  for (const members of [["devjorgemejia@gmail.com"], ["outside@gmail.com", "devjorgemejia@gmail.com"], "todos"]) expect(() => parseFinanceData({ ...sampleFinance, members })).toThrow();
});
test("los saldos del equipo compensan lo que cada quien pagó y lo que ya devolvió", () => {
  const J = "devjorgemejia@gmail.com", V = "valeryalarconra@gmail.com", D = "estebantrampej@gmail.com";
  const base = { ...sampleFinance, frequency: "once" as const, members: [V, J, D] };
  const entries: FinanceEntry[] = [
    { ...base, id: "a", title: "Dominio", amount: 1500, date: "2026-05-18", paidDates: ["2026-05-18"], payers: { "2026-05-18": J }, settled: { "2026-05-18": [D] } },
    { ...base, id: "b", title: "Notaría", amount: 900, date: "2026-06-01", paidDates: ["2026-06-01"], payers: { "2026-06-01": V } },
    { ...base, id: "c", title: "Sin pagar", amount: 999, date: "2026-07-01", paidDates: [] },
  ];
  const { people, debts } = teamLedger(entries);
  const usd = Object.fromEntries(people.map((person) => [person.member, person]));
  expect(people.reduce((sum, person) => sum + person.balance, 0)).toBe(0);
  expect(usd[J]).toMatchObject({ contributed: 1000, owed: 800, balance: 200 });
  expect(usd[V]).toMatchObject({ contributed: 900, owed: 800, balance: 100 });
  expect(usd[D]).toMatchObject({ contributed: 500, owed: 800, balance: -300 });
  // Valery le debe 500 a Jorge y Jorge 300 a Valery: queda una sola deuda neta de 200.
  expect(debts.find((debt) => [debt.from, debt.to].includes(V) && [debt.from, debt.to].includes(J))).toMatchObject({ from: V, to: J, amount: 200 });
  expect(debts.find((debt) => debt.from === D)).toMatchObject({ to: V, amount: 300 });
});
