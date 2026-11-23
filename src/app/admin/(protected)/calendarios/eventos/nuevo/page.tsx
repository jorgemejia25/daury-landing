import type { Metadata } from "next";
import { requireAdminSession } from "@/features/admin/server/session";
import { isDateOnly } from "@/features/admin/lib/dates";
import { EventPage } from "@/features/admin/components/organisms/workspace/EventPage";

export const metadata: Metadata = { title: "Nuevo evento" };

export default async function NewEventPage({ searchParams }: PageProps<"/admin/calendarios/eventos/nuevo">) {
  await requireAdminSession();
  const { fecha, reunion } = await searchParams;
  return <EventPage date={typeof fecha === "string" && isDateOnly(fecha) ? fecha : undefined} meeting={reunion === "1"} />;
}
