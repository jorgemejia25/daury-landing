import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/features/admin/server/session";
import { MeetingPage } from "@/features/admin/components/organisms/meetings/MeetingPage";

export const metadata: Metadata = { title: "Reunión" };

export default async function MeetingRoute({ params }: PageProps<"/admin/reuniones/[id]">) {
  await requireAdminSession();
  const { id } = await params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id)) notFound();
  return <MeetingPage id={id} />;
}
