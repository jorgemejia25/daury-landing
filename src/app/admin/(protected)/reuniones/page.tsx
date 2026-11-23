import type { Metadata } from "next";
import { requireAdminSession } from "@/features/admin/server/session";
import { MeetingsWorkspace } from "@/features/admin/components/organisms/meetings/MeetingsWorkspace";

export const metadata: Metadata = { title: "Reuniones" };

export default async function MeetingsRoute() {
  await requireAdminSession();
  return <MeetingsWorkspace />;
}
