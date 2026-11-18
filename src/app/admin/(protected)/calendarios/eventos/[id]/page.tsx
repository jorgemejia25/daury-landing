import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/features/admin/server/session";
import { EventPage } from "@/features/admin/components/organisms/workspace/EventPage";

export const metadata: Metadata = { title: "Evento" };

export default async function EventRoute({ params }: PageProps<"/admin/calendarios/eventos/[id]">) {
  await requireAdminSession();
  const { id } = await params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id)) notFound();
  return <EventPage id={id} />;
}
