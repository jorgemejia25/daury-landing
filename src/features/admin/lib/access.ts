export const adminAllowedEmails = [
  "valeryalarconra@gmail.com",
  "acariaaas.07@gmail.com",
  "daniel1ajedrez@gmail.com",
  "yury.alexander2005@gmail.com",
  "fatimacerezo2411@gmail.com",
  "devjorgemejia@gmail.com",
] as const;

export type AdminUser = { uid: string; email: string; name: string };

export function hasAdminAccess(claims: {
  email?: unknown;
  email_verified?: unknown;
  firebase?: { sign_in_provider?: unknown };
}) {
  const email = typeof claims.email === "string" ? claims.email.toLowerCase() : null;
  return (
    claims.email_verified === true &&
    claims.firebase?.sign_in_provider === "google.com" &&
    adminAllowedEmails.some((allowed) => allowed === email)
  );
}
