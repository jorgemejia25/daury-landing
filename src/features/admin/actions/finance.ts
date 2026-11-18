"use server";

import { randomUUID } from "node:crypto";
import { workspaceStore } from "../server/firestore-rest";
import { occursOn, parseFinanceData, type FinanceData } from "../lib/finance";
import { validId } from "../lib/workspace";

const failure = (error: unknown) => ({ ok: false as const, error: error instanceof Error && !error.message.startsWith("NEXT_") ? error.message : "Inicia sesión para continuar." });
export async function saveFinanceEntry(input: { id?: string; revision?: number; data: unknown }) {
  try {
    const store = await workspaceStore(), id = input.id ?? randomUUID(); validId(id);
    const previous = input.id ? await store.get("financeEntries", id) : null;
    if (input.id && (!previous || previous.data.revision !== input.revision)) throw new Error("Otra persona modificó este movimiento. Vuelve a abrirlo para cargar los cambios.");
    if (previous?.data.archived) throw new Error("Restaura el movimiento antes de editarlo.");
    const data = parseFinanceData(input.data), paidDates = (previous?.data.paidDates ?? []) as string[];
    if (paidDates.length && ["amount", "currency", "kind", "date", "frequency"].some((key) => previous?.data[key] !== data[key as keyof typeof data])) throw new Error("El movimiento tiene pagos registrados. Conserva su importe, moneda, tipo, fecha y frecuencia; crea otro plan para los cambios futuros.");
    if (paidDates.some((date) => !occursOn(data, date))) throw new Error("La fecha de fin no puede excluir pagos ya registrados.");
    const now = new Date().toISOString(), revision = Number(previous?.data.revision ?? 0) + 1;
    await store.commit([{ collection: "financeEntries", id, previous, data: { ...data, paidDates, revision, archived: false, createdBy: previous?.data.createdBy ?? store.user.email, createdAt: previous?.data.createdAt ?? now, updatedBy: store.user.email, updatedAt: now } }]);
    return { ok: true as const, id, revision };
  } catch (error) { return failure(error); }
}
export async function settleFinanceEntry(id: string, revision: number, date: string, paid: boolean) {
  try {
    validId(id); if (typeof paid !== "boolean") throw new Error("Estado no válido.");
    const store = await workspaceStore(), previous = await store.get("financeEntries", id);
    if (!previous || previous.data.archived || previous.data.revision !== revision) throw new Error("El movimiento cambió. Actualiza e inténtalo de nuevo.");
    if (!occursOn(previous.data as unknown as FinanceData, date)) throw new Error("La fecha no corresponde a este movimiento.");
    const dates = new Set(previous.data.paidDates as string[]); if (paid) dates.add(date); else dates.delete(date);
    if (dates.size > 1200) throw new Error("El plan alcanzó su límite de 1200 pagos. Crea un nuevo plan.");
    await store.commit([{ collection: "financeEntries", id, previous, data: { ...previous.data, paidDates: [...dates].sort(), revision: revision + 1, updatedBy: store.user.email, updatedAt: new Date().toISOString() } }]);
    return { ok: true as const };
  } catch (error) { return failure(error); }
}
export async function archiveFinanceEntry(id: string, revision: number, archived: boolean) {
  try {
    validId(id); if (typeof archived !== "boolean") throw new Error("Estado no válido.");
    const store = await workspaceStore(), previous = await store.get("financeEntries", id);
    if (!previous || previous.data.revision !== revision) throw new Error("El movimiento cambió. Actualiza e inténtalo de nuevo.");
    await store.commit([{ collection: "financeEntries", id, previous, data: { ...previous.data, archived, revision: revision + 1, updatedBy: store.user.email, updatedAt: new Date().toISOString() } }]);
    return { ok: true as const };
  } catch (error) { return failure(error); }
}
