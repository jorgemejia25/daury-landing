"use server";

import { Resend } from "resend";

const RECIPIENT = process.env.FORM_RECIPIENT_EMAIL ?? "devjorgemejia@gmail.com";
const FROM =
  process.env.RESEND_FROM_EMAIL ?? "Daury <onboarding@resend.dev>";

export type InvolvedFormPayload = {
  name: string;
  email: string;
  role: string;
  message: string;
};

export type SubmitInvolvedResult =
  | { ok: true }
  | { ok: false; error: "validation" | "network" | "server" | "not_configured" };

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Sends the Get Involved form via Resend (server-side; no browser CORS).
 * Requires `RESEND_API_KEY` in the environment (Vercel project settings).
 */
export async function submitInvolvedForm(
  payload: InvolvedFormPayload,
): Promise<SubmitInvolvedResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "not_configured" };
  }

  const name = payload.name.trim();
  const email = payload.email.trim();
  const role = payload.role.trim();
  const message = payload.message.trim();

  if (!name || !email || !role) {
    return { ok: false, error: "validation" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "validation" };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: RECIPIENT,
      replyTo: email,
      subject: "Daury — New Applicant",
      html: `
        <h2>New applicant</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Role:</strong> ${escapeHtml(role)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message || "—")}</p>
      `.trim(),
    });

    if (error) {
      return { ok: false, error: "server" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}
