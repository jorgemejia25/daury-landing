import { expect, test } from "vitest";
import { financeOccurrences, financeTotals, occursOn, parseAmount, parseFinanceData } from "./finance";
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
