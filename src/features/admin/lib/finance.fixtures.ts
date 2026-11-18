import type { FinanceEntry } from "./finance";
import { samplePage } from "./workspace.fixtures";
export const sampleFinance: FinanceEntry = { id: "hosting", title: "Hosting Daury", kind: "expense", amount: 1250, currency: "USD", date: "2026-01-31", frequency: "monthly", endDate: "", category: "Infraestructura", notes: "Servidor", paidDates: ["2026-01-31"], revision: 1, archived: false, createdBy: samplePage.createdBy, updatedBy: samplePage.updatedBy, createdAt: samplePage.createdAt, updatedAt: samplePage.updatedAt };
