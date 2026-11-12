"use server";

import { Resend } from "resend";
import { ROLES, type Role } from "@/lib/site";

export type EarlyAccessState =
  | { status: "idle" }
  | { status: "success"; contact: string }
  | { status: "error"; message: string };

// Misma configuración de Resend que el sitio anterior (variables ya cargadas en Vercel).
const RECIPIENT = process.env.FORM_RECIPIENT_EMAIL ?? "devjorgemejia@gmail.com";
const FROM = process.env.RESEND_FROM_EMAIL ?? "Daury <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{8,20}$/;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function requestEarlyAccess(_prev: EarlyAccessState, formData: FormData): Promise<EarlyAccessState> {
  const contact = String(formData.get("contact") ?? "").trim().slice(0, 120);
  const roleRaw = String(formData.get("role") ?? "");
  const role: Role = (ROLES as readonly string[]).includes(roleRaw) ? (roleRaw as Role) : "Familia";

  // Honeypot anti-spam: los bots llenan este campo oculto.
  if (String(formData.get("company") ?? "")) return { status: "success", contact };

  if (!contact || !(EMAIL_RE.test(contact) || PHONE_RE.test(contact))) {
    return { status: "error", message: "Escribe un correo o un número de WhatsApp válido." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[early-access] RESEND_API_KEY no está configurada.");
    return { status: "error", message: "No pudimos registrarte ahora. Escríbenos a daurygt@gmail.com." };
  }

  try {
    const resend = new Resend(apiKey);
    const isEmail = EMAIL_RE.test(contact);
    const { error } = await resend.emails.send({
      from: FROM,
      to: RECIPIENT,
      ...(isEmail ? { replyTo: contact } : {}),
      subject: `Daury — Acceso anticipado (${role})`,
      html: `<h2>Nueva solicitud de acceso anticipado</h2>
<p><strong>Perfil:</strong> ${escapeHtml(role)}</p>
<p><strong>Contacto:</strong> ${escapeHtml(contact)}</p>
<p><strong>Fecha:</strong> ${new Date().toISOString()}</p>`,
    });
    if (error) throw new Error(error.message);
    return { status: "success", contact };
  } catch (err) {
    console.error("[early-access]", err);
    return { status: "error", message: "Algo salió mal. Intenta de nuevo en un momento." };
  }
}
