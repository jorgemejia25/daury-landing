"use server";

import { randomUUID } from "node:crypto";
import { workspaceStore } from "../server/firestore-rest";
import { isTeamExpense, occursOn, parseFinanceData, type FinanceData } from "../lib/finance";
import { adminAllowedEmails } from "../lib/access";
import { validId } from "../lib/workspace";

const team: readonly string[] = adminAllowedEmails;
type Payments = { payers: Record<string, string>; settled: Record<string, string[]> };
/** Quién pagó y quién devolvió, limpiado: solo fechas pagadas y, en lo devuelto, integrantes actuales distintos de quien pagó. */
function payments(previous: Record<string, unknown> | undefined, paidDates: string[], members: string[]): Payments {
  const payers = Object.fromEntries(Object.entries((previous?.payers ?? {}) as Record<string, string>).filter(([date, email]) => paidDates.includes(date) && team.includes(email)));
  const settled = Object.fromEntries(Object.entries((previous?.settled ?? {}) as Record<string, string[]>)
    .map(([date, list]) => [date, list.filter((email) => members.includes(email) && email !== payers[date])] as const)
    .filter(([date, list]) => payers[date] && list.length));
  return { payers, settled };
}
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
    await store.commit([{ collection: "financeEntries", id, previous, data: { ...data, paidDates, ...payments(previous?.data, paidDates, data.members), revision, archived: false, createdBy: previous?.data.createdBy ?? store.user.email, createdAt: previous?.data.createdAt ?? now, updatedBy: store.user.email, updatedAt: now } }]);
    return { ok: true as const, id, revision };
  } catch (error) { return failure(error); }
}
/** Marca un vencimiento como pagado (y quién lo pagó, por defecto tú) o lo devuelve a pendiente. */
export async function settleFinanceEntry(id: string, revision: number, date: string, paid: boolean, payer?: string) {
  try {
    validId(id); if (typeof paid !== "boolean") throw new Error("Estado no válido.");
    if (payer !== undefined && (typeof payer !== "string" || !team.includes(payer))) throw new Error("Elige a una persona del equipo como quien pagó.");
    const store = await workspaceStore(), previous = await store.get("financeEntries", id);
    if (!previous || previous.data.archived || previous.data.revision !== revision) throw new Error("El movimiento cambió. Actualiza e inténtalo de nuevo.");
    if (!occursOn(previous.data as unknown as FinanceData, date)) throw new Error("La fecha no corresponde a este movimiento.");
    const dates = new Set(previous.data.paidDates as string[]); if (paid) dates.add(date); else dates.delete(date);
    if (dates.size > 1200) throw new Error("El plan alcanzó su límite de 1200 pagos. Crea un nuevo plan.");
    const entry = previous.data as unknown as FinanceData, members = (entry.members ?? []) as string[];
    const recorded = { payers: { ...(entry.payers ?? {}) }, settled: { ...(entry.settled ?? {}) } };
    if (paid && entry.kind === "expense") recorded.payers[date] = payer ?? store.user.email;
    if (!paid) { delete recorded.payers[date]; delete recorded.settled[date]; }
    const paidDates = [...dates].sort();
    await store.commit([{ collection: "financeEntries", id, previous, data: { ...previous.data, paidDates, ...payments(recorded, paidDates, members), revision: revision + 1, updatedBy: store.user.email, updatedAt: new Date().toISOString() } }]);
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
/**
 * Registra que una o varias personas devolvieron su parte de gastos de equipo ya pagados
 * (o lo deshace). Todo se guarda junto: si algún movimiento cambió, no se guarda nada.
 */
export async function settleTeamShares(items: { id: string; revision: number; date: string; member: string }[], settled: boolean) {
  try {
    if (!Array.isArray(items) || !items.length || items.length > 200 || typeof settled !== "boolean") throw new Error("Selecciona partes válidas.");
    const store = await workspaceStore(), byId = new Map<string, typeof items>();
    for (const item of items) { validId(item.id); byId.set(item.id, [...(byId.get(item.id) ?? []), item]); }
    if (byId.size > 50) throw new Error("Salda como máximo 50 movimientos a la vez.");
    const now = new Date().toISOString(), writes = [];
    for (const [id, list] of byId) {
      const previous = await store.get("financeEntries", id), entry = previous?.data as unknown as (FinanceData & { archived: boolean; revision: number }) | undefined;
      if (!previous || !entry || entry.archived || list.some((item) => item.revision !== entry.revision)) throw new Error("Un gasto cambió mientras tanto. Actualiza e inténtalo de nuevo.");
      if (!isTeamExpense(entry)) throw new Error(`«${entry.title}» no es un gasto de equipo.`);
      const next = { ...(entry.settled ?? {}) };
      for (const { date, member } of list) {
        const payer = entry.payers?.[date];
        if (!entry.paidDates.includes(date) || !payer) throw new Error(`Primero marca como pagado «${entry.title}» del ${date}.`);
        if (!entry.members!.includes(member) || member === payer) throw new Error("Esa persona no debe una parte de este gasto.");
        const current = new Set(next[date] ?? []); if (settled) current.add(member); else current.delete(member);
        next[date] = entry.members!.filter((email) => current.has(email));
      }
      writes.push({ collection: "financeEntries", id, previous, data: { ...previous.data, ...payments({ payers: entry.payers, settled: next }, entry.paidDates, entry.members!), revision: entry.revision + 1, updatedBy: store.user.email, updatedAt: now } });
    }
    await store.commit(writes);
    return { ok: true as const };
  } catch (error) { return failure(error); }
}
