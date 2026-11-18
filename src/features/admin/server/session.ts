import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "./firebase-admin";
import { hasAdminAccess, type AdminUser } from "@/features/admin/lib/access";

export const adminSessionCookie = process.env.NODE_ENV === "production"
  ? "__Host-daury-admin" : "daury-admin";

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function verifyAdminToken(token: string) {
  const claims = await getAdminAuth().verifyIdToken(token);
  if (!hasAdminAccess(claims) || claims.exp <= Math.floor(Date.now() / 1000)) return null;
  return {
    user: {
      uid: claims.uid,
      email: claims.email!.toLowerCase(),
      name: typeof claims.name === "string" ? claims.name : claims.email!,
    } satisfies AdminUser,
    expiresAt: claims.exp,
  };
}

export const getAdminSession = cache(async () => {
  const token = (await cookies()).get(adminSessionCookie)?.value;
  if (!token || token.length > 4096) return null;
  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
});

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session.user;
}
