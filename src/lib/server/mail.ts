import "server-only";
import { env, isMailConfigured } from "./env";

/**
 * Envío de correos mediante la API de Resend (https://resend.com).
 * Requiere RESEND_API_KEY y MAIL_FROM (dominio verificado en Resend).
 * Si no está configurado, no envía nada y devuelve false.
 */
export async function sendMail(to: string, subject: string, html: string, replyTo?: string) {
  if (!isMailConfigured() || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.mailFrom, to: [to], subject, html, reply_to: replyTo }),
    });
    if (!res.ok) console.error("[mail] Resend respondió", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[mail] error", e);
    return false;
  }
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
